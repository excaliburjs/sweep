
class Background extends ex.Actor {
   constructor(public corner: ex.Point, public texture: ex.Texture) {
      super(corner.x, corner.y, game.getWidth()+ texture.width, game.getHeight() + texture.height);
      this.addDrawing(texture);
   }

   update(engine: ex.Engine, delta: number) {
      this.corner = engine.screenToWorldCoordinates(new ex.Point(0, 0));
      this.x = this.corner.x-20;
      super.update(engine, delta);
      if (this.x < this.corner.x - this.texture.width || this.x > game.getWidth()) {
         this.x = this.corner.x;
         this.y = this.corner.y;
      };


      if (this.y < this.corner.y - this.texture.height || this.y > game.getHeight()) {
         this.x = this.corner.x;
         this.y = this.corner.y;
      }
   }

   draw(ctx: CanvasRenderingContext2D, delta: number) {

      for (var i = 0; i < Math.ceil(game.getWidth() / this.texture.width) + 5; i++) {
         if (this.dx <= 0) {
            this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y);
         } else {
            this.currentDrawing.draw(ctx, this.x - i * this.texture.width, this.y);
         }
         if (this.dy <= 0) {
            this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y + this.texture.height);
         } else {
            this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y - this.texture.height);
         }
         
      }
   }
}