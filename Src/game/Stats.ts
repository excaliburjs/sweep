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

   private _types = [PieceType.Circle, PieceType.Triangle, PieceType.Square, PieceType.Star];
   private _scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
   private _meters = [this._numCirclesDestroyedMeter, this._numTrianglesDestroyedMeter, this._numSquaresDestroyedMeter, this._numStarsDestroyedMeter];
   private _chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];
   private _lastChain: number = 0;

   constructor() {

   }

   public getMeter(pieceType: PieceType) {
      return this._meters[this._types.indexOf(pieceType)];
   }

   public resetMeter(pieceType: PieceType) {
      this._meters[this._types.indexOf(pieceType)] = 0;
   }

   public scorePieces(pieces: Piece[]) {
      var type = this._types.indexOf(pieces[0].getType());

      this._scores[type] += pieces.length;
      var newScore = this._meters[type] + pieces.length;

      this._meters[type] = Math.min(newScore, Config.SweepThreshold);
   }

   public scoreChain(pieces: Piece[]) {

      var chainScore = this._chains[this._types.indexOf(pieces[0].getType())];
      this._lastChain = pieces.length;

      if (chainScore < pieces.length) {
         this._chains[this._types.indexOf(pieces[0].getType())] = pieces.length;
      }
   }

   public drawScores() {

      var scoreXPos = visualGrid.x + visualGrid.getWidth() + Config.ScoreXBuffer;

      this._totalScore("total ", scoreXPos, 330);

      var yPos = 350;
      this._addMeter(0, scoreXPos, yPos);
      this._addMeter(1, scoreXPos, yPos += Config.MeterHeight + 5);
      this._addMeter(2, scoreXPos, yPos += Config.MeterHeight + 5);
      this._addMeter(3, scoreXPos, yPos += Config.MeterHeight + 5);

      this._addScore("chain ", this._chains, 0, scoreXPos, yPos += Config.MeterHeight + 20);
      this._addScore("chain ", this._chains, 1, scoreXPos, yPos += 20);
      this._addScore("chain ", this._chains, 2, scoreXPos, yPos += 20);
      this._addScore("chain ", this._chains, 3, scoreXPos, yPos += 20);

      var lastChainLabel = new ex.Label("last chain " + this._lastChain, scoreXPos, yPos += 30);
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         lastChainLabel.text = "last chain " + this._lastChain;
      });
      game.currentScene.addChild(lastChainLabel);
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

   private _totalScore(description: String, xPos: number, yPos: number) {
      var totalScore = 0;
      var label = new ex.Label(description + totalScore.toString(), xPos, yPos);
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         var totalScore = this._scores[0] + this._scores[1] + this._scores[2] + this._scores[3];
         label.text = description + totalScore.toString();
      });
      game.currentScene.addChild(label);
   }

   private _addMeter(piece: PieceType, x: number, y: number) {
      var square = new Meter(x, y, PieceTypeToColor[piece]);
      var label = new ex.Label(null, square.getCenter().x, square.getCenter().y + 3);
      label.textAlign = ex.TextAlign.Center;
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         square.score = this._meters[piece];

         if (this._meters[piece] === Config.SweepThreshold) {
            label.text = "Press " + (piece + 1) + " to SWEEP";
         } else {
            label.text = this._meters[piece].toString();
         }
      });
      game.add(square);
      game.add(label);
   }
}

class Meter extends ex.Actor {
   public score: number;

   constructor(x: number, y: number, color: ex.Color) {
      super(x, y, Config.MeterWidth, Config.MeterHeight, color);
   }

   public draw(ctx: CanvasRenderingContext2D, delta: number) {

      ctx.strokeStyle = this.color.toString();
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.getWidth(), this.getHeight());

      var percentage = (this.score / Config.SweepThreshold);

      ctx.fillStyle = this.color.toString();
      ctx.fillRect(this.x, this.y, (this.getWidth() * percentage), this.getHeight());
   }
}