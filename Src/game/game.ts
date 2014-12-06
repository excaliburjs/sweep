/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="resources.ts"/>
/// <reference path="Piece.ts"/>
/// <reference path="grid.ts"/>
/// <reference path="match.ts"/>
/// <reference path="turn.ts"/>

var game = new ex.Engine(720, 480, "game");

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// build grid
var grid = new LogicalGrid(15, 10);
var visualGrid = new VisualGrid(grid);
var matcher = new MatchManager();
var turnManager = new TurnManager(grid, matcher, TurnMode.Match);

game.currentScene.camera.setFocus(visualGrid.getWidth()/2, visualGrid.getHeight()/2);
game.add(visualGrid);

grid.fill(grid.rows - 1);
grid.fill(grid.rows - 2);
grid.fill(grid.rows - 3);

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
});

// TODO clean up pieces that are not in play anymore after update loop

game.start(loader).then(() => {
   // todo build game
});