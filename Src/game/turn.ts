enum TurnMode {
   Timed,
   Match
}

class TurnManager {

   private _timer: ex.Timer;

   constructor(public logicalGrid: LogicalGrid, public matcher: MatchManager, public turnMode: TurnMode) {
      matcher.on('match', _.bind(this._handleMatchEvent, this));
      this._timer = new ex.Timer(_.bind(this._tick, this), Config.TimerValue, true);
      game.add(this._timer);
   }

   public dispose() {
      this._timer.cancel();
   }

   public advanceTurn(isMatch = false): void {
      transitionManager.evaluate().then(() => {

         if (isMatch && Config.AdvanceRowsOnMatch) {
            this.advanceRows();
         } else if (!isMatch) {
            this.advanceRows();
         }

         console.log("Done!");
      });
   }

   public advanceRows(): void {
      var promises: ex.Promise<any>[] = [];
      // shift all rows up 1
      for (var i = 0; i < grid.rows; i++) {
         promises.push(this.logicalGrid.shift(i, i - 1));
      }
      // fill first row
      promises = _.filter(promises, (p) => { return p; });
      ex.Promise.join.apply(null, promises).then(() => {
         this.logicalGrid.fill(grid.rows - 1, true);
      }).error((e) => {
         console.log(e);
      });

      if (grid.getNumAvailablePieces() <= 0) {
         //reset the board if there are no legal moves
         sweeper.sweepAll(true);
      }

   }

   private _handleMatchEvent(evt: MatchEvent) {
      if (evt.run.length >= 3) {
         stats.scorePieces(evt.run);
         stats.scoreChain(evt.run);
         evt.run.forEach(p => grid.clearPiece(p));

         this.advanceTurn(true);
      }
   }

   private _tick() {
      if (this.turnMode === TurnMode.Timed) {
         this.advanceRows();
      }
      //ex.Logger.getInstance().info("Tick", new Date());
   }
   
} 