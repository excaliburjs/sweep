
class Cell {
   
   constructor(public x: number, public y: number, public piece: Piece) { }

   public getCenter(): ex.Point {
      return new ex.Point(this.x* Config.CellWidth + Config.CellWidth / 2, this.y*Config.CellHeight + Config.CellHeight/2);
   }
}

class LogicalGrid {
   public cells: Cell[] = [];
   constructor(public rows: number, public cols: number) {
      this.cells = new Array<Cell>(rows * cols);
      for (var i = 0; i < this.cols; i++) {
         for (var j = 0; j < this.rows; j++) {
            this.cells[i + j * this.cols] = new Cell(i, j, null);
         }
      }
   }

   public getCell(x: number, y: number): Cell {
      if (x < 0 || x > this.cols) return null;
      if (y < 0 || y > this.rows) return null;

      return this.cells[(x + y * this.cols)];
   }

   public setCell(x: number, y: number, data: Piece): void {
      
      var center = this.getCell(x, y).getCenter();
      data.x = center.x;
      data.y = center.y;

      game.add(data);

      this.cells[(x + y * this.cols)].piece = data;
   }

   public fill(row: number) {
      for (var i = 0; i < this.cols; i++) {
         this.setCell(i, row, PieceFactory.getRandomPiece());
      }
   }

}

class VisualGrid extends ex.Actor {
   constructor(public logicalGrid: LogicalGrid) {
      super(0, 0, Config.CellWidth * logicalGrid.cols, Config.CellHeight * logicalGrid.rows);
      this.anchor.setTo(0, 0);

   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
   }

   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      super.draw(ctx, delta);
      
      this.logicalGrid.cells.forEach(c => {
         ctx.fillStyle = 'gray';
         ctx.fillRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
         ctx.strokeStyle = 'black';
         ctx.strokeRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);

         
      });
   }
}