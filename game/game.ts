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
/// <reference path="background.ts"/>
/// <reference path="Effects.ts"/>
/// <reference path="nomoves.ts"/>
/// <reference path="mask.ts"/>
/// <reference path="sound.ts"/>

var game = new ex.Engine(0, 0, "game", ex.DisplayMode.FullScreen);
var gameScale = new ex.Point(1, 1);
var gameMode = GameMode.Standard;
var loader = new ex.Loader();

// transparent bg
game.backgroundColor = ex.Color.Transparent;

// load up all resources in dictionary
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});

// init sound
SoundManager.init();

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

document.getElementById("how-to-play").addEventListener("click", () => {
   if (gameMode === GameMode.Standard) {
      MainMenu.ShowNormalTutorial();
   } else {
      MainMenu.ShowChallengeTutorial();
   }
});

document.getElementById("play-again").addEventListener('click', () => {
   if (gameMode == GameMode.Standard) {
      MainMenu.LoadStandardMode();
   } else if (gameMode == GameMode.Timed) {
      MainMenu.LoadChallengeMode();
   }
});
document.getElementById("challenge").addEventListener('click', () => {
   if (gameMode == GameMode.Standard) {
      MainMenu.LoadChallengeMode();
   } else if (gameMode == GameMode.Timed) {
      MainMenu.LoadStandardMode();
   }
});

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
   removeClass(document.getElementById("game-over"), "show");

   //add pieces to initial rows
   grid.seed(Config.NumStartingRows);

   // start sound
   SoundManager.startLoop();   
}

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


function gameOver() {

   if (gameMode == GameMode.Standard) {
      document.getElementById("challenge").innerHTML = "Try Challenge Mode";
   } else if (gameMode == GameMode.Timed) {
      document.getElementById("challenge").innerHTML = "Try Standard Mode";
   }

   var enduranceBonus = stats.calculateEnduranceBonus();
   var totalScore = stats.getFinalScore();
   var longestChain = stats.getLongestChain();
   var turnsTaken = stats.getTurnNumber();
   var timeElapsed = Math.round(turnManager.getTime()/1000/60);
   var analytics = (<any>window).ga;
   if (analytics) {
      analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'total score', { 'eventValue': totalScore});
      analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'longest chain', { 'eventValue': longestChain });
      if (gameMode == GameMode.Standard) {
         analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'turns taken', { 'eventValue': turnsTaken });
      } else if (gameMode == GameMode.Timed) {
         analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'time elapsed', { 'eventValue': timeElapsed });
      }
   }

   SoundManager.playGameOver();

   if (turnManager) turnManager.dispose(); // stop game over from happening infinitely in time attack

   addClass(document.getElementById("game-over"), "show");


   document.getElementById("game-over-swept").innerHTML = stats.getTotalPiecesSwept().toString();

   document.getElementById("game-over-chain").innerHTML = stats.getTotalChainBonus().toString();   

   document.getElementById("game-over-multiplier").innerHTML = (stats.getFinalScore() - enduranceBonus - stats.getTotalChainBonus() - stats.getTotalPiecesSwept()).toString();

   document.getElementById("game-over-time").innerHTML = enduranceBonus.toString();

   document.getElementById("game-over-total").innerHTML = stats.getFinalScore().toString();

   // I'm so sorry, I'm so very sorry...so tired
   try {
      var text = document.getElementById("twidget").dataset['text'];
      document.getElementById("twidget").dataset['text'] = text.replace("SOCIAL_SCORE", stats.getFinalScore()).replace("SOCIAL_MODE", gameMode === GameMode.Timed ? "challenge mode" : "standard mode");
      var twitterScript = <HTMLScriptElement>document.createElement('script');
      twitterScript.innerText = "!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + '://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); } } (document, 'script', 'twitter-wjs');";
      document.getElementById("game-over").appendChild(twitterScript);


      var social = document.getElementById('social-container');
      var facebookW = document.getElementById('fidget');
      facebookW.parentNode.removeChild(facebookW);
      social.appendChild(facebookW);
   } catch (e) {
      ex.Logger.getInstance().warn("Twitter failed", e);      
   }
}

// TODO clean up pieces that are not in play anymore after update loop

game.start(loader).then(() => {
   
   // set game scale
   var defaultGridHeight = Config.CellHeight * Config.GridCellsHigh;
   
   // scale based on height of viewport
   // target 85% height
   var scale = defaultGridHeight / game.getHeight();
   var scaleDiff = 0.85 - scale;

   ex.Logger.getInstance().info("Current viewport scale", scale);

   gameScale.setTo(1 + scaleDiff, 1 + scaleDiff);

   InitSetup();
});