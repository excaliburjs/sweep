class MatchEvent extends ex.GameEvent {

   constructor(public run: Piece[]) {
      super();
   }

}

class MatchManager extends ex.Class {

   private _notes: ex.Sound[] = [
      Resources.ChallengeNote1Sound,
      Resources.ChallengeNote2Sound,
      Resources.ChallengeNote3Sound,
      Resources.ChallengeNote4Sound,
      Resources.ChallengeNote5Sound,
      Resources.ChallengeNote6Sound
      /*Resources.ChallengeNote7Sound,
      Resources.ChallengeNote8Sound*/]

   private _run: Piece[] = [];   

   public gameOver: boolean = false;
   public dispose = function () {
      game.input.pointers.primary.off("down");
      game.input.pointers.primary.off("up");
      game.input.pointers.primary.off("move");
   }

   constructor() {
      super();

      game.input.pointers.primary.on("down", _.bind(this._handlePointerDown, this));
      game.input.pointers.primary.on("up", _.bind(this._handlePointerUp, this));
      game.input.pointers.primary.on("move", _.bind(this._handlePointerMove, this));

      // handle canceling via right-click
      game.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
         e.preventDefault();

         this._handleCancelRun();
      });

      window.addEventListener("contextmenu", () => this._handleCancelRun());

      // HACK: Handle off-canvas mouseup to commit run
      window.addEventListener("mouseup", (e: MouseEvent) => {
         if (e.button === ex.Input.PointerButton.Left) {
            this._handlePointerUp(new ex.Input.PointerEvent(e.clientX, e.clientY, 0, ex.Input.PointerType.Mouse, e.button, e));
         } else {
            this._handleCancelRun();
         }
      });
   }

   public runInProgress = false;

   private _playNote(): void {
      var index = ex.Util.randomIntInRange(0, this._notes.length - 1);
      this._notes[index].play();
   }

   private _handlePointerDown(pe: PointerEvent) {
      if (!this.gameOver) {
         var cell = visualGrid.getCellByPos(pe.x, pe.y);

         if (!cell || this.runInProgress || !cell.piece) {
            return;
         }

         if (pe.pointerType === ex.Input.PointerType.Mouse && pe.button !== ex.Input.PointerButton.Left) {
            return;
         }

         if (!Config.EnableSingleTapClear) {
            this.runInProgress = true;
            cell.piece.selected = true;
            this._run.push(cell.piece);
            this._playNote();
            ex.Logger.getInstance().info("Run started", this._run);
         } else {
            this._run = grid.getAdjacentPieceGroup(cell.piece);
            // notify
            this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));

            this._run.forEach(p => p.selected = false);
            this._run.length = 0;
         }

      // darken/highlight
         // draw line?
      }
   }

   private _handlePointerMove(pe: PointerEvent) {
      if (!this.gameOver) {
         // add piece to run if valid
         // draw line?

         if (!this.runInProgress) return;

         var cell = visualGrid.getCellByPos(pe.x, pe.y);

         if (!cell) return;

         var piece = cell.piece;

         if (!piece) return;

         if (!Config.EnableSingleTapClear) {
            var removePiece = -1;
            var containsBounds = new ex.BoundingBox(
               piece.getBounds().left + Config.PieceContainsPadding,
               piece.getBounds().top + Config.PieceContainsPadding,
               piece.getBounds().right - Config.PieceContainsPadding,
               piece.getBounds().bottom - Config.PieceContainsPadding);

            // if piece contains screen coords and we don't already have it in the run
            if (containsBounds.contains(new ex.Point(pe.x, pe.y)) && this._run.indexOf(piece) < 0) {

               // if the two pieces aren't neighbors or aren't the same type, invalid move
               if (this._run.length > 0 && (!this.areNeighbors(piece, this._run[this._run.length - 1]) ||
                  piece.getType() !== this._run[this._run.length - 1].getType())) return;

               // add to run
               piece.selected = true;
               this._run.push(piece);
               this._playNote();

               ex.Logger.getInstance().info("Run modified", this._run);

               // notify
               this.eventDispatcher.publish("run", new MatchEvent(_.clone(this._run)));
            }

            // did user go backwards?
            if (containsBounds.contains(new ex.Point(pe.x, pe.y)) &&
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
         } else {
            
         }
      }
   }

   private _handlePointerUp(pe: ex.Input.PointerEvent) {
      if (!this.gameOver) {

         if (pe.pointerType === ex.Input.PointerType.Mouse && pe.button !== ex.Input.PointerButton.Left) {
            return;
         }

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
   }

   private _handleCancelRun() {
      if (!this.gameOver) {
         this._run.forEach(p => p.selected = false);
         this._run.length = 0;
         this.runInProgress = false;
      }
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