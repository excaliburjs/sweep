class Stats {
   private _numCirclesDestroyed: number = 0;
   private _numTrianglesDestroyed: number = 0;
   private _numSquaresDestroyed: number = 0;
   private _numStarsDestroyed: number = 0;

   private _longestCircleCombo: number = 0;
   private _longestTriangleCombo: number = 0;
   private _longestSquareCombo: number = 0;
   private _longestStarCombo: number = 0;

   private _types = [PieceType.Circle, PieceType.Triangle, PieceType.Square, PieceType.Star];
   private _scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
   private _chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];

   constructor() {

   }

   public scorePieces(pieces: Piece[]) {

      this._scores[this._types.indexOf(pieces[0].getType())] += pieces.length;
   }

   public scoreChain(pieces: Piece[]) {

      var chainScore = this._chains[this._types.indexOf(pieces[0].getType())];

      if (chainScore < pieces.length) {
         this._chains[this._types.indexOf(pieces[0].getType())] = pieces.length;
      }
   }

   public drawScores() {

      var scoreXPos = visualGrid.x + visualGrid.getWidth() + Config.ScoreXBuffer;

      this._totalScore("total ", scoreXPos, 330);
      this._addScore("circles ", this._scores, 0, scoreXPos, 350);
      this._addScore("triangles ", this._scores, 1, scoreXPos, 370);
      this._addScore("squares ", this._scores, 2, scoreXPos, 390);
      this._addScore("stars ", this._scores, 3, scoreXPos, 410);

      this._addScore("circle chain ", this._chains, 0, scoreXPos, 440);
      this._addScore("triangle chain ", this._chains, 1, scoreXPos, 460);
      this._addScore("square chain ", this._chains, 2, scoreXPos, 480);
      this._addScore("star chain ", this._chains, 3, scoreXPos, 500);
   }

   private _addScore(description: String, statArray: Array<any>, statIndex: number, xPos: number, yPos: number) {
      var label = new ex.Label(description + statArray[statIndex].toString(), xPos, yPos);
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         label.text = description + statArray[statIndex].toString();
      });
      game.currentScene.addChild(label);
   }

   private _totalScore(description: String, xPos: number, yPos: number) {
      var totalScore = 0;
      var label = new ex.Label(description + totalScore.toString(), xPos, yPos);
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         var totalScore = this._scores[0] + this._scores[1] + this._scores[2] + this._scores[3]
         label.text = description + totalScore.toString();
      });
      game.currentScene.addChild(label);
   }

}