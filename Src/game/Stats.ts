class Stats {
   private _numCirclesDestroyed: number = 0;
   private _numTrianglesDestroyed: number = 0;
   private _numSquaresDestroyed: number = 0;
   private _numStarsDestroyed: number = 0;

   private _numCirclesDestroyedMeter: number = 0;
   private _numTrianglesDestroyedMeter: number = 0;
   private _numSquaresDestroyedMeter: number = 0;
   private _numStarsDestroyedMeter: number = 0;

   private _longestCircleCombo: number = 0;
   private _longestTriangleCombo: number = 0;
   private _longestSquareCombo: number = 0;
   private _longestStarCombo: number = 0;

   private _turnNumber: number = 0;

   private _circleMultiplier: number = 1;
   private _triangleMultiplier: number = 1;
   private _squareMultiplier: number = 1;
   private _starMultiplier: number = 1;
   private _multipliers = [this._circleMultiplier, this._triangleMultiplier, this._squareMultiplier, this._starMultiplier];

   private _types = [PieceType.Circle, PieceType.Triangle, PieceType.Square, PieceType.Star];
   private _scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
   private _meters = [this._numCirclesDestroyedMeter, this._numTrianglesDestroyedMeter, this._numSquaresDestroyedMeter, this._numStarsDestroyedMeter];
   private _meterActors: Array<ex.Actor>
   private _meterLabels: Array<ex.Label>;
   private _sweepMeter = 0;
   private _sweepMeterThreshold = 0;
   private _chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];
   private _lastChain: number = 0;
   private _lastChainBonus: number = 0;
   private _totalChainBonus: number = 0;
   private _totalPiecesSwept: number = 0;
   private _finalScore: number = 0;

   constructor() {
      this._sweepMeterThreshold = Config.SweepAltThreshold;
      this._meterActors = new Array<ex.Actor>();
      this._meterLabels = new Array<ex.Label>();
   }

   public getTotalScore(): number {
      var totalScore = this._scores[0] + this._scores[1] + this._scores[2] + this._scores[3];
      return totalScore;
   }

   public getTotalPiecesSwept(): number {
      return this._totalPiecesSwept;
   }

   public getTotalChainBonus(): number {
      return this._totalChainBonus;
   }

   public getLongestChain(): number {
      return Math.max.apply(Math, this._chains);
   }

   public getTurnNumber(): number {
      return this._turnNumber;
   }

   public incrementTurnNumber() {
      this._turnNumber++;
   }

   public getMeter(pieceType: PieceType) {
      return this._meters[this._types.indexOf(pieceType)];
   }

   public resetMeter(pieceType: PieceType) {
      this._meters[this._types.indexOf(pieceType)] = 0;
   }

   public resetAllMeters() {
      for (var i = 0; i < this._meters.length; i++) {
         this._meters[i] = 0;
      }
   }

   public allMetersFull(): boolean {
      return _.every(this._meters, (m) => m === Config.SweepThreshold);
   }

   public canSweep(type: PieceType = null) {
      if (type !== null) {
         return this.getMeter(type) >= Config.SweepThreshold;
      } else {
         return this._sweepMeter === this._sweepMeterThreshold;
      }
   }

   public resetSweeperMeter() {
      this._sweepMeter = 0;
      for (var i = 0; i < this._multipliers.length; i++) {
         this._multipliers[i] = 1;
      }

      // if moving upwards, decrease threshold

      if (Config.SweepMovesUp) {
         this._sweepMeterThreshold = Math.max(Config.SweepAltMinThreshold, this._sweepMeterThreshold - Config.SweepAltThresholdDelta);
      } else {
         this._sweepMeterThreshold = Math.min(Config.SweepAltMaxThreshold, this._sweepMeterThreshold + Config.SweepAltThresholdDelta);
      }
   }

   public scorePieces(pieces: Piece[]) {
      var type = this._types.indexOf(pieces[0].getType());

      this._totalPiecesSwept += pieces.length;
      this._scores[type] += this.scoreMultiplier(pieces.length + this.chainBonus(pieces), type);
      var newScore = this._meters[type] + pieces.length;

      this._meters[type] = Math.min(newScore, Config.SweepThreshold);
      this._sweepMeter = Math.min(this._sweepMeter + pieces.length, this._sweepMeterThreshold);
   }

   public scoreMultiplier(currentScore: number, type: PieceType): number {
      var modifiedScore = currentScore;
      if (this._meters[type] == Config.SweepThreshold) {
         this._multipliers[type] = Config.SweepScoreMultiplier;
         modifiedScore = currentScore * Config.SweepScoreMultiplier;
      }
      return modifiedScore;
   }

   public calculateEnduranceBonus(): number {
      var enduranceMultiplier = 0;
      if (gameMode == GameMode.Standard) {
         enduranceMultiplier = this._turnNumber * Config.StandardModeMultiplier;
         this._finalScore = this.getTotalScore() + enduranceMultiplier;
      } else if (gameMode == GameMode.Timed) {
         enduranceMultiplier = Math.round(turnManager.getTime() / 1000 / 60) * Config.TimedModeMultiplier;
         this._finalScore = this.getTotalScore() + enduranceMultiplier;
      }
      return enduranceMultiplier;
   }

   public getFinalScore(): number {
      return this._finalScore;
   }

   public chainBonus(pieces: Piece[]): number {
      var chain = pieces.length;
      var bonus = 0;
      if (chain > 3) {
         if (chain < Config.ChainThresholdSmall) {
            bonus =  Config.ChainBonusSmall;
         } else if (chain < Config.ChainThresholdMedium) {
            bonus = Config.ChainBonusMedium
         } else if (chain < Config.ChainThresholdLarge) {
            bonus = Config.ChainBonusLarge;
         } else {
            bonus = Config.ChainBonusSuper;
         }
      }
      this._lastChainBonus = bonus;
      this._totalChainBonus += bonus;
      return bonus;
   }

   public scoreChain(pieces: Piece[]) {

      var chainScore = this._chains[this._types.indexOf(pieces[0].getType())];
      this._lastChain = pieces.length;

      if (chainScore < pieces.length) {
         this._chains[this._types.indexOf(pieces[0].getType())] = pieces.length;
      }
   }

   public getMultipliers(): Array<number> {
      return this._multipliers;
   }

   public drawScores() {

      var scoreXPos = visualGrid.x + visualGrid.getWidth() + Config.ScoreXBuffer;
      var meterXPos = visualGrid.x;
      var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;

      this._totalScore(visualGrid.x, visualGrid.y - 5);

      var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
      var meterStartX = meterXPos += (visualGrid.getWidth() - totalMeterWidth) / 2;

      if (Config.EnableSweepMeters) {
         this._addMeter(0, meterXPos, meterYPos);
         this._addMeter(1, meterXPos += Config.MeterWidth + Config.MeterMargin, meterYPos);
         this._addMeter(2, meterXPos += Config.MeterWidth + Config.MeterMargin, meterYPos);
         this._addMeter(3, meterXPos += Config.MeterWidth + Config.MeterMargin, meterYPos);
         this._addMegaSweep(meterStartX, meterYPos);
      }
      if (Config.EnableSweeper) {
         this._addSweepMeter(meterStartX, meterYPos);
      }

      //this._addScore("chain ", this._chains, 0, scoreXPos, yPos += Config.MeterHeight + 20);
      //this._addScore("chain ", this._chains, 1, scoreXPos, yPos += 20);
      //this._addScore("chain ", this._chains, 2, scoreXPos, yPos += 20);
      //this._addScore("chain ", this._chains, 3, scoreXPos, yPos += 20);

      //var lastChainLabel = new ex.Label("last chain " + this._lastChain, scoreXPos, yPos += 30);
      //game.addEventListener('update', (data?: ex.UpdateEvent) => {
      //   lastChainLabel.text = "last chain " + this._lastChain;
      //});
      //game.currentScene.addChild(lastChainLabel);
   }

   private _addScore(description: String, statArray: Array<any>, statIndex: number, xPos: number, yPos: number) {
      var square = new ex.Actor(xPos, yPos, 15, 15, PieceTypeToColor[statIndex]);
      square.anchor.setTo(0, 0);
      var label = new ex.Label(null, xPos + 20, yPos + 8);
      label.anchor.setTo(0, 0);
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         label.text = description + statArray[statIndex].toString();
      });
      game.add(label);
      game.add(square);
   }

   private _totalScore(xPos: number, yPos: number) {
      var totalScore = 0;
      var label = new ex.Label(totalScore.toString(), xPos, yPos, "bold 18px Arial");
      label.color = ex.Color.White;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         var totalScore = this.getTotalScore();
         label.text = totalScore.toString();
      });
      game.add(label);
   }

   private _addMegaSweep(x: number, y: number) {
      // todo sprite animation
      var meter = new Meter(x, y, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, 1);
      meter.score = 1;
      meter.enableCapturePointer = true;
      var label = new ex.Label("MEGA SWEEP", meter.getCenter().x, meter.getCenter().y);
      var inputLabel = new ex.Label("PRESS S", meter.getCenter().x, meter.getCenter().y + 10);
      label.textAlign = inputLabel.textAlign = ex.TextAlign.Center;
      label.color = inputLabel.color = ex.Color.White;
      label.font = inputLabel.font = "16px";
      meter.anchor.setTo(0, 0);

      meter.on("pointerup", () => {
         sweeper.sweepAll();
      });

      game.addEventListener('update', (data?: ex.UpdateEvent) => {

         // mega sweep
         if (this.allMetersFull()) {
            meter.visible = label.visible = inputLabel.visible = true;

            // show mega sweep

         } else {
            meter.visible = label.visible = inputLabel.visible = false;
         }

      });
      game.add(meter);
      game.add(label);
      game.add(inputLabel);
   }

   private _addMeter(piece: PieceType, x: number, y: number) {
      var meter = new Meter(x, y, Config.MeterWidth, Config.MeterHeight, PieceTypeToColor[piece], Config.SweepThreshold);
      meter.enableCapturePointer = true;
      var label = new ex.Label(null, meter.getCenter().x, meter.getCenter().y + 3);
      label.textAlign = ex.TextAlign.Center;
      label.color = ex.Color.White;

      meter.on("pointerup", () => {
         sweeper.sweep(piece);
      });
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         meter.score = this._meters[piece];

         // mega sweep
         if (this.allMetersFull()) {
            meter.visible = label.visible = false;
         } else {
            meter.visible = label.visible = true;

            if (this._meters[piece] === Config.SweepThreshold) {
               label.text = "SWEEP";
            } else {
               label.text = "";
            }
         }

      });
      game.add(meter);
      game.add(label);
      this._meterActors.push(meter);
      this._meterLabels.push(label);
   }

   public clearMeters() {
      if (this._meterActors) {
         for (var i = 0; i < this._meterActors.length; i++) {
            game.remove(this._meterActors[i]);
         }
      }
      if (this._meterLabels) {
         for (var i = 0; i < this._meterLabels.length; i++) {
            game.remove(this._meterLabels[i]);
         }
      }
   }

   private _addSweepMeter(x: number, y: number) {
      var square = new Meter(x, y, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, this._sweepMeterThreshold);
      square.enableCapturePointer = true;
      var label = new ex.Label(null, square.getCenter().x, y + 20);
      label.textAlign = ex.TextAlign.Center;
      label.color = ex.Color.Black;

      square.on("pointerup", () => {
         sweeper.sweep();
      });
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         square.score = this._sweepMeter;
         square.threshold = this._sweepMeterThreshold;

         if (this._sweepMeter === this._sweepMeterThreshold) {
            label.text = "'S' TO SWEEP";
         } else {
            label.text = Math.floor((this._sweepMeter / this._sweepMeterThreshold) * 100) + '%';
         }
      });
      game.add(square);
      game.add(label);
      this._meterActors.push(square);
      this._meterLabels.push(label);
   }
}

class Meter extends ex.UIActor {
   public score: number;

   constructor(x: number, y: number, width: number, height: number, color: ex.Color, public threshold: number) {
      super(x, y, width, height);

      this.color = color;
      this.anchor.setTo(0, 0);
   }

   public onInitialize(engine: ex.Engine) {
      super.onInitialize(engine);

      var screenPos = engine.worldToScreenCoordinates(new ex.Point(this.x, this.y));
      this.x = screenPos.x;
      this.y = screenPos.y;
   }

   public draw(ctx: CanvasRenderingContext2D, delta: number) {

      var x = this.getBounds().left;
      var y = this.getBounds().top;

      // border
      ctx.strokeStyle = Util.darken(this.color, 0.6).toString();
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, this.getWidth(), this.getHeight());

      // bg
      ctx.fillStyle = new ex.Color(this.color.r, this.color.g, this.color.b, 0.3).toString();
      ctx.fillRect(x, y, this.getWidth(), this.getHeight());

      var percentage = (this.score / this.threshold);

      // fill
      ctx.fillStyle = this.color.toString();
      ctx.fillRect(x, y, (this.getWidth() * percentage), this.getHeight());
   }
}