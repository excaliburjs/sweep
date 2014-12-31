class PolyLine extends ex.UIActor {
   
   constructor() {
      super();      
   }

   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      var run = matcher.getRun();

      if (!run.length || !matcher.runInProgress) return;

      this._drawLine(run, ctx, Config.PolylineThickness + 2, Palette.PolylineBorderColor);
      this._drawLine(run, ctx, Config.PolylineThickness, Palette.PolylineColor);
   }

   private _drawLine(run: Piece[], ctx: CanvasRenderingContext2D, thickness: number, color: ex.Color) {
      ctx.beginPath();
      ctx.strokeStyle = color.toString();
      ctx.lineWidth = thickness;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      run.forEach((p, i) => {
         var center = game.worldToScreenCoordinates(p.getCenter());
         var target = center;

         if (i === 0) {
            ctx.moveTo(target.x, target.y);
         } else {
            ctx.lineTo(target.x, target.y);
         }

      });
      ctx.stroke();
      ctx.closePath();
   }
} 