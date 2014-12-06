
class Cell {
   
   constructor(public x: number, public y: number, public piece: Piece) { }

   public getCenter(): ex.Point {
      return new ex.Point(this.x* Config.CellWidth + Config.CellWidth / 2, this.y*Config.CellHeight + Config.CellHeight/2);
   }
}

class LogicalGrid extends ex.Class {
   public cells: Cell[] = [];
   constructor(public rows: number, public cols: number) {
      super();

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

   public setCell(x: number, y: number, data: Piece, kill: boolean = false): void {
      var cell = this.getCell(x, y);

      if (!cell) return;          

      if (data) {
         var center = cell.getCenter();
         data.x = center.x;
         data.y = center.y;
         
         cell.piece = data;
         this.eventDispatcher.publish("pieceadd", new PieceEvent(cell));
      } else {
         this.eventDispatcher.publish("pieceremove", new PieceEvent(cell));        

         cell.piece = null;
      }      
   }

   public fill(row: number) {
      for (var i = 0; i < this.cols; i++) {
         this.setCell(i, row, PieceFactory.getRandomPiece());
      }
   }

   public shift(from: number, to: number) {
      if (to > this.rows || to < 0) return;
      
      for (var i = 0; i < this.cols; i++) {
         if (this.getCell(i, from).piece) {
            this.setCell(i, to, this.getCell(i, from).piece);
            this.setCell(i, from, null);
         }
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

   public getCellByPos(screenX: number, screenY: number): Cell {
      return _.find(this.logicalGrid.cells, (cell) => {
         return cell.piece && cell.piece.contains(screenX, screenY);
      });
   }
}