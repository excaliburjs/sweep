class MatchEvent extends ex.GameEvent {
   
   constructor(public run: Piece[]) {
      super();
   }

}

class MatchManager extends ex.Class {

   private _cells: Cell[] = [];
   private _pieces: Piece[] = [];
   private _run: Piece[] = [];
   private _runInProgress = false;

   constructor(private _grid: LogicalGrid) {
      super();

      grid.on("pieceadd", (pe: PieceEvent) => {

         if (!pe.cell.piece) return;
         if (_.find(this._pieces, pe.cell.piece)) return;

         this._cells.push(pe.cell);
         this._pieces.push(pe.cell.piece);

         pe.cell.piece.on("pointerdown", _.bind(this._handlePieceDown, this));
         pe.cell.piece.on("pointerup", _.bind(this._handlePieceUp, this));
         pe.cell.piece.on("pointermove", _.bind(this._handlePieceMove, this));         
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

      var removePiece;
      this._pieces.forEach(piece => {

         // if piece contains screen coords (assumed) and we don't already have it in the run
         if (piece.contains(pe.x, pe.y) && this._run.indexOf(piece) < 0) {

            // if the two pieces aren't neighbors or aren't the same type, invalid move
            if (this._run.length > 0 && (!this.areNeighbors(piece, this._run[this._run.length - 1]) ||
                piece.getType() !== this._run[this._run.length - 1].getType())) return;

            // add to run
            this._run.push(piece);

      ex.Logger.getInstance().info("Run modified", this._run);
   }

         // did user go backwards?
         if (piece.contains(pe.x, pe.y) &&
            this._run.length > 1 &&
            this._run.indexOf(piece) === this._run.length - 2) {
            // mark for removal
            removePiece = this._run.indexOf(piece) + 1;
         }
      });

      if (removePiece > -1) {
         this._run.splice(removePiece, 1);

         ex.Logger.getInstance().info("Run modified", this._run);
      }      
   }

   private _handlePieceUp(pe: PointerEvent) {

      // have a valid run?
      if (this._run.length > 0) {
      ex.Logger.getInstance().info("Run ended", this._run);

         // notify
         this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));

      this._run.length = 0;
      }
      
      this._runInProgress = false;
   }

   public areNeighbors(piece1: Piece, piece2: Piece): boolean {
      var idx1 = this._pieces.indexOf(piece1);
      var idx2 = this._pieces.indexOf(piece2);
      var cell1 = this._cells[idx1];
      var cell2 = this._cells[idx2];

      return this._grid.areNeighbors(cell1, cell2);
   }
}