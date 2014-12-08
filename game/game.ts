/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="util.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="resources.ts"/>
/// <reference path="Piece.ts"/>
/// <reference path="grid.ts"/>
/// <reference path="match.ts"/>
/// <reference path="polyline.ts"/>
/// <reference path="turn.ts"/>
/// <reference path="transition.ts"/>
/// <reference path="Stats.ts"/>
/// <reference path="sweeper.ts"/>
/// <reference path="UIWidget.ts"/>
/// <reference path="background.ts"/>

var game = new ex.Engine(Config.gameWidth, Config.gameHeight, "game", ex.DisplayMode.FullScreen);
game.backgroundColor = ex.Color.Transparent;


var gameMode = GameMode.Standard;

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// game objects
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);

var visualGrid, turnManager, matcher, transitionManager, sweeper, stats, mask, polyline, background;

// game modes
var loadConfig = (config) => {
   Config.resetDefault();
   config.call(this);
   InitSetup();
};

document.getElementById("loadCasual").addEventListener("mouseup", () => loadConfig(Config.loadCasual));
document.getElementById("loadSurvial").addEventListener("mouseup", () => loadConfig(Config.loadSurvival));
document.getElementById("loadSurvivalReverse").addEventListener("mouseup", () => loadConfig(Config.loadSurvivalReverse));

loadConfig(Config.loadCasual);

InitSetup();

//reset the game with the given grid dimensions
function InitSetup() {
   visualGrid = new VisualGrid(grid);

   var i: number;

   if (game.currentScene.children) {
      for (i = 0; i < game.currentScene.children.length; i++) {
         game.removeChild(game.currentScene.children[i]);
      }
   }

   game.currentScene.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);

   var leftCorner = game.screenToWorldCoordinates(new ex.Point(0,0));
   background = new Background(leftCorner, Resources.BackgroundTexture);
   background.dy = -10;
   game.add(background);

   //initialize game objects
   if (matcher) matcher.dispose(); //unbind events
   if (turnManager) turnManager.dispose(); //cancel the timer
   matcher = new MatchManager();
   polyline = new PolyLine();
   stats = new Stats();
   turnManager = new TurnManager(visualGrid.logicalGrid, matcher, Config.EnableTimer ? TurnMode.Timed : TurnMode.Match);
   transitionManager = new TransitionManager(visualGrid.logicalGrid, visualGrid);
   sweeper = new Sweeper(Config.SweepMovesUp ? Config.SweepMaxRow : Config.SweepMinRow, visualGrid.logicalGrid.cols);
   mask = new ex.Actor(0, Config.GridCellsHigh * Config.CellHeight + 5, visualGrid.logicalGrid.cols * Config.CellWidth, Config.CellHeight * 2, Palette.GameBackgroundColor.clone());


   mask.anchor.setTo(0, 0);
 
   stats.drawScores();

   game.add(visualGrid);
   game.add(sweeper);
   
   game.add(polyline);
   game.add(mask);

   //add pieces to initial rows
   for (i = 0; i < Config.NumStartingRows; i++) {
      grid.fill(grid.rows - (i + 1));
   }
   playLoop();
}

game.input.keyboard.on('up', (evt: ex.Input.KeyEvent) => {
   if (evt.key === ex.Input.Keys.D) {
      game.isDebug = !game.isDebug;
   }

   if (evt.key === ex.Input.Keys.U) {
      // shift all rows up 1
      for (var i = 0; i < grid.rows; i++) {
         grid.shift(i, i - 1);         
      }
      // fill first row
      grid.fill(grid.rows - 1);
   }

   if (evt.key === ex.Input.Keys.Up || evt.key == ex.Input.Keys.Down || evt.key === ex.Input.Keys.Left || evt.key === ex.Input.Keys.Right) {

      var numCols = grid.cols || 0;
      var numRows = grid.rows || 0;

      if (evt.key === ex.Input.Keys.Up) {
         numRows++;
      } else if (evt.key === ex.Input.Keys.Down) {
         numRows--;
      } else if (evt.key === ex.Input.Keys.Left) {
         numCols--;
      } else if (evt.key === ex.Input.Keys.Right) {
         numCols++;
      }

      grid = new LogicalGrid(numRows, numCols);
      InitSetup();
   }   
});

var gameOverWidget = new UIWidget();
//var postYourScore = new ex.Actor(gameOverWidget.widget.x + gameOverWidget.widget.getWidth() / 2, gameOverWidget.widget.y + 100, 200, 100, ex.Color.Blue);
//gameOverWidget.addButton(postYourScore);

function playLoop() {
   Resources.LoopSound.stop();
   Resources.ChallengeLoopSound.stop();
   // play some sounds
   if (gameMode === GameMode.Standard) {
      Resources.KnockSound.setVolume(.5);
      Resources.TapsSound.setVolume(.2);
      Resources.SweepSound.setVolume(.4);
      Resources.MegaSweepSound.setVolume(.4);
      Resources.LoopSound.setLoop(true);
      Resources.LoopSound.play();
   } else {

      Resources.ChallengeLoopSound.setLoop(true);
      Resources.ChallengeLoopSound.setVolume(.5);
      Resources.ChallengeLoopSound.play();
   }
}

function mute() {
   Resources.LoopSound.stop();
   Resources.ChallengeLoopSound.stop();
}

function playGameOver() {
   Resources.LoopSound.stop();
   Resources.ChallengeLoopSound.stop();
   Resources.GameOverSound.setVolume(.4);
   Resources.GameOverSound.play();
}

function gameOver() {
   var totalScore = stats.getTotalScore();
   var longestChain = stats.getLongestChain();
   var turnsTaken = stats.getTurnNumber();
   var timeElapsed = turnManager.getTime()/1000/60;
   var analytics = (<any>window).ga;
   if (analytics) {
      analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'total score', { 'eventValue': totalScore, 'nonInteraction': 1 });
      analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'longest chain', { 'eventValue': longestChain, 'nonInteraction': 1 });
      if (gameMode == GameMode.Standard) {
         analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'turns taken', { 'eventValue': turnsTaken, 'nonInteraction': 1 });
      } else if (gameMode == GameMode.Timed) {
         analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'time elapsed', { 'eventValue': timeElapsed, 'nonInteraction': 1 });
      }
   }

   playGameOver();

   if (turnManager) turnManager.dispose(); // stop game over from happening infinitely in time attack
   var color = new ex.Color(ex.Color.DarkGray.r, ex.Color.DarkGray.g, ex.Color.DarkGray.b, 0.3)
   var gameOverWidgetActor = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() - 800, 300, 300, color);
   game.addChild(gameOverWidgetActor);
   gameOverWidgetActor.moveTo(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 1000);

   game.addChild(gameOverWidget.widget);
   //gameOverWidget.widget.moveTo(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 1000);
   //gameOverWidget.moveWidget(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 50);

   //TODO buttons fade in once widget is in place? perhaps button actors are invisible, and the sprite for the widget has the buttons on it
   var postScoreButton = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2 - 50, 250, 50, ex.Color.Blue);
   gameOverWidget.addButton(postScoreButton);

   var playAgainButton = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2 + 50, 250, 50, ex.Color.Green);
   gameOverWidget.addButton(playAgainButton);


}

// TODO clean up pieces that are not in play anymore after update loop

game.start(loader).then(() => {
   playLoop();
});