class MainMenu extends ex.UIActor {
   
   private _logo: ex.Actor;
   private _show = false;
   private _shown = false;
   private _showing = false;

   constructor() {
      super();

      this.color = new ex.Color(0, 0, 0, 0.9);
      this._logo = new ex.UIActor();

      this._logo.addDrawing(Resources.TextureLogo.asSprite());
      this._logo.currentDrawing.setScaleX(0.6);
      this._logo.currentDrawing.setScaleY(0.6);
      this._logo.currentDrawing.transformAboutPoint(new ex.Point(0.5, 0.5));
      //this._logo.scale.setTo(0.5, 0.5);
   }

   public onInitialize(engine: ex.Engine) {
      game.add(this._logo);

      this.show();
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      var vgp = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.y));

      this.x = vgp.x;
      this.y = vgp.y;
      this.setWidth(visualGrid.getWidth());
      this.setHeight(visualGrid.getHeight());     
      
      if (this._show) {
         this._show = false;
         this._showing = true;
         // ease out logo
         this._logo.x = this.getCenter().x;
         this._logo.y = -70;
         this._logo.easeTo(this.getCenter().x, this.y + 50, 400, ex.EasingFunctions.EaseInOutCubic).callMethod(() => this._shown = true);
      }
   }

   public show() {
      this.visible = true;
      this._logo.visible = true;
      this._show = true;      
   }

   public hide() {
      this.visible = false;
   }
}

class MenuButton extends ex.UIActor {
   
   constructor(text: string, action: () => void, x: number, y: number) {
      super(x, y);
   }

}