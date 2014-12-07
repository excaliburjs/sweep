class UIWidget extends ex.Class {

   public widget: ex.Actor;
   private _buttons = new Array<ex.Actor>();

   constructor() {
      super();
      var color = new ex.Color(ex.Color.DarkGray.r, ex.Color.DarkGray.g, ex.Color.DarkGray.b, 0.3)
      this.widget = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() + 500, 300, 300, color);
   }

   public addButton(button: ex.Actor) {
      this._buttons.push(button);
      game.addChild(button);
      //button.on(buttonType, 
   }

   public getBounds(index: number) {
      var boundingBox = new ex.BoundingBox(
      this._buttons[index].getBounds().left,
      this._buttons[index].getBounds().top,
      this._buttons[index].getBounds().right,
      this._buttons[index].getBounds().bottom);
      return boundingBox;
   }

   public moveWidget(x: number, y: number, speed: number) {
      this.widget.moveTo(x, y, speed);
      //for (var i = 0; i < this._buttons.length; i++) {
      //   this._buttons[i].moveTo(x, y, speed);
      //}
   }

}