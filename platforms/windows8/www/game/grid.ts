
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

   public getAbove(): Cell {
      return this.logicalGrid.getCell(this.x, this.y - 1);
   }
   public getBelow(): Cell {
      return this.logicalGrid.getCell(this.x, this.y + 1);
   }

   public getCenter(): ex.Point {
      var cw = Config.CellWidth * gameScale.x;
      var ch = Config.CellHeight * gameScale.y;

      return new ex.Point(
         this.x * cw + (cw / 2) + visualGrid.x,
         this.y * ch + (ch / 2) + visualGrid.y);
   }
}

class LogicalGrid extends ex.Class {
   public cells: Cell[];
   constructor(public rows: number, public cols: number) {
      super();

      this.cells = new Array<Cell>(rows * cols);
      for (var i = 0; i < this.cols; i++) {
         for (var j = 0; j < this.rows; j++) {
            this.cells[i + j * this.cols] = new Cell(i, j, null, this);
         }
      }
   }

   public getRow(row: number): Cell[] {
      var result = [];
      for (var i = 0; i < this.cols; i++) {
         result.push(this.getCell(i, row));
      }
      return result;
   }

   public getColumn(col: number): Cell[] {
      var result = [];
      for (var i = 0; i < this.cols; i++) {
         result.push(this.getCell(col, i));
      }
      return result;
   }

   public getCell(x: number, y: number): Cell {
      if (x < 0 || x >= this.cols) return null;
      if (y < 0 || y >= this.rows) return null;

      return this.cells[(x + y * this.cols)];
   }

   public setCell(x: number, y: number, data: Piece, movePiece: boolean = true): Cell {
      var cell = this.getCell(x, y);

      if (!cell) return;

      if (data) {
         var center = cell.getCenter();
         if (movePiece) {
            //data.moveTo(center.x, center.y, 200).asPromise().then(() => {
            data.x = center.x;
            data.y = center.y;
            //});
         }
         data.cell = cell;
         cell.piece = data;
         this.eventDispatcher.publish("pieceadd", new PieceEvent(cell));
      } else {
         this.eventDispatcher.publish("pieceremove", new PieceEvent(cell));

         cell.piece = null;
      }
      return cell;
   }



   public clearPiece(piece: Piece) {

      if (piece && piece.cell) {
         piece.visible = false;
         piece.cell.piece = null;
         piece.cell = null;
         piece.kill();
         piece.dispose();
      }
   }
   
   public getAdjacentPieceGroup(piece: Piece): Piece[] {
      var currentGroup: Piece[] = [piece];

      function _getPieceGroupHelper(currentPiece: Piece): void {
         var unexploredNeighbors = currentPiece.cell.getNeighbors().filter(c => {
            return c.piece && currentGroup.indexOf(c.piece) === -1 && c.piece.getType() === currentPiece.getType();
         }).map(c => c.piece);
         currentGroup = currentGroup.concat(unexploredNeighbors);
         if (unexploredNeighbors.length === 0) {
            return;
         } else {
            for (var i = 0; i < unexploredNeighbors.length; i++) {
               _getPieceGroupHelper(unexploredNeighbors[i]);
            }
         }
      }

      _getPieceGroupHelper(piece);
      return currentGroup;
   }


   public getNumAvailablePieces(): number {
      var selectablePieces: Piece[] = [];

      for (var i = 0; i < this.cells.length; i++) {
         if (this.cells[i].piece) {
            if (selectablePieces.indexOf(this.cells[i].piece) !== -1) {
               continue;
            } else {
               var additions = this.getAdjacentPieceGroup(this.cells[i].piece);
               if (additions.length >= 3) {
                  selectablePieces = selectablePieces.concat(additions);
               }
            }
         }

      }
      return selectablePieces.length;
   }

   public getPieces(): Piece[] {
      return this.cells.filter(c => c.piece !== null).map(c => c.piece);
   }

   public fill(row: number, smooth: boolean = false, delay: number = 0) {

      for (var i = 0; i < this.cols; i++) {
         (() => {
            var cell = this.getCell(i, row);
            var piece = PieceFactory.getRandomPiece(cell.getCenter().x, visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2));
            

            //piece.y = visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2);
            var intendedCell = this.setCell(i, row, piece, !smooth);
            var hasSameType = intendedCell.getNeighbors().some((c) => {
               if (c && c.piece) {
                  return c.piece.getType() === piece.getType();
               }
               return false;
            });
            if (hasSameType) {
               this.clearPiece(piece);
               piece = PieceFactory.getRandomPiece();
               piece.x = cell.getCenter().x;
               piece.y = visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2);
               this.setCell(i, row, piece, !smooth);
            }


            if (smooth) {
               piece.delay(delay).easeTo(cell.getCenter().x, cell.getCenter().y, Config.PieceEasingFillDuration, ex.EasingFunctions.EaseInOutCubic).asPromise().then(() => {
                  piece.x = cell.getCenter().x;
                  piece.y = cell.getCenter().y;
               });
            }
         })();
      }
   }

   public seed(rows: number, smooth: boolean = false, delay: number = 0) {
      for (var i = 0; i < rows; i++) {
         grid.fill(grid.rows - (i + 1), smooth, delay);
      }

      if (this.getNumAvailablePieces() < 2) {
         this.getPieces().forEach(p => this.clearPiece(p));

         // DANGER WILL ROBINSON DANGER DANGER!
         this.seed(rows, smooth, delay);
      }
   }

   public shift(from: number, to: number): ex.Promise<any> {
      if (to > this.rows) ex.Promise.wrap(true);

      var promises: ex.Promise<any>[] = [];
      for (var i = 0; i < this.cols; i++) {
         if (to < 0) {
            var piece = this.getCell(i, from).piece;
            if (piece) {
               this.clearPiece(piece);
               if (!matcher.gameOver) {
                  matcher.gameOver = true;
                  gameOver();
               }
            }
         } else if (this.getCell(i, from).piece) {
            (() => {
               var p = this.getCell(i, from).piece;
               var dest = this.getCell(i, to).getCenter();
               promises.push(p.easeTo(dest.x, dest.y, 300, ex.EasingFunctions.EaseInOutCubic).asPromise());
               this.setCell(i, to, this.getCell(i, from).piece, false);
               this.setCell(i, from, null);
            })();
         }
      }

      var agg = ex.Promise.join.apply(null, promises);
      if (promises.length) {
         return agg;
      } else {
         return ex.Promise.wrap(true);
      }
   }

   public areNeighbors(cell1: Cell, cell2: Cell): boolean {
      return cell1.getNeighbors().indexOf(cell2) > -1;
   }
}


class VisualGrid extends ex.Actor {
   constructor(public logicalGrid: LogicalGrid) {
      super(0, Config.GridY, Config.CellWidth * logicalGrid.cols, Config.CellHeight * logicalGrid.rows);
      this.anchor.setTo(0, 0);
      this.scale.setTo(gameScale.x, gameScale.y);
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      this.scale.setTo(gameScale.x, gameScale.y);
   }

   public draw(ctx: CanvasRenderingContext2D, delta: number) {
      super.draw(ctx, delta);

      ctx.fillStyle = Palette.GridBackgroundColor.toString();
      ctx.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
   }

   public getCellByPos(screenX: number, screenY: number): Cell {
      return _.find(this.logicalGrid.cells, (cell) => {
         return cell.piece && cell.piece.contains(screenX, screenY);
      });
   }

}