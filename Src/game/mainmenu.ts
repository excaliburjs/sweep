class MainMenu extends ex.UIActor {
   
   private _logo: ex.Actor;
   private _standardButton: ex.UIActor;   
   private _challengeButton: ex.UIActor;
   private _muteMusicButton: ex.UIActor;
   private _muteSoundButton: ex.UIActor;
   private _show = false;
   private _showing = false;

   private static _StandardButtonPos = new ex.Point(25, 200);
   private static _ChallengeButtonPos = new ex.Point(25, 200 + Config.MainMenuButtonHeight + 20);
   private static _LogoPos = new ex.Point(0, 50);

   constructor() {
      super();

      this.color = new ex.Color(0, 0, 0, 0.9);                     
   }

   public onInitialize(engine: ex.Engine) {
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

   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      if (!this.visible) return;

      super.draw(ctx, delta);
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
   }

   public show() {
      this.visible = true;
      this._logo.visible = true;
      this._standardButton.visible = true;
      this._challengeButton.visible = true;
      this._show = true;
   }

   public hide() {
      this.visible = false;
      this._logo.visible = false;
      this._standardButton.visible = false;
      this._challengeButton.visible = false;
      this._show = false;
   }

   public static LoadStandardMode() {
      loadConfig(Config.loadCasual, true);
      mainMenu.hide();
   }

   public static LoadChallengeMode() {
      loadConfig(Config.loadSurvivalReverse, true);
   }
}

class MenuButton extends ex.UIActor {
   
   private _captureActor: ex.Actor;

   constructor(sprite: ex.Sprite, public action: () => void, x: number, y: number) {
      super(x, y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight);

      this.addDrawing(sprite);
   }

   public onInitialize() {
      var world = game.screenToWorldCoordinates(new ex.Point(this.x, this.y));
      this._captureActor = new ex.Actor(world.x, world.y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight, ex.Color.Transparent);
      this._captureActor.anchor.setTo(0, 0);

      game.add(this._captureActor);
      this._captureActor.off("pointerup", this.action);
      this._captureActor.on("pointerup", this.action);
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      var world = game.screenToWorldCoordinates(new ex.Point(this.x, this.y));
      this._captureActor.enableCapturePointer = this.visible;
      this._captureActor.x = world.x;
      this._captureActor.y = world.y;
   }
}