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
   private _combos = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];

   constructor() {

   }

   public scorePieces(pieces: Piece[]) {

      this._scores[this._types.indexOf(pieces[0].getType())] += pieces.length;
   }

   public scoreChain(pieces: Piece[]) {

      var comboScore = this._combos[this._types.indexOf(pieces[0].getType())];

      if (comboScore < pieces.length) {
         this._combos[this._types.indexOf(pieces[0].getType())] = pieces.length;
      }
   }

   public drawScores() {
      var labelCirclesDestroyed = new ex.Label("circles " + this._numCirclesDestroyed, 500, 350);
      labelCirclesDestroyed.color = ex.Color.Black;
      //labelCirclesDestroyed.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         labelCirclesDestroyed.text = "circles " + this._scores[0];
      });
      game.currentScene.addChild(labelCirclesDestroyed);


      var labelTrianglesDestroyed = new ex.Label("triangles " + this._numTrianglesDestroyed, 500, 370);
      labelTrianglesDestroyed.color = ex.Color.Black;
      //labelTrianglesDestroyed.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         labelTrianglesDestroyed.text = "triangles " + this._scores[1];
      });
      game.currentScene.addChild(labelTrianglesDestroyed);


      var labelSquaresDestroyed = new ex.Label("squares " + this._numSquaresDestroyed, 500, 390);
      labelSquaresDestroyed.color = ex.Color.Black;
      //labelSquaresDestroyed.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         labelSquaresDestroyed.text = "squares " + this._scores[2];
      });
      game.currentScene.addChild(labelSquaresDestroyed);


      var labelStarsDestroyed = new ex.Label("stars " + this._numStarsDestroyed, 500, 410);
      labelStarsDestroyed.color = ex.Color.Black;
      //labelStarsDestroyed.textAlign = ex.TextAlign.Center;

      game.addEventListener('update', (data?: ex.UpdateEvent) => {
         labelStarsDestroyed.text = "stars " + this._scores[3];
      });
      game.currentScene.addChild(labelStarsDestroyed);
   }

}