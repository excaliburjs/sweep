// alt sweep mechanic 1
class Sweeper extends ex.Actor {

   private _row: number = 0;
   private _label: ex.Label;
   private _emitter: ex.ParticleEmitter;

   constructor(startRow: number) {
      super(0, 0, Config.CellWidth * Config.GridCellsWide, 2);
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
      this._emitter.isEmitting = true;
      this._emitter.emitRate = 500;
      this._emitter.opacity = 0.9;
      this._emitter.fadeFlag = true;
      this._emitter.particleLife = 150;
      this._emitter.maxSize = 2;
      this._emitter.minSize = 1;
      this._emitter.startSize = 0;
      this._emitter.endSize = 0;
      this._emitter.acceleration = new ex.Vector(0, -955);
      this._emitter.beginColor = ex.Color.Red;
      this._emitter.endColor = ex.Color.Transparent;
      this._emitter.anchor.setTo(0, 1);
   }

   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);

      game.add(this._label);
      game.add(this._emitter);

      this.y = visualGrid.y + (this._row * Config.CellHeight);
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      this.x = visualGrid.x;      
      this._label.x = visualGrid.x - 50;
      this._label.y = this.y;
      this._emitter.x = visualGrid.x;
      this._emitter.y = this.y;
   }

   public sweep(): void {

      if (!stats.canSweep()) return;

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
      // todo advance every so often?
      if (this._row < Config.SweepMaxRow) {
         this._row++;
         this.moveBy(this.x, this.y + Config.CellHeight, 200);
      }

      turnManager.advanceTurn();
   }
}