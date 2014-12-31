class Mask extends ex.UIActor {
   constructor() {
      super(0, 0, 0, Config.CellHeight);

      this.anchor.setTo(0, 0);
      this.color = Util.darken(new ex.Color(Palette.GridBackgroundColor.r, Palette.GridBackgroundColor.g, Palette.GridBackgroundColor.b), 0.3);
      //this.color = ex.Color.Transparent;
   }

   public update(engine: ex.Engine, delta: number) {
      var vgWorldPos = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.getBottom()));
      this.x = vgWorldPos.x;
      this.y = vgWorldPos.y;
      this.setWidth(visualGrid.getWidth());      
   }
} 