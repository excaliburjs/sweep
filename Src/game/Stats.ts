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

      this._updateScore("circles ", this._scores, 0, 500, 350);
      this._updateScore("triangles ", this._scores, 1, 500, 370);
      this._updateScore("squares ", this._scores, 2, 500, 390);
      this._updateScore("stars ", this._scores, 3, 500, 410);

      this._updateScore("circle chain ", this._chains, 0, 500, 440);
      this._updateScore("triangle chain ", this._chains, 1, 500, 460);
      this._updateScore("square chain ", this._chains, 2, 500, 480);
      this._updateScore("star chain ", this._chains, 3, 500, 500);
   }

   private _updateScore(description: String, statArray: Array<any>, statIndex: number, xPos: number, yPos: number) {
      var label = new ex.Label(description + statArray[statIndex].toString(), xPos, yPos);
      label.color = ex.Color.Black;
      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         label.text = description + statArray[statIndex].toString();
      });
      game.currentScene.addChild(label);
   }

}