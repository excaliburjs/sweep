
class Cell {
   
   constructor(public x: number, public y: number, public piece: Piece, public logicalGrid: LogicalGrid) { }
   public getNeighbors(): Cell[] {
      var result = [];
      for (var i = -1; i < 2; i++) {
         for (var j = -1; j < 2; j++) {

            if (this.logicalGrid.getCell(this.x + i, this.y + j) && this.logicalGrid.getCell(this.x + i, this.y + j) !== this) {
               result.push(this.logicalGrid.getCell(this.x + i, this.y + j));
            }
         }
      }
      return result;
   }

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
            this.cells[i + j * this.cols] = new Cell(i, j, null, this);
         }
      }
   }

   public getCell(x: number, y: number): Cell {
      if (x < 0 || x >= this.cols) return null;
      if (y < 0 || y >= this.rows) return null;

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

   public areNeighbors(cell1: Cell, cell2: Cell): boolean {
      return cell1.getNeighbors().indexOf(cell2) > -1;

      /*      
      // find neighbors of cell1
      var x = cell1.x,
         y = cell1.y,
         x2 = cell2.x,
         y2 = cell2.y,
         left = new ex.Point(x - 1, y),
         topLeft = new ex.Point(x - 1, y - 1),
         right = new ex.Point(x + 1, y),
         bottomRight = new ex.Point(x + 1, y + 1),
         top = new ex.Point(x, y - 1),
         topRight = new ex.Point(x + 1, y - 1),
         bottom = new ex.Point(x, y + 1),
         bottomLeft = new ex.Point(x - 1, y + 1);

      ex.Logger.getInstance().debug("LogicalGrid.areNeighbors", {
         cell1: cell1,
         cell2: cell2,
         forX: x,
         forY: y,
         otherX: x2,
         otherY: y2,
         left: left,
         topLeft: topLeft,
         right: right,
         topRight: topRight,
         bottom: bottom,
         bottomLeft: bottomLeft,
         bottomRight: bottomRight
      });

      return (x2 === left.x && y2 === left.y) ||
         (x2 === right.x && y2 === right.y) ||
         (x2 === top.x && y2 === top.y) ||
         (x2 === bottom.x && y2 === bottom.y) ||
         (x2 === topLeft.x && y2 === topLeft.y) ||
         (x2 === bottomRight.x && y2 === bottomRight.y) ||
         (x2 === topRight.x && y2 === topRight.y) ||
         (x2 === bottomLeft.x && y2 === bottomLeft.y);*/

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

         ctx.fillStyle = Palette.GridBackgroundColor.toString();         
         ctx.fillRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
         ctx.strokeStyle = Util.darken(Palette.GridBackgroundColor, 0.3);
         ctx.strokeRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);         
      });
   }

   public getCellByPos(screenX: number, screenY: number): Cell {
      return _.find(this.logicalGrid.cells, (cell) => {
         return cell.piece && cell.piece.contains(screenX, screenY);
      });
   }
}