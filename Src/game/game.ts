/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="util.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="resources.ts"/>
/// <reference path="Piece.ts"/>
/// <reference path="grid.ts"/>
/// <reference path="mainmenu.ts"/>
/// <reference path="match.ts"/>
/// <reference path="polyline.ts"/>
/// <reference path="turn.ts"/>
/// <reference path="transition.ts"/>
/// <reference path="Stats.ts"/>
/// <reference path="sweeper.ts"/>
/// <reference path="UIWidget.ts"/>
/// <reference path="background.ts"/>
/// <reference path="Effects.ts"/>
/// <reference path="nomoves.ts"/>
/// <reference path="mask.ts"/>

var game = new ex.Engine(0, 0, "game", ex.DisplayMode.FullScreen);
game.backgroundColor = ex.Color.Transparent;


var gameMode = GameMode.Standard;
var muted = false;

var loader = new ex.Loader();

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// game objects
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
var mainMenu = new MainMenu();
var polyline = new PolyLine();
var noMoves = new NoMoves();
var mask = new Mask();

game.add(mainMenu);
game.add(polyline);
game.add(noMoves);
game.add(mask);

var visualGrid: VisualGrid,
   turnManager: TurnManager,
   matcher: MatchManager,
   transitionManager: TransitionManager,
   sweeper: Sweeper,
   stats: Stats,
   background: Background,
   noMoves: NoMoves,
   effects;

// game modes
var loadConfig = (config) => {
   Config.resetDefault();
   config.call(this);
   InitSetup();
};

Config.resetDefault();
InitSetup();

//reset the game with the given grid dimensions
function InitSetup() {
   grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
   visualGrid = new VisualGrid(grid);   

   effects = new Effects();

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

   if (turnManager && turnManager.currentPromise.state() === ex.PromiseState.Pending) {
      turnManager.currentPromise.resolve();
   }

   //initialize game objects
   if (matcher) matcher.dispose(); //unbind events
   if (turnManager) turnManager.dispose(); //cancel the timer
   matcher = new MatchManager();
   if (stats) {
      stats.clearMeters();
   }
   stats = new Stats();
   turnManager = new TurnManager(visualGrid.logicalGrid, matcher, Config.EnableTimer ? TurnMode.Timed : TurnMode.Match);
   transitionManager = new TransitionManager(visualGrid.logicalGrid, visualGrid);
   sweeper = new Sweeper(Config.SweepMovesUp ? Config.SweepMaxRow : Config.SweepMinRow, visualGrid.logicalGrid.cols);
   
   game.add(visualGrid);
   game.add(sweeper);

   stats.drawScores();

   // hide game over
   document.getElementById("game-over").className = "";

   //add pieces to initial rows
   grid.seed(Config.NumStartingRows);
   if (!muted) {
      playLoop();
   }
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

 
});

var gameOverWidget = new UIWidget();
//var postYourScore = new ex.Actor(gameOverWidget.widget.x + gameOverWidget.widget.getWidth() / 2, gameOverWidget.widget.y + 100, 200, 100, ex.Color.Blue);
//gameOverWidget.addButton(postYourScore);


function hasClass(element, cls) {
   return element.classList.contains(cls);
}

function replaceClass(element, search, replace) {
   if (hasClass(element, search)) {
      this.removeClass(element, search);
      this.addClass(element, replace);
   }
}

function addClass(element, cls) {
   element.classList.add(cls);
}

function removeClass(element, cls) {
   element.classList.remove(cls);
}


function setVolume(volume: number) {
   for (var r in Resources) {
      if (Resources[r] instanceof ex.Sound) {
         Resources[r].setVolume(volume);
      }
   }
}

function playLoop() {
   setVolume(1);
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

function muteAll() {
   Resources.LoopSound.stop();
   Resources.ChallengeLoopSound.stop();
   setVolume(0);
}

document.getElementById("sound").addEventListener('click', function () {
   if (hasClass(this, 'fa-volume-up')) {
      replaceClass(this, 'fa-volume-up', 'fa-volume-off');
      muted = true;
      muteAll();
   } else {
      replaceClass(this, 'fa-volume-off', 'fa-volume-up');
      muted = false;
      playLoop();
   }
});

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
   var timeElapsed = Math.round(turnManager.getTime()/1000/60);
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

   document.getElementById("game-over").className = "show";

   //var color = new ex.Color(ex.Color.DarkGray.r, ex.Color.DarkGray.g, ex.Color.DarkGray.b, 0.3);
   //var gameOverWidgetActor = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() - 800, 300, 300, color);
   //game.addChild(gameOverWidgetActor);
   //gameOverWidgetActor.moveTo(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 1000);

   //game.addChild(gameOverWidget.widget);
   ////gameOverWidget.widget.moveTo(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 1000);
   ////gameOverWidget.moveWidget(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2, 50);

   ////TODO buttons fade in once widget is in place? perhaps button actors are invisible, and the sprite for the widget has the buttons on it
   //var postScoreButton = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2 - 50, 250, 50, ex.Color.Blue);
   //gameOverWidget.addButton(postScoreButton);

   //var playAgainButton = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() / 2 + 50, 250, 50, ex.Color.Green);
   //gameOverWidget.addButton(playAgainButton);


}

// TODO clean up pieces that are not in play anymore after update loop

game.start(loader).then(() => {
   playLoop();
});