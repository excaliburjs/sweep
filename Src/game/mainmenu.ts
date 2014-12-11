/// <reference path="../scripts/typings/Cookies.d.ts"/>

class MainMenu extends ex.UIActor {

   private _logo: ex.Actor;
   private _standardButton: ex.UIActor;
   private _challengeButton: ex.UIActor;
   private _muteMusicButton: ex.UIActor;
   private _muteSoundButton: ex.UIActor;
   private _show = false;
   private _showing = false;
   private _hide = false;
   private _hiding = false;

   private static _StandardButtonPos = new ex.Point(42, 170);
   private static _ChallengeButtonPos = new ex.Point(42, 170 + Config.MainMenuButtonHeight + 20);
   private static _LogoPos = new ex.Point(0, 50);
   private static _LoadAfterTutorial = false;

   constructor() {
      super();

      this.color = new ex.Color(0, 0, 0, 0.9);
   }

   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);

      this._logo = new ex.UIActor();
      this._logo.addDrawing(Resources.TextureLogo.asSprite());
      this._logo.currentDrawing.setScaleX(0.7 * gameScale.x);
      this._logo.currentDrawing.setScaleY(0.7 * gameScale.y);
      this._logo.currentDrawing.transformAboutPoint(new ex.Point(0.5, 0.5));

      this._standardButton = new MenuButton(Resources.TextureStandardBtn.asSprite(), MainMenu.LoadStandardMode, this.x, this.y + MainMenu._StandardButtonPos.y);
      this._challengeButton = new MenuButton(Resources.TextureChallengeBtn.asSprite(), MainMenu.LoadChallengeMode, this.x, this.y + MainMenu._ChallengeButtonPos.y);

      game.add(this._logo);
      game.add(this._standardButton);
      game.add(this._challengeButton);

      document.getElementById("dismiss-normal-modal").addEventListener("click", _.bind(this._dismissNormalTutorial, this));
      document.getElementById("dismiss-challenge-modal").addEventListener("click", _.bind(this._dismissChallengeTutorial, this));

      var tutNormalIdx = 0;
      var tutChallengeIdx = 0;
      document.getElementById("tutorial-normal-next").addEventListener("click", (e) => {
         e.preventDefault();

         var slides = <NodeListOf<HTMLElement>>document.querySelectorAll("#tutorial-normal .slide");

         if (slides.length <= 0) return;

         if (slides.length === (tutNormalIdx + 1)) {
            tutNormalIdx = 0;
            document.getElementById("tutorial-normal-next").innerHTML = "Next";
            this._dismissNormalTutorial();
            return;
         }

         if (slides.length - 1 === tutNormalIdx + 1) {
            document.getElementById("tutorial-normal-next").innerHTML = "Got it!";
         } else {
            document.getElementById("tutorial-normal-next").innerHTML = "Next";
         }

         tutNormalIdx = (tutNormalIdx + 1) % slides.length;

         for (var i = 0; i < slides.length; i++) {
            slides[i].classList.add("hide");
         }
         slides[tutNormalIdx].classList.remove("hide");

         return;
      });
      document.getElementById("tutorial-challenge-next").addEventListener("click", (e) => {
         e.preventDefault();

         var slides = <NodeListOf<HTMLElement>>document.querySelectorAll("#tutorial-challenge .slide");

         if (slides.length <= 0) return;

         if (slides.length === (tutChallengeIdx + 1)) {
            tutChallengeIdx = 0;
            document.getElementById("tutorial-challenge-next").innerHTML = "Next";
            this._dismissChallengeTutorial();
            return;
         }

         if (slides.length - 1 === tutChallengeIdx + 1) {
            document.getElementById("tutorial-challenge-next").innerHTML = "Got it!";
         } else {
            document.getElementById("tutorial-challenge-next").innerHTML = "Next";
         }

         tutChallengeIdx = (tutChallengeIdx + 1) % slides.length;

         for (var i = 0; i < slides.length; i++) {
            slides[i].classList.add("hide");
         }
         slides[tutChallengeIdx].classList.remove("hide");

         return;
      });

      this.show();
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      var vgp = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.y));

      this.x = vgp.x;
      this.y = vgp.y;
      this.setWidth(visualGrid.getWidth());
      this.setHeight(visualGrid.getHeight());

      this._standardButton.x = this.getCenter().x - (this._standardButton.getWidth() / 2);
      this._standardButton.y = this.y + MainMenu._StandardButtonPos.y * this._standardButton.scale.y;
      this._challengeButton.x = this.getCenter().x - (this._challengeButton.getWidth() / 2);
      this._challengeButton.y = this.y + MainMenu._ChallengeButtonPos.y * this._challengeButton.scale.y;

      if (this._show) {
         this._show = false;
         this._showing = true;
         // ease out logo
         this._logo.x = this.getCenter().x;
         this._logo.y = -70;
         this._logo
            .easeTo(this.getCenter().x, this.y + MainMenu._LogoPos.y, 650, ex.EasingFunctions.EaseInOutQuad)
            .callMethod(() => this._showing = false);
      } else if (!this._showing) {
         this._logo.x = this.getCenter().x;
         this._logo.y = this.y + MainMenu._LogoPos.y;
      }

      if (this._hide) {
         // todo transition
      }
   }

   public show() {
      matcher.inMainMenu = true;
      this.visible = true;
      this._logo.visible = true;
      this._standardButton.visible = true;
      this._standardButton.enableCapturePointer = true;
      this._challengeButton.visible = true;
      this._challengeButton.enableCapturePointer = true;
      this._show = true;
      this._hide = false;
   }

   public hide() {
      matcher.inMainMenu = false;
      this.visible = false;
      this._logo.visible = false;
      this._standardButton.visible = false;
      this._standardButton.enableCapturePointer = false;
      this._challengeButton.visible = false;
      this._challengeButton.enableCapturePointer = false;
      this._show = false;
      this._hide = true;
   }

   private _dismissNormalTutorial() {
      removeClass(document.getElementById("tutorial-normal"), "show");
      MainMenu._markTutorialAsDone(GameMode.Standard);
      if (MainMenu._LoadAfterTutorial) {
         MainMenu._LoadAfterTutorial = false;
         MainMenu.LoadStandardMode(true);
         return;
      }
      if (gameMode !== GameMode.Standard) MainMenu.LoadStandardMode(true);
   }

   private _dismissChallengeTutorial() {
      removeClass(document.getElementById("tutorial-challenge"), "show");
      MainMenu._markTutorialAsDone(GameMode.Timed);
      if (MainMenu._LoadAfterTutorial) {
         MainMenu._LoadAfterTutorial = false;
         MainMenu.LoadChallengeMode(true);
         return;
      }
      if (gameMode !== GameMode.Timed) MainMenu.LoadChallengeMode(true);
   }

   private static _markTutorialAsDone(gameMode: GameMode) {
      Cookies.set("ld-31-tutorial-" + gameMode, "1", { expires: new Date(2020, 0, 1) });
   }

   private static _hasFinishedTutorial(gameMode: GameMode): boolean {
      var c = Cookies.get("ld-31-tutorial-" + gameMode);

      ex.Logger.getInstance().info("Retrieved tutorial cookie: tutorial-" + gameMode, c);

      return c && c === "1";
   }

   public static ShowNormalTutorial() {
      // play normal tutorial
      removeClass(document.getElementById("game-over"), "show");
      addClass(document.getElementById("tutorial-normal"), "show");
   }

   public static ShowChallengeTutorial() {
      removeClass(document.getElementById("game-over"), "show");
      addClass(document.getElementById("tutorial-challenge"), "show");
   }

   // todo move loadConfig logic to here so we can manage state better?

   public static LoadStandardMode(skipTutorialCheck = false) {
      ex.Logger.getInstance().info("Loading standard mode");

      skipTutorialCheck = (typeof skipTutorialCheck === "boolean" && skipTutorialCheck);

      if (!skipTutorialCheck && !MainMenu._hasFinishedTutorial(GameMode.Standard)) {
         MainMenu._LoadAfterTutorial = true;
         MainMenu.ShowNormalTutorial();
      } else {
         loadConfig(Config.loadCasual);
         mainMenu.hide();
      }
   }

   public static LoadChallengeMode(skipTutorial = false) {
      ex.Logger.getInstance().info("Loading challenge mode");

      skipTutorial = (typeof skipTutorial === "boolean" && skipTutorial);

      if (!skipTutorial && !MainMenu._hasFinishedTutorial(GameMode.Timed)) {
         MainMenu._LoadAfterTutorial = true;
         MainMenu.ShowChallengeTutorial();
      } else {
         loadConfig(Config.loadSurvivalReverse);
         mainMenu.hide();
      }
   }
}

class MenuButton extends ex.UIActor {

   constructor(sprite: ex.Sprite, public action: () => void, x: number, y: number) {
      super(x, y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight);

      this.scale.setTo(ex.Util.clamp(gameScale.x, 0, 1), ex.Util.clamp(gameScale.y, 0, 1));
      //this.setCenterDrawing(true);
      this.addDrawing(sprite);
      this.off("pointerup", this.action);
      this.on("pointerup", this.action);
   }

}