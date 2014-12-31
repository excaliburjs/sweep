// alt sweep mechanic 1
class Sweeper extends ex.Actor {

   private _row: number = 0;
   private _label: ex.Label;
   private _emitter: ex.ParticleEmitter;

   constructor(startRow: number, gridCellsWide : number) {
      super(0, 0, Config.CellWidth * gridCellsWide, 2, ex.Color.Red);
      this.anchor.setTo(0, 0);
      this.visible = false;

      this._row = startRow;
      this._label = new ex.Label("Sweeper");      
      this._emitter = new ex.ParticleEmitter(0, 0, Config.CellWidth * Config.GridCellsWide, 2);
      this._emitter.emitterType = ex.EmitterType.Rectangle;
      this._emitter.radius = 0;
      this._emitter.minVel = 13;
      this._emitter.maxVel = 137;
      this._emitter.minAngle = Math.PI;
      this._emitter.maxAngle = Math.PI;
      this._emitter.isEmitting = false;
      this._emitter.emitRate = 500;
      this._emitter.opacity = 0.9;
      this._emitter.fadeFlag = true;
      this._emitter.particleLife = 150;
      this._emitter.maxSize = 2;
      this._emitter.minSize = 1;
      this._emitter.startSize = 0;
      this._emitter.endSize = 0;
      this._emitter.acceleration = new ex.Vector(0, -955);
      this._emitter.beginColor = ex.Color.fromHex("#FF4A51");
      this._emitter.endColor = ex.Color.Transparent;
      this._emitter.anchor.setTo(0, 1);
   }

   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);

      if (Config.EnableSweeper) {
         this._emitter.isEmitting = true;
         //game.add(this._label);
         game.add(this._emitter);
      }

      this.y = visualGrid.y + (this._row * Config.CellHeight * gameScale.y);

      game.input.keyboard.off("up", Sweeper._handleKeyDown);
      game.input.keyboard.on("up", Sweeper._handleKeyDown);
   }

   private static _handleKeyDown(evt: ex.Input.KeyEvent) {
      if (evt.key === 49) sweeper.sweep(PieceType.Circle);
      if (evt.key === 50) sweeper.sweep(PieceType.Triangle);
      if (evt.key === 51) sweeper.sweep(PieceType.Square);
      if (evt.key === 52) sweeper.sweep(PieceType.Star);

      // mega sweep
      if (!Config.EnableSweeper && evt.key === ex.Input.Keys.S) sweeper.sweepAll();

      // alt sweep
      if (Config.EnableSweeper && evt.key === ex.Input.Keys.S) sweeper.sweep();
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      this.x = visualGrid.x;
      this._emitter.x = visualGrid.x;
      this._emitter.y = this.y;
      this._emitter.setWidth(visualGrid.getWidth());
   }

   public sweepAll(force: boolean = false): void {

      if (matcher.gameOver) return;

      if (!stats.allMetersFull() && !force) return;

      game.currentScene.camera.shake(4, 4, Config.MegaSweepShakeDuration);

      var cells = grid.cells.filter(cell => {
         return !!cell.piece;
      });

      // todo mega animation!
      grid.getPieces().forEach((piece) => {
         // todo adjust mega sweep scoring?
         stats.scorePieces([piece]);

         // clear
         effects.clearEffect(piece);
         grid.clearPiece(piece);
      });


      // reset meter
      stats.resetAllMeters();

      // add combo multiplier
      //stats.increaseScoreMultiplier();

      // fill grid
      grid.seed(Config.NumStartingRows, true, Config.MegaSweepDelay);
      
      Resources.MegaSweepSound.play();
   }

   public sweep(type: PieceType = null): void {

      if (matcher.gameOver) return; 

      if (type !== null) {
         // can sweep?
         if (!stats.canSweep(type)) return;

         // don't allow individual sweeps if mega sweep is available
         // that shouldn't happen
         if (stats.allMetersFull()) return;
         game.currentScene.camera.shake(4, 4, Config.SweepShakeDuration);

         var cells = grid.cells.filter(cell => {
            return cell.piece && cell.piece.getType() === type;
         });

         cells.forEach(cell => {
            stats.scorePieces([cell.piece]);
            effects.clearEffect(cell.piece);
            grid.clearPiece(cell.piece);
         });

         // reset meter
         if (Config.ClearSweepMetersAfterSingleUse) {
            stats.resetAllMeters();
         } else {
            stats.resetMeter(type);
         }

         turnManager.advanceTurn();

      } else {

         if (!stats.canSweep()) return;

         var cells: Cell[] = [];

         // get all tiles above me
         for (var i = 0; i < this._row; i++) {
            grid.getRow(i).filter(c => c.piece !== null).forEach(c => cells.push(c));
         }

         if (cells.length <= 0) return;

         cells.forEach(cell => {
            stats.scorePieces([cell.piece]);
            effects.clearEffect(cell.piece);
            grid.clearPiece(cell.piece);
         });

         // reset meter
         stats.resetSweeperMeter();

         // advance sweeper
         if (!Config.SweepMovesUp && this._row < Config.SweepMaxRow) {
            this._row++;
            this.moveBy(this.x, this.y + Config.CellHeight * gameScale.y, 200);
         } else if (Config.SweepMovesUp && this._row > Config.SweepMinRow) {
            this._row--;
            this.moveBy(this.x, this.y - Config.CellHeight * gameScale.y, 200);
         }

         turnManager.advanceTurn();
      }
      Resources.SweepSound.play();
      
   }
}