// alt sweep mechanic 1
class Sweeper extends ex.Actor {

   private _row: number = 0;
   private _label: ex.Label;

   constructor(startRow: number) {
      super(0, 0, Config.CellWidth * Config.GridCellsWide, 2, ex.Color.Red);
      this.anchor.setTo(0, 0);

      this._row = startRow;
      this._label = new ex.Label("Sweeper");
      game.add(this._label);
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      this.x = visualGrid.x;
      this.y = visualGrid.y + (this._row * Config.CellHeight);
      this._label.x = visualGrid.x - 50;
      this._label.y = this.y;
   }

   public sweep(): void {

      if (stats.getSweepMeter() !== Config.SweepAltThreshold) return;

      var cells: Cell[] = [];

      // get all tiles above me
      for (var i = 0; i < this._row; i++) {
         grid.getRow(i).filter(c => c.piece !== null).forEach(c => cells.push(c));
      }

      if (cells.length <= 0) return;

      cells.forEach(cell => {
         stats.scorePieces([cell.piece]);
         grid.clearPiece(cell.piece);
      });

      // reset meter
      stats.resetSweeperMeter();

      // advance sweeper
      this._row++;

      turnManager.advanceTurn();
   }
}