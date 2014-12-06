﻿class MatchEvent extends ex.GameEvent {

   constructor(public run: Piece[]) {
      super();
   }

}

class MatchManager extends ex.Class {

   private _run: Piece[] = [];   

   constructor() {
      super();

      game.input.pointers.primary.on("down", _.bind(this._handlePieceDown, this));
      game.input.pointers.primary.on("up", _.bind(this._handlePointerUp, this));
      game.input.pointers.primary.on("move", _.bind(this._handlePointerMove, this));      
   }

   public runInProgress = false;

   private _handlePieceDown(pe: PointerEvent) {

      var cell = visualGrid.getCellByPos(pe.x, pe.y);

      if (!cell) return;

      this.runInProgress = true;
      cell.piece.selected = true;
      this._run.push(cell.piece);

      ex.Logger.getInstance().info("Run started", this._run);

      // darken/highlight
      // draw line?
   }

   private _handlePointerMove(pe: PointerEvent) {

      // add piece to run if valid
      // draw line?

      if (!this.runInProgress) return;

      var cell = visualGrid.getCellByPos(pe.x, pe.y);

      if (!cell) return;

      var piece = cell.piece;

      if (!piece) return;

      var removePiece = -1;

      // if piece contains screen coords and we don't already have it in the run
      if (piece.contains(pe.x, pe.y) && this._run.indexOf(piece) < 0) {

         // if the two pieces aren't neighbors or aren't the same type, invalid move
         if (this._run.length > 0 && (!this.areNeighbors(piece, this._run[this._run.length - 1]) ||
            piece.getType() !== this._run[this._run.length - 1].getType())) return;

         // add to run
         piece.selected = true;
         this._run.push(piece);

         ex.Logger.getInstance().info("Run modified", this._run);

         // notify
         this.eventDispatcher.publish("run", new MatchEvent(_.clone(this._run)));
      }

      // did user go backwards?
      if (piece.contains(pe.x, pe.y) &&
         this._run.length > 1 &&
         this._run.indexOf(piece) === this._run.length - 2) {
         // mark for removal
         removePiece = this._run.indexOf(piece) + 1;
      }
      
      if (removePiece > -1) {
         // remove from run
         this._run[removePiece].selected = false;
         this._run.splice(removePiece, 1);

         ex.Logger.getInstance().info("Run modified", this._run);
      }
   }

   private _handlePointerUp() {

      // have a valid run?
      if (this._run.length > 0) {
         ex.Logger.getInstance().info("Run ended", this._run);

         // notify
         this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));

         this._run.forEach(p => p.selected = false);
         this._run.length = 0;
      }

      this.runInProgress = false;
   }

   public areNeighbors(piece1: Piece, piece2: Piece): boolean {      
      var cell1 = _.find(grid.cells, { piece: piece1 });
      var cell2 = _.find(grid.cells, { piece: piece2 });
      
      return grid.areNeighbors(cell1, cell2);
   }

   public getRunType(): PieceType {
      if (this._run.length === 0) return null;

      return this._run[0].getType();
   }
}