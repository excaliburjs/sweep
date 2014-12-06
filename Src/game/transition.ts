/// <reference path="grid.ts"/>

class TransitionManager {
   constructor(public logicalGrid: LogicalGrid, public visualGrid: VisualGrid) {
      
   }

   private _findLanding(cell: Cell): Cell {
      
      var landing = cell.getBelow();
      while (landing) {
         if (!landing.getBelow() || (!landing.piece && landing.getBelow().piece)) {
            break;
         }
         landing = landing.getBelow();
      }
      return landing;
   }

   private _findFloaters(row: number): Cell[] {
      return this.logicalGrid.getRow(row).filter(c => {
         return c.piece && c.getBelow() && c.getBelow().piece === null;
      });
   }

   public evaluate() {
      var currentRow = this.logicalGrid.rows;
      while (currentRow > 0) {
         currentRow--;
         this._findFloaters(currentRow).forEach(c => {
            var landingCell = this._findLanding(c);
            if (landingCell) {
               var piece = c.piece;
               this.logicalGrid.setCell(c.x, c.y, null);
               this.logicalGrid.setCell(landingCell.x, landingCell.y, piece);
            }
         });
      }

   }


}