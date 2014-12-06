class TurnManager {

   private _timer: ex.Timer;

   constructor(public logicalGrid: LogicalGrid, public matcher: MatchManager) {
      matcher.on('match', this._handleMatchEvent);
      this._timer = new ex.Timer(this._tick, 1000, true);
      game.add(this._timer);
   }

   private _shiftBoard(): void {
      // shift all rows up 1
      for (var i = 0; i < grid.rows; i++) {
         this.logicalGrid.shift(i, i - 1);
      }
      // fill first row
      this.logicalGrid.fill(grid.rows - 1);
   }

   private _handleMatchEvent(evt: MatchEvent) {
      this._shiftBoard();
   }

   private _tick() {
      //ex.Logger.getInstance().info("Tick", new Date());
   }
   
} 