/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="util.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="resources.ts"/>
/// <reference path="Piece.ts"/>
/// <reference path="grid.ts"/>
/// <reference path="match.ts"/>
/// <reference path="turn.ts"/>
/// <reference path="transition.ts"/>

var game = new ex.Engine(Config.gameWidth, Config.gameHeight, "game");
game.backgroundColor = Palette.GameBackgroundColor;

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// build grid
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
var visualGrid = new VisualGrid(grid);
var matcher = new MatchManager();
var turnManager = new TurnManager(grid, matcher, TurnMode.Match);

game.currentScene.camera.setFocus(visualGrid.getWidth()/2, visualGrid.getHeight()/2);
game.add(visualGrid);

for (var i = 0; i < Config.NumStartingRows; i++) {
   grid.fill(grid.rows - (i + 1));
}

game.input.keyboard.on('down', (evt: ex.Input.KeyEvent) => {
   if (evt.key === ex.Input.Keys.D) {
      game.isDebug = !game.isDebug;
   }

   if (evt.key === ex.Input.Keys.S) {
      // shift all rows up 1
      for (var i = 0; i < grid.rows; i++) {
         grid.shift(i, i - 1);         
      }
      // fill first row
      grid.fill(grid.rows - 1);
   }

   if (evt.key === 49) visualGrid.sweep(PieceType.Circle);
   if (evt.key === 50) visualGrid.sweep(PieceType.Square);
   if (evt.key === 51) visualGrid.sweep(PieceType.Star);
   if (evt.key === 52) visualGrid.sweep(PieceType.Triangle);
});

// TODO clean up pieces that are not in play anymore after update loop

game.start(loader).then(() => {
   // todo build game
});