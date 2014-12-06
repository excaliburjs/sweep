class MatchEvent extends ex.GameEvent {
   constructor() {
      super();
   }
}

class MatchManager extends ex.Class {

   private _pieces: Piece[] = [];
   private _run: Piece[] = [];
   private _runInProgress = false;

   constructor(grid: LogicalGrid) {
      super();

      grid.on("pieceadd", (pe: PieceEvent) => {

         if (!pe.cell.piece) return;
         if (_.find(this._pieces, pe.cell.piece)) return;

         this._pieces.push(pe.cell.piece);

         pe.cell.piece.on("pointerdown", this._handlePieceDown.bind(this));
         pe.cell.piece.on("pointerup", this._handlePieceUp.bind(this));
         pe.cell.piece.on("pointermove", this._handlePieceMove.bind(this));         
      });

      grid.on("pieceremove", (pe: PieceEvent) => {
         // todo
      });

      game.input.pointers.on("up", this._handlePieceUp);
   }

   private _handlePieceDown(pe: PointerEvent) {

      var cell = visualGrid.getCellByPos(pe.x, pe.y);

      if (!cell) return;

      this._runInProgress = true;
      this._run.push(cell.piece);

      ex.Logger.getInstance().info("Run started", this._run);

      // darken/highlight
      // draw line?
   }

   private _handlePieceMove(pe: PointerEvent) {
      
      // add piece to run if valid
      // draw line?

      if (!this._runInProgress) return;

      ex.Logger.getInstance().info("Run modified", this._run);
   }

   private _handlePieceUp(pe: PointerEvent) {

      // todo figure out match
      ex.Logger.getInstance().info("Run ended", this._run);

      this._run.length = 0;
      this._runInProgress = false;
   }
}