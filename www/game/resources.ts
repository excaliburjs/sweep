/// <reference path="util.ts"/>

var Resources = {
   LoopSound: new ex.Sound('sounds/loop.mp3'),
   Note1Sound: new ex.Sound('sounds/note1.mp3'),
   Note2Sound: new ex.Sound('sounds/note2.mp3'),
   Note3Sound: new ex.Sound('sounds/note3.mp3'),
   Note4Sound: new ex.Sound('sounds/note4.mp3'),
   Note5Sound: new ex.Sound('sounds/note5.mp3'),
   Note6Sound: new ex.Sound('sounds/note6.mp3'),
   Note7Sound: new ex.Sound('sounds/note7.mp3'),
   Note8Sound: new ex.Sound('sounds/note8.mp3'),

   ChallengeLoopSound: new ex.Sound('sounds/challengeloopfixed.mp3'),
   ChallengeNote1Sound: new ex.Sound('sounds/challengenote1.mp3'),
   ChallengeNote2Sound: new ex.Sound('sounds/challengenote2.mp3'),
   ChallengeNote3Sound: new ex.Sound('sounds/challengenote3.mp3'),
   ChallengeNote4Sound: new ex.Sound('sounds/challengenote4.mp3'),
   ChallengeNote5Sound: new ex.Sound('sounds/challengenote5.mp3'),
   ChallengeNote6Sound: new ex.Sound('sounds/challengenote6.mp3'),

   GameOverSound: new ex.Sound('sounds/gameover.mp3'),
   KnockSound: new ex.Sound('sounds/knock.mp3'),
   UndoSound: new ex.Sound('sounds/undo2.mp3'),
   TapsSound: new ex.Sound('sounds/taps.mp3'),
   MatchSound: new ex.Sound('sounds/match.mp3'),
   SweepSound: new ex.Sound('sounds/sweep.mp3'),
   MegaSweepSound: new ex.Sound('sounds/megasweep.mp3'),


   // Textures
   TextureTile1: new ex.Texture("images/Tile1.png"),
   TextureTile2: new ex.Texture("images/Tile2.png"),
   TextureTile3: new ex.Texture("images/Tile3.png"),
   TextureTile4: new ex.Texture("images/Tile4.png"),
   BackgroundTexture: new ex.Texture('images/bg2.png'),
   TextureLogo: new ex.Texture("images/logo.png"),
   TextureStandardBtn: new ex.Texture("images/standard.png"),
   TextureChallengeBtn: new ex.Texture("images/challenge.png"),
   NoMovesTexture: new ex.Texture('images/no-moves.png'),
   TextureSweepIndicator: new ex.Texture("images/sweep-indicator.png"),
   TextureMegaSweepIndicator: new ex.Texture("images/mega-sweep-indicator.png")
};

var Palette = {
   GameBackgroundColor: ex.Color.fromHex("#efefef"),
   GridBackgroundColor: new ex.Color(0, 20, 25, 0.9),

   // Beach
   PieceColor1: ex.Color.fromHex("#00718D"),
   PieceColor2: ex.Color.fromHex("#7A5CA7"),
   PieceColor3: ex.Color.fromHex("#4c603a"),
   PieceColor4: ex.Color.fromHex("#c17b55"),

   MegaSweepColor: ex.Color.fromHex("#55c192"),

   PolylineColor: ex.Color.fromHex("#F48347"),
   PolylineBorderColor: new ex.Color(255, 255, 255, 0.7)
};