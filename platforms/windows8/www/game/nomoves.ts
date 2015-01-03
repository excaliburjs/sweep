

class NoMoves extends ex.UIActor {
   constructor() {
      super(-200, game.getHeight() / 2, 200, 100);
      this.color = ex.Color.Azure.clone();
      this.anchor.setTo(.5, .5);
      this.setCenterDrawing(true);
      this.addDrawing(Resources.NoMovesTexture);
   }

   public play(): ex.Promise<any> {
      var corner = this._engine.screenToWorldCoordinates(new ex.Point(0, 0));
      this.x = corner.x - this.getWidth();
      this.y = game.getHeight() / 2;
      return this.easeTo(game.getWidth() / 2, game.getHeight() / 2, 500, ex.EasingFunctions.EaseInOutCubic).delay(200).easeTo(game.getWidth()+this.getWidth(), this.y, 500, ex.EasingFunctions.EaseInOutCubic).asPromise().then(() => {
         this.x = corner.x - this.getWidth();
      });
   }
}