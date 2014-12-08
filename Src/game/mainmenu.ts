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

   constructor() {
      super();

      this.color = new ex.Color(0, 0, 0, 0.9);                     
   }

   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);

      this._logo = new ex.UIActor();
      this._logo.addDrawing(Resources.TextureLogo.asSprite());
      this._logo.currentDrawing.setScaleX(0.7);
      this._logo.currentDrawing.setScaleY(0.7);
      this._logo.currentDrawing.transformAboutPoint(new ex.Point(0.5, 0.5));     

      this._standardButton = new MenuButton(Resources.TextureStandardBtn.asSprite(), MainMenu.LoadStandardMode, this.x, this.y + MainMenu._StandardButtonPos.y);
      this._challengeButton = new MenuButton(Resources.TextureChallengeBtn.asSprite(), MainMenu.LoadChallengeMode, this.x, this.y + MainMenu._ChallengeButtonPos.y);

      game.add(this._logo);
      game.add(this._standardButton);
      game.add(this._challengeButton);

      this.show();
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      var vgp = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.y));

      this.x = vgp.x;
      this.y = vgp.y;
      this.setWidth(visualGrid.getWidth());
      this.setHeight(visualGrid.getHeight());     
      
      this._standardButton.x = this.x + MainMenu._StandardButtonPos.x;
      this._standardButton.y = this.y + MainMenu._StandardButtonPos.y;
      this._challengeButton.x = this.x + MainMenu._ChallengeButtonPos.x;
      this._challengeButton.y = this.y + MainMenu._ChallengeButtonPos.y;

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

   private onGameModeSwitch() {
      mainMenu.hide();
      
      if (gameMode === GameMode.Standard && !this._hasFinishedTutorial(GameMode.Standard)) {
         // play normal tutorial

         // demo drag actions

         // demo sweep meters

         // hint at mega sweep
      } else if (gameMode === GameMode.Timed && !this._hasFinishedTutorial(GameMode.Timed)) {
         
      }
   }

   private _hasFinishedTutorial(gameMode: GameMode): boolean {
      var c = Cookies.get("tutorial-" + gameMode);

      ex.Logger.getInstance().debug("Retrieved tutorial cookie: tutorial-" + gameMode, c);

      return c && c === "1";
   }

   

   // todo move loadConfig logic to here so we can manage state better?

   public static LoadStandardMode() {
      ex.Logger.getInstance().info("Loading standard mode");
      loadConfig(Config.loadCasual);
      mainMenu.onGameModeSwitch();
   }

   public static LoadChallengeMode() {
      ex.Logger.getInstance().info("Loading challenge mode");
      loadConfig(Config.loadSurvivalReverse);
      mainMenu.onGameModeSwitch();
   }
}

class MenuButton extends ex.UIActor {
   
   constructor(sprite: ex.Sprite, public action: () => void, x: number, y: number) {
      super(x, y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight);

      this.addDrawing(sprite);
      this.off("pointerup", this.action);
      this.on("pointerup", this.action);
   }

}