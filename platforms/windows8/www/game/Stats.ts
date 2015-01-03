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
   private _level: number = 1;

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
      Config.EnableLevels && this.allMetersFull() && this._level++;

      var i;
      for (i = 0; i < this._meters.length; i++) {
         this._meters[i] = 0;
      }
      for (i = 0; i < this._multipliers.length; i++) {
         this._multipliers[i] = Config.EnableLevels && Config.SweepScoreMultiplierIncreasesPerLevel ? this._level : 1;
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
      
      var newScore = this._meters[type] + pieces.length;

      this._meters[type] = Math.min(newScore, Config.SweepThreshold);
      this._sweepMeter = Math.min(this._sweepMeter + pieces.length, this._sweepMeterThreshold);
      this._scores[type] += this.scoreMultiplier(pieces.length + this.chainBonus(pieces), type);
   }

   public scoreMultiplier(currentScore: number, type: PieceType): number {
      var modifiedScore = currentScore;
      if (this._meters[type] == Config.SweepThreshold) {
         this._multipliers[type] = Config.EnableLevels && Config.SweepScoreMultiplierIncreasesPerLevel
         ? this._level + 1
         : Config.SweepScoreMultiplier;
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

   public calculateLevelBonus(): string {
      var levelMultiplier = Config.LevelMultiplierEndBonus;
      if (Config.EnableLevels) {
         var modifiedScore = Math.floor(this._finalScore * levelMultiplier * Math.log(this._level+2));
         var diff = modifiedScore - this._finalScore;
         this._finalScore = modifiedScore;
         return diff.toString();
      }
      return "0";
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

      this._addTotalScore();
      
      if (gameMode === GameMode.Standard) {
         this._addMultipliers();
         this._addWaves();
      }
      if (Config.EnableLevels) {
         this._addLevel();
      }

      if (Config.EnableSweepMeters) {
         this._addMeters();
         this._addMegaSweep();
      }
      if (Config.EnableSweeper) {
         this._addSweepMeter();
      }
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

   private _addTotalScore() {
      var totalScore = 0;
      var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
      var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
      var margin = Config.StatsScoresMargin * gameScale.x;
      var scoreLabel = new ex.Label(totalScore.toString(), visualGrid.x + margin, visualGrid.y + margin, scoreFontSize.toString() + "px museo-sans, arial");
      var scoreDescLabel = new ex.Label("score", visualGrid.x + margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize.toString() + "px museo-sans, arial");
      scoreLabel.color = scoreDescLabel.color = ex.Color.White.clone();
      scoreLabel.opacity = 0.6;
      scoreDescLabel.opacity = 0.2;
      scoreLabel.baseAlign = scoreDescLabel.baseAlign = ex.BaseAlign.Top;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         margin = Config.StatsScoresMargin * gameScale.x;
         scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
         scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
         scoreLabel.x = visualGrid.x + margin;
         scoreLabel.y = visualGrid.y + margin;
         scoreDescLabel.x = visualGrid.x + margin;
         scoreDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
         scoreLabel.font = scoreFontSize.toString() + "px museo-sans, arial";
         scoreDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";
         
         scoreLabel.text = this.getTotalScore().toString();
      });
      game.add(scoreLabel);
      game.add(scoreDescLabel);
   }

   private _addWaves() {
      var centerOffset = -12;
      var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
      var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
      var margin = Config.StatsScoresMargin * gameScale.x;
      var waveLabel = new ex.Label(this._turnNumber.toString(), visualGrid.getCenter().x, visualGrid.y + margin, scoreFontSize.toString() + "px museo-sans, arial");
      var waveDescLabel = new ex.Label("wave", visualGrid.getCenter().x + margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize.toString() + "px museo-sans, arial");
      waveLabel.color = waveDescLabel.color = ex.Color.White.clone();
      waveLabel.opacity = 0.6;
      waveDescLabel.opacity = 0.2;
      waveLabel.baseAlign = waveDescLabel.baseAlign = ex.BaseAlign.Top;
      waveLabel.textAlign = waveDescLabel.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         margin = Config.StatsScoresMargin * gameScale.x;
         scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
         scoreDescSize = Config.ScoreTopDescSize * gameScale.x;     
         waveLabel.x = visualGrid.getCenter().x;
         waveLabel.y = visualGrid.y + margin;
         waveLabel.font = scoreFontSize.toString() + "px museo-sans, arial";
         waveDescLabel.x = visualGrid.getCenter().x;
         waveDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
         waveDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";

         waveLabel.text = this._turnNumber.toString().toString();
      });
      game.add(waveLabel);
      game.add(waveDescLabel);
   }

   private _addMultipliers() {
      var margin = Config.StatsScoresMargin * gameScale.x;
      var bonusFontSize = Config.ScoreBonusFontSize * gameScale.x;
      var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
      var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
      var bonusLabels: ex.Label[] = [], i, j, bonusLabel;
      var bonusMargin = (bonusFontSize * 1.1);

      // rtl
      for (i = 0, j = this._multipliers.length - 1; i < this._multipliers.length; i++, j--) {
         bonusLabel = new ex.Label(this._turnNumber.toString(), visualGrid.getRight() - margin - (j * bonusMargin), visualGrid.y + margin, bonusFontSize + "px museo-sans, arial");
         bonusLabel.color = PieceTypeToColor[i].clone();
         bonusLabel.opacity = 0.6;
         bonusLabel.baseAlign = ex.BaseAlign.Top;
         bonusLabel.textAlign = ex.TextAlign.Right;
         bonusLabels.push(bonusLabel);
         game.add(bonusLabel);         
      }
      
      var bonusDescLabel = new ex.Label("bonuses", visualGrid.getRight() - margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize + "px museo-sans, arial");
      bonusDescLabel.color = ex.Color.White.clone();
      bonusDescLabel.opacity = 0.2;
      bonusDescLabel.baseAlign = ex.BaseAlign.Top;
      bonusDescLabel.textAlign = ex.TextAlign.Right;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         margin = Config.StatsScoresMargin * gameScale.x;
         bonusFontSize = Config.ScoreBonusFontSize * gameScale.x;
         scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
         scoreDescSize = Config.ScoreTopDescSize * gameScale.x;       
         bonusMargin = (bonusFontSize * 1.1);
         bonusDescLabel.x = visualGrid.getRight() - margin;
         bonusDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
         bonusDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";

         for (i = 0, j = this._multipliers.length - 1; i < this._multipliers.length; i++, j--) {
            bonusLabel = bonusLabels[i];
            bonusLabel.x = visualGrid.getRight() - margin - (j * bonusMargin);
            bonusLabel.y = visualGrid.y + margin;
            bonusLabel.text = this._multipliers[i].toString() + "x";

            if (this._multipliers[i] <= 1) {
               bonusLabel.opacity = 0.2;
               bonusLabel.font = bonusFontSize + "px museo-sans, arial";
            } else {
               bonusLabel.opacity = 0.6;
               bonusLabel.font = "normal normal 700 " + bonusFontSize + "px museo-sans, arial";
            }
         }
      });
      
      game.add(bonusDescLabel);
   }

   private _addLevel() {
      var offset = Config.LevelYOffset * gameScale.y;
      var levelFontSize = Config.LevelFontSize * gameScale.x;
      var levelLabel = new ex.Label(this._level.toString(), visualGrid.getCenter().x, visualGrid.getCenter().y + offset, "normal normal 700 " + levelFontSize.toString() + "px museo-sans, arial");
      levelLabel.color = ex.Color.White.clone();
      levelLabel.opacity = 0.1;      
      levelLabel.baseAlign = ex.BaseAlign.Top;
      levelLabel.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         offset = Config.LevelYOffset * gameScale.y;
         levelFontSize = Config.LevelFontSize * gameScale.x;
         levelLabel.x = visualGrid.getCenter().x;
         levelLabel.y = visualGrid.getCenter().y + offset;
         levelLabel.font = "normal normal 700 " + levelFontSize.toString() + "px museo-sans, arial";

         levelLabel.text = this._level.toString();
      });
      game.add(levelLabel);
   }

   private _addMegaSweep() {
      // todo sprite animation
      var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
      var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
      var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;
      var meter = new Meter(meterXPos, meterYPos, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, 1, Config.EnableLevels ? Resources.TextureMegaSweepIndicator : Resources.TextureSweepIndicator, false);
      meter.score = 1;
      meter.enableCapturePointer = true;
      meter.anchor.setTo(0, 0);

      meter.on("pointerup", () => {
         if (!matcher.preventOtherPointerUp) {
            sweeper.sweepAll();
         }
         matcher.preventOtherPointerUp = false;
      });

      game.addEventListener('update', (data?: ex.UpdateEvent) => {

         // mega sweep
         if (this.allMetersFull()) {
            meter.visible = true;

            // show mega sweep

         } else {
            meter.visible = false;
         }

      });
      game.add(meter);
      this._meterActors.push(meter);
   }

   private _addMeter(piece: PieceType, x: number, y: number, pos: number) {
      var meter = new Meter(x + (pos * Config.MeterWidth) + (pos * Config.MeterMargin), y, Config.MeterWidth, Config.MeterHeight, PieceTypeToColor[piece], Config.SweepThreshold, Resources.TextureSweepIndicator);
      meter.enableCapturePointer = true;

      meter.on("pointerup", () => {
         if (!matcher.preventOtherPointerUp) {
            sweeper.sweep(piece);
         }
         matcher.preventOtherPointerUp = false;
      });
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         meter.score = this._meters[piece];

         // mega sweep
         if (this.allMetersFull()) {
            meter.visible = false;
         } else {
            meter.visible = true;
         }

      });
      game.add(meter);
      this._meterActors.push(meter);
   }

   private _addMeters() {
      var meters: Meter[] = [], i, meter: Meter;

      var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
      var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
      var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;

       for (i = 0; i < this._meters.length; i++) {
           this._addMeter(PieceTypes[i], meterXPos, meterYPos, i); 
       }    
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

   //sweep meter for challenge mode
   private _addSweepMeter() {
      var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
      var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
      var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;
      var square = new Meter(meterXPos, meterYPos, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, this._sweepMeterThreshold, Resources.TextureSweepIndicator);
      square.enableCapturePointer = true;
     
      square.on("pointerup", () => {
            sweeper.sweep();
      });
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         square.score = this._sweepMeter;
         square.threshold = this._sweepMeterThreshold;         
      });
      game.add(square);
      this._meterActors.push(square);
   }
}

class Meter extends ex.UIActor {
   public score: number;
   private _sweepIndicator: ex.Sprite;

   constructor(x: number, y: number, width: number, height: number, color: ex.Color, public threshold: number, sweepIndicator: ex.Texture, public circle = true) {
      super(x, y, width, height);

      this.color = color;
      this.anchor.setTo(0, 0);

      this._sweepIndicator = sweepIndicator.asSprite();
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
      var percentage = (this.score / this.threshold);
      
      if (this.circle) {
         x = this.getCenter().x;
         y = this.getCenter().y;

         var radius = Config.MeterRadius * gameScale.x;
         var border = Config.MeterBorderThickness * gameScale.x;

         // bg
         var bg;
         if (this.score === this.threshold) {
            bg = new ex.Color(this.color.r, this.color.g, this.color.b, 1).toString();
         } else {
            bg = new ex.Color(this.color.r, this.color.g, this.color.b, 0.3).toString();
         }
         ctx.beginPath();
         ctx.arc(x, y, radius, 0, ex.Util.toRadians(360), false);
         ctx.fillStyle = bg;
         ctx.fill();
         ctx.closePath();

         // meter
         var from = 0;
         var to = ((2 * Math.PI) * percentage);
         to = ex.Util.clamp(to, ex.Util.toRadians(5), ex.Util.toRadians(360));
         // shift -90 degrees
         from -= ex.Util.toRadians(90);
         to -= ex.Util.toRadians(90);

         ctx.beginPath();
         ctx.arc(x, y, radius, from, to, false);
         ctx.strokeStyle = this.color.toString();
         ctx.lineWidth = border;
         ctx.stroke();
         ctx.closePath();

         // fill

      } else {
         // border
         ctx.strokeStyle = Util.darken(this.color, 0.6).toString();
         ctx.lineWidth = 1;
         ctx.strokeRect(x, y, this.getWidth(), this.getHeight());

         // bg
         ctx.fillStyle = new ex.Color(this.color.r, this.color.g, this.color.b, 0.3).toString();
         ctx.fillRect(x, y, this.getWidth(), this.getHeight());
         
         // fill
         ctx.fillStyle = this.color.toString();
         ctx.fillRect(x, y, (this.getWidth() * percentage), this.getHeight());
      }

      if (this.score === this.threshold) {
         var centeredX = this.getCenter().x - (this._sweepIndicator.width / 2);
         var centeredY = this.getCenter().y - (this._sweepIndicator.height / 2);

         this._sweepIndicator.draw(ctx, centeredX, centeredY);
      }
   }
}