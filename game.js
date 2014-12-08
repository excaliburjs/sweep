var Util = (function () {
    function Util() {
    }
    Util.darken = function (color, amount) {
        var r = Math.floor(color.r - (color.r * amount));
        var g = Math.floor(color.g - (color.g * amount));
        var b = Math.floor(color.b - (color.b * amount));
        return new ex.Color(r, g, b, color.a);
    };
    Util.lighten = function (color, amount) {
        if (color.a <= 0)
            return color;
        var c = Spectra({ r: color.r, g: color.g, b: color.b, a: color.a });
        var newColor = c.lighten(amount * 100);
        return new ex.Color(newColor.red(), newColor.green(), newColor.blue(), newColor.alpha());
    };
    Util.saturate = function (color, amount) {
        if (color.a <= 0)
            return color;
        var c = Spectra({ r: color.r, g: color.g, b: color.b, a: color.a });
        var newColor = c.saturate(amount * 100);
        return new ex.Color(newColor.red(), newColor.green(), newColor.blue(), newColor.alpha());
    };
    Util.getColorOfPixel = function (imageData, x, y) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixels = imageData.data;
        return new ex.Color(pixels[firstPixel + 0], pixels[firstPixel + 1], pixels[firstPixel + 2], pixels[firstPixel + 3]);
    };
    Util.setPixelToColor = function (imageData, x, y, color) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        pixel[firstPixel + 0] = color.r;
        pixel[firstPixel + 1] = color.g;
        pixel[firstPixel + 2] = color.b;
        pixel[firstPixel + 3] = ex.Util.clamp(Math.floor(color.a * 255), 0, 255);
    };
    return Util;
})();
var LightenEffect = (function () {
    function LightenEffect(amount) {
        this.amount = amount;
    }
    LightenEffect.prototype.updatePixel = function (x, y, imageData) {
        var pixelColor = Util.getColorOfPixel(imageData, x, y);
        var lightenedColor = Util.lighten(pixelColor, this.amount);
        Util.setPixelToColor(imageData, x, y, lightenedColor);
    };
    return LightenEffect;
})();
var SaturateEffect = (function () {
    function SaturateEffect(amount) {
        this.amount = amount;
    }
    SaturateEffect.prototype.updatePixel = function (x, y, imageData) {
        var pixelColor = Util.getColorOfPixel(imageData, x, y);
        var lightenedColor = Util.saturate(pixelColor, this.amount);
        Util.setPixelToColor(imageData, x, y, lightenedColor);
    };
    return SaturateEffect;
})();
var GameMode;
(function (GameMode) {
    GameMode[GameMode["Standard"] = 0] = "Standard";
    GameMode[GameMode["Timed"] = 1] = "Timed";
})(GameMode || (GameMode = {}));
var Config = (function () {
    function Config() {
    }
    //
    // cascade configs
    //
    Config.resetDefault = function () {
        Config.EnableTimer = false;
        Config.AdvanceRowsOnMatch = true;
        Config.SweepThreshold = 4;
        Config.EnableSweepMeters = true;
        Config.EnableSingleTapClear = false;
        Config.ClearSweepMetersAfterSingleUse = true;
        Config.EnableSweeper = false;
        Config.SweepMovesUp = false;
        Config.SweepMinRow = 3;
        Config.SweepMaxRow = Config.GridCellsHigh - 6;
        Config.SweepAltThreshold = 20;
        Config.SweepAltThresholdDelta = 5;
        Config.SweepAltMinThreshold = 10;
        Config.SweepAltMaxThreshold = 50;
    };
    Config.loadCasual = function () {
        gameMode = 0 /* Standard */;
        // same as default, for now
        document.getElementById("instructions").innerHTML = "Take your time and prevent the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " + "If things get hairy, <strong>press 1-4</strong> to choose a color to SWEEP and remove them from the board. Be careful, though, all other " + "meters will be depleted after each use.";
    };
    Config.loadSurvival = function () {
        Config.EnableTimer = true;
        Config.AdvanceRowsOnMatch = false;
        Config.TimerValue = 1000;
        Config.EnableSingleTapClear = true;
        Config.EnableSweepMeters = false;
        Config.EnableSweeper = true;
        Config.SweepMovesUp = false;
        Config.SweepMinRow = 3;
        Config.SweepMaxRow = Config.GridCellsHigh - 6;
        Config.SweepAltThreshold = 20;
        Config.SweepAltThresholdDelta = 5;
        Config.SweepAltMinThreshold = 10;
        Config.SweepAltMaxThreshold = 50;
        document.getElementById("instructions").innerHTML = "Battle against the clock and stop the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " + "If things get hairy, press <strong>S</strong> to SWEEP everything above the sweeper line! Each time the sweeper will move " + "down. As time goes on, it'll cost less to earn a SWEEP so play wisely.";
    };
    Config.loadSurvivalReverse = function () {
        gameMode = 1 /* Timed */;
        Config.EnableTimer = true;
        Config.AdvanceRowsOnMatch = false;
        Config.TimerValue = 1500;
        Config.EnableSingleTapClear = true;
        Config.EnableSweepMeters = false;
        Config.EnableSweeper = true;
        Config.SweepMovesUp = true;
        Config.SweepMinRow = 3;
        Config.SweepMaxRow = Config.GridCellsHigh - 2;
        Config.SweepAltThreshold = 50;
        Config.SweepAltThresholdDelta = 5;
        Config.SweepAltMinThreshold = 10;
        Config.SweepAltMaxThreshold = 50;
        document.getElementById("instructions").innerHTML = "Battle against the clock and stop the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " + "If things get hairy, press <strong>S</strong> to SWEEP everything above the sweeper line! Each time the sweeper will move up. " + "As time goes on, it'll cost more to earn a SWEEP so play wisely.";
    };
    Config.gameWidth = 720;
    Config.gameHeight = 720;
    Config.PieceContainsPadding = 5;
    Config.PieceWidth = 36;
    Config.PieceHeight = 36;
    Config.CellWidth = 45;
    Config.CellHeight = 45;
    Config.GridCellsHigh = 12;
    Config.GridCellsWide = 6;
    Config.NumStartingRows = 3;
    Config.ScoreXBuffer = 20;
    Config.MeterWidth = 90;
    Config.MeterHeight = 30;
    Config.EnableGridLines = false;
    Config.PolylineThickness = 5;
    Config.MainMenuButtonWidth = 185;
    Config.MainMenuButtonHeight = 62;
    Config.SweepShakeDuration = 400;
    Config.MegaSweepShakeDuration = 500;
    return Config;
})();
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
    TextureChallengeBtn: new ex.Texture("images/challenge.png")
};
var Palette = {
    GameBackgroundColor: ex.Color.fromHex("#efefef"),
    GridBackgroundColor: new ex.Color(0, 20, 25, 0.9),
    // Beach
    PieceColor1: ex.Color.fromHex("#DBB96D"),
    PieceColor2: ex.Color.fromHex("#BF6D72"),
    PieceColor3: ex.Color.fromHex("#5096F2"),
    PieceColor4: ex.Color.fromHex("#9979E0"),
    PolylineColor: ex.Color.fromHex("#F48347"),
    PolylineBorderColor: new ex.Color(255, 255, 255, 0.7)
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PieceType;
(function (PieceType) {
    PieceType[PieceType["Circle"] = 0] = "Circle";
    PieceType[PieceType["Triangle"] = 1] = "Triangle";
    PieceType[PieceType["Square"] = 2] = "Square";
    PieceType[PieceType["Star"] = 3] = "Star";
})(PieceType || (PieceType = {}));
var PieceTypes = [0 /* Circle */, 2 /* Square */, 1 /* Triangle */, 3 /* Star */];
var PieceTypeToColor = [Palette.PieceColor1, Palette.PieceColor2, Palette.PieceColor3, Palette.PieceColor4];
var PieceTypeToTexture = [Resources.TextureTile2, Resources.TextureTile1, Resources.TextureTile3, Resources.TextureTile4];
var PieceEvent = (function (_super) {
    __extends(PieceEvent, _super);
    function PieceEvent(cell) {
        _super.call(this);
        this.cell = cell;
    }
    return PieceEvent;
})(ex.GameEvent);
var Piece = (function (_super) {
    __extends(Piece, _super);
    function Piece(id, x, y, color, type) {
        _super.call(this, x, y, Config.PieceWidth, Config.PieceHeight, color);
        this.cell = null;
        this.selected = false;
        this.hover = false;
        this._id = id;
        this._type = type || 0 /* Circle */;
        this._originalColor = color;
    }
    Piece.prototype.getId = function () {
        return this._id;
    };
    Piece.prototype.getType = function () {
        return this._type;
    };
    Piece.prototype.setType = function (type) {
        this._type = type;
        this._updateDrawings();
    };
    Piece.prototype._updateDrawings = function () {
        var tileSprite = new ex.Sprite(PieceTypeToTexture[this._type], 0, 0, Config.PieceWidth, Config.PieceHeight);
        this.addDrawing("default", tileSprite);
        var highlightSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight);
        this.addDrawing("highlight", highlightSprite);
        var fadedSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight);
        this.addDrawing("faded", fadedSprite);
    };
    Piece.prototype.onInitialize = function (engine) {
        this._updateDrawings();
    };
    Piece.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (matcher.runInProgress && (!this.selected && this.getType() !== matcher.getRunType())) {
            this.setDrawing("faded");
        }
        else if (this.selected) {
            this.setDrawing("highlight");
        }
        else {
            this.setDrawing("default");
        }
    };
    return Piece;
})(ex.Actor);
var PieceFactory = (function () {
    function PieceFactory() {
    }
    PieceFactory.getRandomPiece = function () {
        var index = Math.floor(Math.random() * PieceTypes.length);
        var piece = new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[index].clone(), index);
        game.add(piece);
        return piece;
    };
    PieceFactory.getPiece = function (type) {
        var piece = new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[type].clone(), type);
        game.add(piece);
        return piece;
    };
    PieceFactory._maxId = 0;
    return PieceFactory;
})();
var Cell = (function () {
    function Cell(x, y, piece, logicalGrid) {
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.logicalGrid = logicalGrid;
    }
    Cell.prototype.getNeighbors = function () {
        var result = [];
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (this.logicalGrid.getCell(this.x + i, this.y + j) && this.logicalGrid.getCell(this.x + i, this.y + j) !== this) {
                    result.push(this.logicalGrid.getCell(this.x + i, this.y + j));
                }
            }
        }
        return result;
    };
    Cell.prototype.getAbove = function () {
        return this.logicalGrid.getCell(this.x, this.y - 1);
    };
    Cell.prototype.getBelow = function () {
        return this.logicalGrid.getCell(this.x, this.y + 1);
    };
    Cell.prototype.getCenter = function () {
        return new ex.Point(this.x * Config.CellWidth + Config.CellWidth / 2, this.y * Config.CellHeight + Config.CellHeight / 2);
    };
    return Cell;
})();
var LogicalGrid = (function (_super) {
    __extends(LogicalGrid, _super);
    function LogicalGrid(rows, cols) {
        _super.call(this);
        this.rows = rows;
        this.cols = cols;
        this.cells = [];
        this.cells = new Array(rows * cols);
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.cells[i + j * this.cols] = new Cell(i, j, null, this);
            }
        }
    }
    LogicalGrid.prototype.getRow = function (row) {
        var result = [];
        for (var i = 0; i < this.cols; i++) {
            result.push(this.getCell(i, row));
        }
        return result;
    };
    LogicalGrid.prototype.getColumn = function (col) {
        var result = [];
        for (var i = 0; i < this.cols; i++) {
            result.push(this.getCell(col, i));
        }
        return result;
    };
    LogicalGrid.prototype.getCell = function (x, y) {
        if (x < 0 || x >= this.cols)
            return null;
        if (y < 0 || y >= this.rows)
            return null;
        return this.cells[(x + y * this.cols)];
    };
    LogicalGrid.prototype.setCell = function (x, y, data, movePiece) {
        if (movePiece === void 0) { movePiece = true; }
        var cell = this.getCell(x, y);
        if (!cell)
            return;
        if (data) {
            var center = cell.getCenter();
            if (movePiece) {
                //data.moveTo(center.x, center.y, 200).asPromise().then(() => {
                data.x = center.x;
                data.y = center.y;
            }
            data.cell = cell;
            cell.piece = data;
            this.eventDispatcher.publish("pieceadd", new PieceEvent(cell));
        }
        else {
            this.eventDispatcher.publish("pieceremove", new PieceEvent(cell));
            cell.piece = null;
        }
        return cell;
    };
    LogicalGrid.prototype.clearPiece = function (piece) {
        if (piece && piece.cell) {
            piece.cell.piece = null;
            piece.cell = null;
            piece.kill();
        }
    };
    /* private _getPieceGroupHelper(currentPiece: Piece, currentGroup: Piece[]) {
        var unexploredNeighbors = currentPiece.cell.getNeighbors().filter(c => {
           return c.piece && currentGroup.indexOf(c.piece) === -1 && c.piece.getType() === currentPiece.getType();
        }).map(c => c.piece);
        currentGroup = currentGroup.concat(unexploredNeighbors);
        if (unexploredNeighbors.length === 0) {
           return currentGroup;
        } else {
           for (var i = 0; i < unexploredNeighbors.length; i++) {
              this._getPieceGroupHelper(unexploredNeighbors[i], currentGroup);
           }
           return currentGroup;
        }
     }*/
    LogicalGrid.prototype.getAdjacentPieceGroup = function (piece) {
        var currentGroup = [piece];
        function _getPieceGroupHelper(currentPiece) {
            var unexploredNeighbors = currentPiece.cell.getNeighbors().filter(function (c) {
                return c.piece && currentGroup.indexOf(c.piece) === -1 && c.piece.getType() === currentPiece.getType();
            }).map(function (c) { return c.piece; });
            currentGroup = currentGroup.concat(unexploredNeighbors);
            if (unexploredNeighbors.length === 0) {
                return;
            }
            else {
                for (var i = 0; i < unexploredNeighbors.length; i++) {
                    _getPieceGroupHelper(unexploredNeighbors[i]);
                }
            }
        }
        _getPieceGroupHelper(piece);
        return currentGroup;
    };
    LogicalGrid.prototype.getNumAvailablePieces = function () {
        var selectablePieces = [];
        for (var i = 0; i < this.cells.length; i++) {
            if (this.cells[i].piece) {
                if (selectablePieces.indexOf(this.cells[i].piece) !== -1) {
                    continue;
                }
                else {
                    var additions = this.getAdjacentPieceGroup(this.cells[i].piece);
                    if (additions.length >= 3) {
                        selectablePieces = selectablePieces.concat(additions);
                    }
                }
            }
        }
        return selectablePieces.length;
    };
    LogicalGrid.prototype.fill = function (row, smooth) {
        var _this = this;
        if (smooth === void 0) { smooth = false; }
        for (var i = 0; i < this.cols; i++) {
            (function () {
                var piece = PieceFactory.getRandomPiece();
                var cell = _this.getCell(i, row);
                piece.x = cell.getCenter().x;
                piece.y = mask.y + Config.CellHeight;
                var intendedCell = _this.setCell(i, row, piece, !smooth);
                var hasSameType = intendedCell.getNeighbors().some(function (c) {
                    if (c && c.piece) {
                        return c.piece.getType() === piece.getType();
                    }
                    return false;
                });
                if (hasSameType) {
                    _this.clearPiece(piece);
                    piece = PieceFactory.getRandomPiece();
                    piece.x = cell.getCenter().x;
                    piece.y = mask.y + Config.CellHeight;
                    _this.setCell(i, row, piece, !smooth);
                }
                if (smooth) {
                    piece.easeTo(cell.getCenter().x, cell.getCenter().y, 300, ex.EasingFunctions.EaseInOutCubic).asPromise().then(function () {
                        piece.x = cell.getCenter().x;
                        piece.y = cell.getCenter().y;
                    });
                }
            })();
        }
        mask.kill();
        game.add(mask);
    };
    LogicalGrid.prototype.shift = function (from, to) {
        var _this = this;
        if (to > this.rows)
            return;
        var promises = [];
        for (var i = 0; i < this.cols; i++) {
            if (to < 0) {
                var piece = this.getCell(i, from).piece;
                if (piece) {
                    this.clearPiece(piece);
                    //TODO add game over logic here
                    //TODO disable input (on board), add score card with play again button
                    matcher.gameOver = true;
                    var gameOverLabel = new ex.Label("GAME OVER", visualGrid.x + visualGrid.getWidth() + 30, visualGrid.y + visualGrid.getHeight() / 2);
                    game.currentScene.addChild(gameOverLabel);
                    gameOver();
                }
            }
            else if (this.getCell(i, from).piece) {
                (function () {
                    var p = _this.getCell(i, from).piece;
                    var dest = _this.getCell(i, to).getCenter();
                    promises.push(p.easeTo(dest.x, dest.y, 300, ex.EasingFunctions.EaseInOutCubic).asPromise());
                    _this.setCell(i, to, _this.getCell(i, from).piece, false);
                    _this.setCell(i, from, null);
                })();
            }
        }
        var agg = ex.Promise.join.apply(null, promises);
        if (promises.length) {
            return agg;
        }
        else {
            return ex.Promise.wrap(true);
        }
    };
    LogicalGrid.prototype.areNeighbors = function (cell1, cell2) {
        return cell1.getNeighbors().indexOf(cell2) > -1;
        /*
        // find neighbors of cell1
        var x = cell1.x,
           y = cell1.y,
           x2 = cell2.x,
           y2 = cell2.y,
           left = new ex.Point(x - 1, y),
           topLeft = new ex.Point(x - 1, y - 1),
           right = new ex.Point(x + 1, y),
           bottomRight = new ex.Point(x + 1, y + 1),
           top = new ex.Point(x, y - 1),
           topRight = new ex.Point(x + 1, y - 1),
           bottom = new ex.Point(x, y + 1),
           bottomLeft = new ex.Point(x - 1, y + 1);
  
        ex.Logger.getInstance().debug("LogicalGrid.areNeighbors", {
           cell1: cell1,
           cell2: cell2,
           forX: x,
           forY: y,
           otherX: x2,
           otherY: y2,
           left: left,
           topLeft: topLeft,
           right: right,
           topRight: topRight,
           bottom: bottom,
           bottomLeft: bottomLeft,
           bottomRight: bottomRight
        });
  
        return (x2 === left.x && y2 === left.y) ||
           (x2 === right.x && y2 === right.y) ||
           (x2 === top.x && y2 === top.y) ||
           (x2 === bottom.x && y2 === bottom.y) ||
           (x2 === topLeft.x && y2 === topLeft.y) ||
           (x2 === bottomRight.x && y2 === bottomRight.y) ||
           (x2 === topRight.x && y2 === topRight.y) ||
           (x2 === bottomLeft.x && y2 === bottomLeft.y);*/
    };
    return LogicalGrid;
})(ex.Class);
var VisualGrid = (function (_super) {
    __extends(VisualGrid, _super);
    function VisualGrid(logicalGrid) {
        _super.call(this, 0, 0, Config.CellWidth * logicalGrid.cols, Config.CellHeight * logicalGrid.rows);
        this.logicalGrid = logicalGrid;
        this.anchor.setTo(0, 0);
    }
    VisualGrid.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
    };
    VisualGrid.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        this.logicalGrid.cells.forEach(function (c) {
            ctx.fillStyle = Palette.GridBackgroundColor.toString();
            ctx.fillRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
            if (Config.EnableGridLines) {
                ctx.strokeStyle = Util.darken(Palette.GridBackgroundColor, 0.1);
                ctx.lineWidth = 1;
                ctx.strokeRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
            }
        });
    };
    VisualGrid.prototype.getCellByPos = function (screenX, screenY) {
        return _.find(this.logicalGrid.cells, function (cell) {
            return cell.piece && cell.piece.contains(screenX, screenY);
        });
    };
    return VisualGrid;
})(ex.Actor);
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this);
        this._show = false;
        this._showing = false;
        this.color = new ex.Color(0, 0, 0, 0.9);
    }
    MainMenu.prototype.onInitialize = function (engine) {
        this._logo = new ex.UIActor();
        this._logo.addDrawing(Resources.TextureLogo.asSprite());
        this._logo.currentDrawing.setScaleX(0.7);
        this._logo.currentDrawing.setScaleY(0.7);
        this._logo.currentDrawing.transformAboutPoint(new ex.Point(0.5, 0.5));
        this._standardButton = new MenuButton(Resources.TextureStandardBtn.asSprite(), MainMenu.LoadStandardMode, this.x, this.y + MainMenu._StandardButtonPos.y);
        this._challengeButton = new MenuButton(Resources.TextureChallengeBtn.asSprite(), MainMenu.LoadChallengeMode, this.x, this.y + MainMenu._ChallengeButtonPos.y);
        game.add(this._logo);
        game.add(this._standardButton);
        game.add(this._challengeButton);
        this.show();
    };
    MainMenu.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        var vgp = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.y));
        this.x = vgp.x;
        this.y = vgp.y;
        this.setWidth(visualGrid.getWidth());
        this.setHeight(visualGrid.getHeight());
        this._standardButton.x = this.x + MainMenu._StandardButtonPos.x;
        this._standardButton.y = this.y + MainMenu._StandardButtonPos.y;
        this._challengeButton.x = this.x + MainMenu._ChallengeButtonPos.x;
        this._challengeButton.y = this.y + MainMenu._ChallengeButtonPos.y;
        if (this._show) {
            this._show = false;
            this._showing = true;
            // ease out logo
            this._logo.x = this.getCenter().x;
            this._logo.y = -70;
            this._logo.easeTo(this.getCenter().x, this.y + MainMenu._LogoPos.y, 650, ex.EasingFunctions.EaseInOutQuad).callMethod(function () { return _this._showing = false; });
        }
        else if (!this._showing) {
            this._logo.x = this.getCenter().x;
            this._logo.y = this.y + MainMenu._LogoPos.y;
        }
    };
    MainMenu.prototype.show = function () {
        this.visible = true;
        this._logo.visible = true;
        this._standardButton.visible = true;
        this._standardButton.enableCapturePointer = true;
        this._challengeButton.visible = true;
        this._challengeButton.enableCapturePointer = true;
        this._show = true;
    };
    MainMenu.prototype.hide = function () {
        this.visible = false;
        this._logo.visible = false;
        this._standardButton.visible = false;
        this._standardButton.enableCapturePointer = false;
        this._challengeButton.visible = false;
        this._challengeButton.enableCapturePointer = false;
        this._show = false;
    };
    MainMenu.LoadStandardMode = function () {
        loadConfig(Config.loadCasual);
    };
    MainMenu.LoadChallengeMode = function () {
        loadConfig(Config.loadSurvivalReverse);
    };
    MainMenu._StandardButtonPos = new ex.Point(25, 200);
    MainMenu._ChallengeButtonPos = new ex.Point(25, 200 + Config.MainMenuButtonHeight + 20);
    MainMenu._LogoPos = new ex.Point(0, 50);
    return MainMenu;
})(ex.UIActor);
var MenuButton = (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(sprite, action, x, y) {
        _super.call(this, x, y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight);
        this.action = action;
        this.pipeline.push(new ex.CapturePointerModule());
        this.off("pointerup", action);
        this.on("pointerup", action);
        this.addDrawing(sprite);
    }
    return MenuButton;
})(ex.UIActor);
var MatchEvent = (function (_super) {
    __extends(MatchEvent, _super);
    function MatchEvent(run) {
        _super.call(this);
        this.run = run;
    }
    return MatchEvent;
})(ex.GameEvent);
var MatchManager = (function (_super) {
    __extends(MatchManager, _super);
    function MatchManager() {
        var _this = this;
        _super.call(this);
        this._notes = [
            Resources.ChallengeNote1Sound,
            Resources.ChallengeNote2Sound,
            Resources.ChallengeNote3Sound,
            Resources.ChallengeNote4Sound,
            Resources.ChallengeNote5Sound,
            Resources.ChallengeNote6Sound
        ];
        this._run = [];
        this.gameOver = false;
        this.dispose = function () {
            game.input.pointers.primary.off("down");
            game.input.pointers.primary.off("up");
            game.input.pointers.primary.off("move");
        };
        this.runInProgress = false;
        game.input.pointers.primary.on("down", _.bind(this._handlePointerDown, this));
        game.input.pointers.primary.on("up", _.bind(this._handlePointerUp, this));
        game.input.pointers.primary.on("move", _.bind(this._handlePointerMove, this));
        // handle canceling via right-click
        game.canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            _this._handleCancelRun();
        });
        window.addEventListener("contextmenu", function () { return _this._handleCancelRun(); });
        // HACK: Handle off-canvas mouseup to commit run
        window.addEventListener("mouseup", function (e) {
            if (e.button === 0 /* Left */) {
                _this._handlePointerUp(new ex.Input.PointerEvent(e.clientX, e.clientY, 0, 1 /* Mouse */, e.button, e));
            }
            else {
                _this._handleCancelRun();
            }
        });
    }
    MatchManager.prototype._playNote = function () {
        var index = ex.Util.randomIntInRange(0, this._notes.length - 1);
        this._notes[index].play();
    };
    MatchManager.prototype._handlePointerDown = function (pe) {
        if (!this.gameOver) {
            var cell = visualGrid.getCellByPos(pe.x, pe.y);
            if (!cell || this.runInProgress || !cell.piece) {
                return;
            }
            if (pe.pointerType === 1 /* Mouse */ && pe.button !== 0 /* Left */) {
                return;
            }
            if (!Config.EnableSingleTapClear) {
                this.runInProgress = true;
                cell.piece.selected = true;
                cell.piece.setCenterDrawing(true);
                cell.piece.scaleTo(1.3, 1.3, 1.8, 1.8).scaleTo(1, 1, 1.8, 1.8);
                this._run.push(cell.piece);
                this._playNote();
                ex.Logger.getInstance().info("Run started", this._run);
            }
            else {
                this._run = grid.getAdjacentPieceGroup(cell.piece);
                // notify
                this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));
                this._run.forEach(function (p) { return p.selected = false; });
                this._run.length = 0;
            }
        }
    };
    MatchManager.prototype._handlePointerMove = function (pe) {
        if (!this.gameOver) {
            // add piece to run if valid
            // draw line?
            if (!this.runInProgress)
                return;
            var cell = visualGrid.getCellByPos(pe.x, pe.y);
            if (!cell)
                return;
            var piece = cell.piece;
            if (!piece)
                return;
            piece.setCenterDrawing(true);
            if (!Config.EnableSingleTapClear) {
                var removePiece = -1;
                var containsBounds = new ex.BoundingBox(piece.getBounds().left + Config.PieceContainsPadding, piece.getBounds().top + Config.PieceContainsPadding, piece.getBounds().right - Config.PieceContainsPadding, piece.getBounds().bottom - Config.PieceContainsPadding);
                // if piece contains screen coords and we don't already have it in the run
                if (containsBounds.contains(new ex.Point(pe.x, pe.y)) && this._run.indexOf(piece) < 0) {
                    // if the two pieces aren't neighbors or aren't the same type, invalid move
                    if (this._run.length > 0 && (!this.areNeighbors(piece, this._run[this._run.length - 1]) || piece.getType() !== this._run[this._run.length - 1].getType()))
                        return;
                    // add to run
                    piece.selected = true;
                    this._run.push(piece);
                    this._playNote();
                    ex.Logger.getInstance().info("Run modified", this._run);
                    // notify
                    this.eventDispatcher.publish("run", new MatchEvent(_.clone(this._run)));
                    if (!piece.hover) {
                        piece.hover = true;
                        piece.scaleTo(1.2, 1.2, 1.2, 1.8);
                    }
                }
                else {
                    if (piece.hover) {
                        piece.hover = false;
                        piece.scaleTo(1, 1, 1.8, 1.8);
                    }
                }
                // did user go backwards?
                if (containsBounds.contains(new ex.Point(pe.x, pe.y)) && this._run.length > 1 && this._run.indexOf(piece) === this._run.length - 2) {
                    // mark for removal
                    removePiece = this._run.indexOf(piece) + 1;
                }
                if (removePiece > -1) {
                    // remove from run
                    this._run[removePiece].selected = false;
                    this._run.splice(removePiece, 1);
                    Resources.UndoSound.play();
                    ex.Logger.getInstance().info("Run modified", this._run);
                }
            }
            else {
            }
        }
    };
    MatchManager.prototype._handlePointerUp = function (pe) {
        if (!this.gameOver) {
            if (pe.pointerType === 1 /* Mouse */ && pe.button !== 0 /* Left */) {
                return;
            }
            // have a valid run?
            if (this._run.length > 0) {
                ex.Logger.getInstance().info("Run ended", this._run);
                // notify
                this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));
                this._run.forEach(function (p) { return p.selected = false; });
                this._run.length = 0;
            }
            this.runInProgress = false;
        }
        else {
            var point = new ex.Point(pe.x, pe.y);
            if (gameOverWidget.getBounds(0).contains(point)) {
                //TODO post your score
                console.log("POSTED YOUR SCORE");
            }
            else if (gameOverWidget.getBounds(1).contains(point)) {
                //TODO play again
                console.log("PLAY AGAIN");
                grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
                InitSetup();
            }
        }
    };
    MatchManager.prototype._handleCancelRun = function () {
        if (!this.gameOver) {
            this._run.forEach(function (p) { return p.selected = false; });
            this._run.length = 0;
            this.runInProgress = false;
        }
    };
    MatchManager.prototype.areNeighbors = function (piece1, piece2) {
        var cell1 = _.find(grid.cells, { piece: piece1 });
        var cell2 = _.find(grid.cells, { piece: piece2 });
        return grid.areNeighbors(cell1, cell2);
    };
    MatchManager.prototype.getRunType = function () {
        if (this._run.length === 0)
            return null;
        return this._run[0].getType();
    };
    MatchManager.prototype.getRun = function () {
        return _.clone(this._run);
    };
    return MatchManager;
})(ex.Class);
var PolyLine = (function (_super) {
    __extends(PolyLine, _super);
    function PolyLine() {
        _super.call(this);
    }
    PolyLine.prototype.draw = function (ctx, delta) {
        var run = matcher.getRun();
        if (!run.length || !matcher.runInProgress)
            return;
        this._drawLine(run, ctx, Config.PolylineThickness + 2, Palette.PolylineBorderColor);
        this._drawLine(run, ctx, Config.PolylineThickness, Palette.PolylineColor);
    };
    PolyLine.prototype._drawLine = function (run, ctx, thickness, color) {
        ctx.beginPath();
        ctx.strokeStyle = color.toString();
        ctx.lineWidth = thickness;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        run.forEach(function (p, i) {
            var center = game.worldToScreenCoordinates(p.getCenter());
            var target = center;
            if (i === 0) {
                ctx.moveTo(target.x, target.y);
            }
            else {
                ctx.lineTo(target.x, target.y);
            }
        });
        ctx.stroke();
        ctx.closePath();
    };
    return PolyLine;
})(ex.UIActor);
var TurnMode;
(function (TurnMode) {
    TurnMode[TurnMode["Timed"] = 0] = "Timed";
    TurnMode[TurnMode["Match"] = 1] = "Match";
})(TurnMode || (TurnMode = {}));
var TurnManager = (function () {
    function TurnManager(logicalGrid, matcher, turnMode) {
        this.logicalGrid = logicalGrid;
        this.matcher = matcher;
        this.turnMode = turnMode;
        this.currentPromise = ex.Promise.wrap(true);
        matcher.on('match', _.bind(this._handleMatchEvent, this));
        this._timer = new ex.Timer(_.bind(this._tick, this), Config.TimerValue, true);
        game.add(this._timer);
    }
    TurnManager.prototype.dispose = function () {
        this._timer.cancel();
    };
    TurnManager.prototype.getTime = function () {
        return this._timer.getTimeRunning();
    };
    TurnManager.prototype.advanceTurn = function (isMatch) {
        var _this = this;
        if (isMatch === void 0) { isMatch = false; }
        if (this.currentPromise && this.currentPromise.state() === 2 /* Pending */) {
            this.currentPromise.resolve();
        }
        stats.incrementTurnNumber();
        transitionManager.evaluate().then(function () {
            if (isMatch && Config.AdvanceRowsOnMatch) {
                _this.currentPromise = _this.advanceRows();
            }
            else if (!isMatch) {
                _this.currentPromise = _this.advanceRows();
            }
            console.log("Done!");
        });
    };
    TurnManager.prototype.advanceRows = function () {
        var promises = [];
        for (var i = 0; i < grid.rows; i++) {
            promises.push(this.logicalGrid.shift(i, i - 1));
        }
        this.logicalGrid.fill(grid.rows - 1, true);
        Resources.TapsSound.play();
        // fill first row
        promises = _.filter(promises, function (p) {
            return p;
        });
        return ex.Promise.join.apply(null, promises).then(function () {
            if (grid.getNumAvailablePieces() <= 0) {
                //reset the board if there are no legal moves
                sweeper.sweepAll(true);
            }
            //this.logicalGrid.fill(grid.rows - 1, true);
        }).error(function (e) {
            console.log(e);
        });
    };
    TurnManager.prototype._handleMatchEvent = function (evt) {
        var _this = this;
        if (evt.run.length >= 3) {
            this.currentPromise.then(function () {
                stats.scorePieces(evt.run);
                stats.scoreChain(evt.run);
                evt.run.forEach(function (p) {
                    effects.clearEffect(p);
                    grid.clearPiece(p);
                });
                Resources.MatchSound.play();
                _this.advanceTurn(true);
            });
        }
    };
    TurnManager.prototype._tick = function () {
        var _this = this;
        if (this.turnMode === 0 /* Timed */) {
            this.currentPromise.then(function () {
                _this.advanceRows();
            });
        }
        //ex.Logger.getInstance().info("Tick", new Date());
    };
    return TurnManager;
})();
/// <reference path="grid.ts"/>
var TransitionManager = (function () {
    function TransitionManager(logicalGrid, visualGrid) {
        this.logicalGrid = logicalGrid;
        this.visualGrid = visualGrid;
    }
    TransitionManager.prototype._findLanding = function (cell) {
        var landing = cell.getBelow();
        while (landing) {
            if (!landing.getBelow() || (!landing.piece && landing.getBelow().piece)) {
                break;
            }
            landing = landing.getBelow();
        }
        return landing;
    };
    TransitionManager.prototype._findFloaters = function (row) {
        return this.logicalGrid.getRow(row).filter(function (c) {
            return c.piece && c.getBelow() && c.getBelow().piece === null;
        });
    };
    TransitionManager.prototype.evaluate = function () {
        var _this = this;
        var currentRow = this.logicalGrid.rows;
        var promises = [];
        while (currentRow > 0) {
            currentRow--;
            this._findFloaters(currentRow).forEach(function (c) {
                var landingCell = _this._findLanding(c);
                if (landingCell) {
                    var piece = c.piece;
                    _this.logicalGrid.setCell(c.x, c.y, null);
                    _this.logicalGrid.setCell(landingCell.x, landingCell.y, piece, false);
                    var promise = piece.easeTo(landingCell.getCenter().x, landingCell.getCenter().y, 300, ex.EasingFunctions.EaseInOutCubic).asPromise();
                    promises.push(promise);
                }
            });
        }
        if (promises.length) {
            return ex.Promise.join.apply(null, promises);
        }
        else {
            return ex.Promise.wrap(true);
        }
    };
    return TransitionManager;
})();
var Stats = (function () {
    function Stats() {
        this._numCirclesDestroyed = 0;
        this._numTrianglesDestroyed = 0;
        this._numSquaresDestroyed = 0;
        this._numStarsDestroyed = 0;
        this._numCirclesDestroyedMeter = 0;
        this._numTrianglesDestroyedMeter = 0;
        this._numSquaresDestroyedMeter = 0;
        this._numStarsDestroyedMeter = 0;
        this._longestCircleCombo = 0;
        this._longestTriangleCombo = 0;
        this._longestSquareCombo = 0;
        this._longestStarCombo = 0;
        this._turnNumber = 0;
        this._types = [0 /* Circle */, 1 /* Triangle */, 2 /* Square */, 3 /* Star */];
        this._scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
        this._meters = [this._numCirclesDestroyedMeter, this._numTrianglesDestroyedMeter, this._numSquaresDestroyedMeter, this._numStarsDestroyedMeter];
        this._sweepMeter = 0;
        this._sweepMeterThreshold = 0;
        this._chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];
        this._lastChain = 0;
        this._sweepMeterThreshold = Config.SweepAltThreshold;
    }
    Stats.prototype.getTotalScore = function () {
        var totalScore = this._scores[0] + this._scores[1] + this._scores[2] + this._scores[3];
        return totalScore;
    };
    Stats.prototype.getLongestChain = function () {
        return Math.max.apply(Math, this._chains);
    };
    Stats.prototype.getTurnNumber = function () {
        return this._turnNumber;
    };
    Stats.prototype.incrementTurnNumber = function () {
        this._turnNumber++;
    };
    Stats.prototype.getMeter = function (pieceType) {
        return this._meters[this._types.indexOf(pieceType)];
    };
    Stats.prototype.resetMeter = function (pieceType) {
        this._meters[this._types.indexOf(pieceType)] = 0;
    };
    Stats.prototype.resetAllMeters = function () {
        for (var i = 0; i < this._meters.length; i++) {
            this._meters[i] = 0;
        }
    };
    Stats.prototype.allMetersFull = function () {
        return _.every(this._meters, function (m) { return m === Config.SweepThreshold; });
    };
    Stats.prototype.canSweep = function (type) {
        if (type === void 0) { type = null; }
        if (type !== null) {
            return this.getMeter(type) >= Config.SweepThreshold;
        }
        else {
            return this._sweepMeter === this._sweepMeterThreshold;
        }
    };
    Stats.prototype.resetSweeperMeter = function () {
        this._sweepMeter = 0;
        // if moving upwards, decrease threshold
        if (Config.SweepMovesUp) {
            this._sweepMeterThreshold = Math.max(Config.SweepAltMinThreshold, this._sweepMeterThreshold - Config.SweepAltThresholdDelta);
        }
        else {
            this._sweepMeterThreshold = Math.min(Config.SweepAltMaxThreshold, this._sweepMeterThreshold + Config.SweepAltThresholdDelta);
        }
    };
    Stats.prototype.increaseScoreMultiplier = function () {
        // todo
    };
    Stats.prototype.scorePieces = function (pieces) {
        var type = this._types.indexOf(pieces[0].getType());
        this._scores[type] += pieces.length;
        var newScore = this._meters[type] + pieces.length;
        this._meters[type] = Math.min(newScore, Config.SweepThreshold);
        this._sweepMeter = Math.min(this._sweepMeter + pieces.length, this._sweepMeterThreshold);
    };
    Stats.prototype.scoreChain = function (pieces) {
        var chainScore = this._chains[this._types.indexOf(pieces[0].getType())];
        this._lastChain = pieces.length;
        if (chainScore < pieces.length) {
            this._chains[this._types.indexOf(pieces[0].getType())] = pieces.length;
        }
    };
    Stats.prototype.drawScores = function () {
        var _this = this;
        var scoreXPos = visualGrid.x + visualGrid.getWidth() + Config.ScoreXBuffer;
        this._totalScore("total ", scoreXPos, 330);
        var yPos = 350;
        if (Config.EnableSweepMeters) {
            this._addMeter(0, scoreXPos, yPos);
            this._addMeter(1, scoreXPos, yPos += Config.MeterHeight + 5);
            this._addMeter(2, scoreXPos, yPos += Config.MeterHeight + 5);
            this._addMeter(3, scoreXPos, yPos += Config.MeterHeight + 5);
            this._addMegaSweep(scoreXPos, 350);
        }
        if (Config.EnableSweeper) {
            this._addSweepMeter(scoreXPos, sweeper.y);
        }
        this._addScore("chain ", this._chains, 0, scoreXPos, yPos += Config.MeterHeight + 20);
        this._addScore("chain ", this._chains, 1, scoreXPos, yPos += 20);
        this._addScore("chain ", this._chains, 2, scoreXPos, yPos += 20);
        this._addScore("chain ", this._chains, 3, scoreXPos, yPos += 20);
        var lastChainLabel = new ex.Label("last chain " + this._lastChain, scoreXPos, yPos += 30);
        game.addEventListener('update', function (data) {
            lastChainLabel.text = "last chain " + _this._lastChain;
        });
        game.currentScene.addChild(lastChainLabel);
    };
    Stats.prototype._addScore = function (description, statArray, statIndex, xPos, yPos) {
        var square = new ex.Actor(xPos, yPos, 15, 15, PieceTypeToColor[statIndex]);
        square.anchor.setTo(0, 0);
        var label = new ex.Label(null, xPos + 20, yPos + 8);
        label.anchor.setTo(0, 0);
        label.color = ex.Color.Black;
        game.addEventListener('update', function (data) {
            label.text = description + statArray[statIndex].toString();
        });
        game.add(label);
        game.add(square);
    };
    Stats.prototype._totalScore = function (description, xPos, yPos) {
        var _this = this;
        var totalScore = 0;
        var label = new ex.Label(description + totalScore.toString(), xPos, yPos);
        label.color = ex.Color.Black;
        game.addEventListener('update', function (data) {
            var totalScore = _this._scores[0] + _this._scores[1] + _this._scores[2] + _this._scores[3];
            label.text = description + totalScore.toString();
        });
        game.currentScene.addChild(label);
    };
    Stats.prototype._addMegaSweep = function (x, y) {
        var _this = this;
        var meter = new ex.Actor(x, y, Config.MeterWidth, Config.MeterHeight * 4, ex.Color.Orange);
        meter.enableCapturePointer = true;
        var label = new ex.Label("MEGA SWEEP", meter.getCenter().x, meter.getCenter().y);
        var inputLabel = new ex.Label("PRESS S", meter.getCenter().x, meter.getCenter().y + 14);
        label.textAlign = inputLabel.textAlign = 2 /* Center */;
        label.color = inputLabel.color = ex.Color.White;
        label.font = inputLabel.font = "14px";
        meter.anchor.setTo(0, 0);
        meter.on("pointerup", function () {
            sweeper.sweepAll();
        });
        game.addEventListener('update', function (data) {
            // mega sweep
            if (_this.allMetersFull()) {
                meter.visible = label.visible = inputLabel.visible = true;
            }
            else {
                meter.visible = label.visible = inputLabel.visible = false;
            }
        });
        game.add(meter);
        game.add(label);
        game.add(inputLabel);
    };
    Stats.prototype._addMeter = function (piece, x, y) {
        var _this = this;
        var meter = new Meter(x, y, PieceTypeToColor[piece], Config.SweepThreshold);
        meter.enableCapturePointer = true;
        var label = new ex.Label(null, meter.getCenter().x, meter.getCenter().y + 3);
        label.textAlign = 2 /* Center */;
        label.color = ex.Color.Black;
        meter.on("pointerup", function () {
            sweeper.sweep(piece);
        });
        game.addEventListener('update', function (data) {
            meter.score = _this._meters[piece];
            // mega sweep
            if (_this.allMetersFull()) {
                meter.visible = label.visible = false;
            }
            else {
                meter.visible = label.visible = true;
                if (_this._meters[piece] === Config.SweepThreshold) {
                    label.text = "Press " + (piece + 1) + " to SWEEP";
                }
                else {
                    label.text = _this._meters[piece].toString();
                }
            }
        });
        game.add(meter);
        game.add(label);
    };
    Stats.prototype._addSweepMeter = function (x, y) {
        var _this = this;
        var square = new Meter(x, y, ex.Color.Red, this._sweepMeterThreshold);
        square.enableCapturePointer = true;
        var label = new ex.Label(null, square.getCenter().x, y + 20);
        label.textAlign = 2 /* Center */;
        label.color = ex.Color.Black;
        square.on("pointerup", function () {
            sweeper.sweep();
        });
        game.addEventListener('update', function (data) {
            square.score = _this._sweepMeter;
            square.threshold = _this._sweepMeterThreshold;
            if (_this._sweepMeter === _this._sweepMeterThreshold) {
                label.text = "'S' TO SWEEP";
            }
            else {
                label.text = Math.floor((_this._sweepMeter / _this._sweepMeterThreshold) * 100) + '%';
            }
        });
        game.add(square);
        game.add(label);
    };
    return Stats;
})();
var Meter = (function (_super) {
    __extends(Meter, _super);
    function Meter(x, y, color, threshold) {
        _super.call(this, x, y, Config.MeterWidth, Config.MeterHeight, color);
        this.threshold = threshold;
        this.anchor.setTo(0, 0);
    }
    Meter.prototype.draw = function (ctx, delta) {
        var x = this.getBounds().left;
        var y = this.getBounds().top;
        ctx.strokeStyle = this.color.toString();
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.getWidth(), this.getHeight());
        var percentage = (this.score / this.threshold);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(x, y, (this.getWidth() * percentage), this.getHeight());
    };
    return Meter;
})(ex.Actor);
// alt sweep mechanic 1
var Sweeper = (function (_super) {
    __extends(Sweeper, _super);
    function Sweeper(startRow, gridCellsWide) {
        _super.call(this, 0, 0, Config.CellWidth * gridCellsWide, 2, ex.Color.Red);
        this._row = 0;
        this.anchor.setTo(0, 0);
        this.visible = false;
        this._row = startRow;
        this._label = new ex.Label("Sweeper");
        this._emitter = new ex.ParticleEmitter(0, 0, Config.CellWidth * Config.GridCellsWide, 2);
        this._emitter.emitterType = 1 /* Rectangle */;
        this._emitter.radius = 0;
        this._emitter.minVel = 13;
        this._emitter.maxVel = 137;
        this._emitter.minAngle = Math.PI;
        this._emitter.maxAngle = Math.PI;
        this._emitter.isEmitting = false;
        this._emitter.emitRate = 500;
        this._emitter.opacity = 0.9;
        this._emitter.fadeFlag = true;
        this._emitter.particleLife = 150;
        this._emitter.maxSize = 2;
        this._emitter.minSize = 1;
        this._emitter.startSize = 0;
        this._emitter.endSize = 0;
        this._emitter.acceleration = new ex.Vector(0, -955);
        this._emitter.beginColor = ex.Color.Red;
        this._emitter.endColor = ex.Color.Transparent;
        this._emitter.anchor.setTo(0, 1);
    }
    Sweeper.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        if (Config.EnableSweeper) {
            this._emitter.isEmitting = true;
            game.add(this._label);
            game.add(this._emitter);
        }
        this.y = visualGrid.y + (this._row * Config.CellHeight);
        game.input.keyboard.off("up", Sweeper._handleKeyDown);
        game.input.keyboard.on("up", Sweeper._handleKeyDown);
    };
    Sweeper._handleKeyDown = function (evt) {
        if (evt.key === 49)
            sweeper.sweep(0 /* Circle */);
        if (evt.key === 50)
            sweeper.sweep(1 /* Triangle */);
        if (evt.key === 51)
            sweeper.sweep(2 /* Square */);
        if (evt.key === 52)
            sweeper.sweep(3 /* Star */);
        // mega sweep
        if (!Config.EnableSweeper && evt.key === 83 /* S */)
            sweeper.sweepAll();
        // alt sweep
        if (Config.EnableSweeper && evt.key === 83 /* S */)
            sweeper.sweep();
    };
    Sweeper.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this.x = visualGrid.x;
        this._label.x = visualGrid.x - 50;
        this._label.y = this.y;
        this._emitter.x = visualGrid.x;
        this._emitter.y = this.y;
    };
    Sweeper.prototype.sweepAll = function (force) {
        if (force === void 0) { force = false; }
        if (matcher.gameOver)
            return;
        if (!stats.allMetersFull() && !force)
            return;
        game.currentScene.camera.shake(4, 4, Config.MegaSweepShakeDuration);
        var cells = grid.cells.filter(function (cell) {
            return !!cell.piece;
        });
        // todo mega animation!
        cells.forEach(function (cell) {
            // todo adjust mega sweep scoring?
            stats.scorePieces([cell.piece]);
            // clear
            grid.clearPiece(cell.piece);
        });
        // reset meter
        stats.resetAllMeters();
        // add combo multiplier
        stats.increaseScoreMultiplier();
        for (var i = 0; i < Config.NumStartingRows; i++) {
            grid.fill(grid.rows - (i + 1));
        }
        if (grid.getNumAvailablePieces() <= 0) {
            this.sweepAll(true);
        }
        Resources.MegaSweepSound.play();
    };
    Sweeper.prototype.sweep = function (type) {
        if (type === void 0) { type = null; }
        if (matcher.gameOver)
            return;
        if (type !== null) {
            // can sweep?
            if (!stats.canSweep(type))
                return;
            // don't allow individual sweeps if mega sweep is available
            // that shouldn't happen
            if (stats.allMetersFull())
                return;
            game.currentScene.camera.shake(4, 4, Config.SweepShakeDuration);
            var cells = grid.cells.filter(function (cell) {
                return cell.piece && cell.piece.getType() === type;
            });
            cells.forEach(function (cell) {
                stats.scorePieces([cell.piece]);
                grid.clearPiece(cell.piece);
            });
            // reset meter
            if (Config.ClearSweepMetersAfterSingleUse) {
                stats.resetAllMeters();
            }
            else {
                stats.resetMeter(type);
            }
            turnManager.advanceTurn();
        }
        else {
            if (!stats.canSweep())
                return;
            var cells = [];
            for (var i = 0; i < this._row; i++) {
                grid.getRow(i).filter(function (c) { return c.piece !== null; }).forEach(function (c) { return cells.push(c); });
            }
            if (cells.length <= 0)
                return;
            cells.forEach(function (cell) {
                stats.scorePieces([cell.piece]);
                grid.clearPiece(cell.piece);
            });
            // reset meter
            stats.resetSweeperMeter();
            // advance sweeper
            if (!Config.SweepMovesUp && this._row < Config.SweepMaxRow) {
                this._row++;
                this.moveBy(this.x, this.y + Config.CellHeight, 200);
            }
            else if (Config.SweepMovesUp && this._row > Config.SweepMinRow) {
                this._row--;
                this.moveBy(this.x, this.y - Config.CellHeight, 200);
            }
            turnManager.advanceTurn();
        }
        Resources.SweepSound.play();
    };
    return Sweeper;
})(ex.Actor);
var UIWidget = (function (_super) {
    __extends(UIWidget, _super);
    function UIWidget() {
        _super.call(this);
        this._buttons = new Array();
        var color = new ex.Color(ex.Color.DarkGray.r, ex.Color.DarkGray.g, ex.Color.DarkGray.b, 0.3);
        this.widget = new ex.Actor(visualGrid.x + visualGrid.getWidth() / 2, visualGrid.y + visualGrid.getHeight() + 500, 300, 300, color);
    }
    UIWidget.prototype.addButton = function (button) {
        this._buttons.push(button);
        game.addChild(button);
        //button.on(buttonType, 
    };
    UIWidget.prototype.getBounds = function (index) {
        var boundingBox = new ex.BoundingBox(this._buttons[index].getBounds().left, this._buttons[index].getBounds().top, this._buttons[index].getBounds().right, this._buttons[index].getBounds().bottom);
        return boundingBox;
    };
    UIWidget.prototype.moveWidget = function (x, y, speed) {
        this.widget.moveTo(x, y, speed);
        //for (var i = 0; i < this._buttons.length; i++) {
        //   this._buttons[i].moveTo(x, y, speed);
        //}
    };
    return UIWidget;
})(ex.Class);
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(corner, texture) {
        _super.call(this, corner.x, corner.y, game.getWidth() + texture.width, game.getHeight() + texture.height);
        this.corner = corner;
        this.texture = texture;
        this.addDrawing(texture);
    }
    Background.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.x < this.corner.x - this.texture.width || this.x > game.getWidth()) {
            this.x = this.corner.x;
            this.y = this.corner.y;
        }
        ;
        if (this.y < this.corner.y - this.texture.height || this.y > game.getHeight()) {
            this.x = this.corner.x;
            this.y = this.corner.y;
        }
    };
    Background.prototype.draw = function (ctx, delta) {
        for (var i = 0; i < Math.ceil(game.getWidth() / this.texture.width) + 5; i++) {
            if (this.dx <= 0) {
                this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y);
            }
            else {
                this.currentDrawing.draw(ctx, this.x - i * this.texture.width, this.y);
            }
            if (this.dy <= 0) {
                this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y + this.texture.height);
            }
            else {
                this.currentDrawing.draw(ctx, this.x + i * this.texture.width, this.y - this.texture.height);
            }
        }
    };
    return Background;
})(ex.Actor);
var Effects = (function () {
    function Effects() {
    }
    Effects.prototype.clearEffect = function (piece) {
        //TODO move emitter to Piece
        var emitter = new ex.ParticleEmitter(piece.x, piece.y, 1, 1);
        emitter.minVel = 30;
        emitter.maxVel = 125;
        emitter.minAngle = Math.PI / 4;
        emitter.maxAngle = (Math.PI * 3) / 4;
        emitter.isEmitting = false;
        emitter.emitRate = 5;
        emitter.opacity = 0.84;
        emitter.fadeFlag = true;
        emitter.particleLife = 1000;
        emitter.maxSize = 0.4;
        emitter.minSize = 0.2;
        emitter.acceleration = new ex.Vector(0, -500);
        emitter.beginColor = ex.Color.Red;
        emitter.endColor = ex.Color.Yellow;
        emitter.startSize = 0.5;
        emitter.endSize = 0.01;
        emitter.particleSprite = piece.currentDrawing.clone();
        emitter.particleSprite.transformAboutPoint(new ex.Point(.5, .5));
        emitter.particleRotationalVelocity = Math.PI / 10;
        emitter.randomRotation = true;
        emitter.fadeFlag = true;
        emitter.focus = new ex.Vector(0, emitter.y - 1000); // relative to the emitter
        emitter.focusAccel = 900;
        game.addChild(emitter);
        emitter.emit(5);
    };
    return Effects;
})();
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
var _this = this;
var game = new ex.Engine(Config.gameWidth, Config.gameHeight, "game", 0 /* FullScreen */);
game.backgroundColor = ex.Color.Transparent;
var gameMode = 0 /* Standard */;
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// game objects
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
// var mainMenu = new MainMenu();
//game.add(mainMenu);
var visualGrid, turnManager, matcher, transitionManager, sweeper, stats, mask, polyline, background, effects;
// game modes
var loadConfig = function (config) {
    Config.resetDefault();
    config.call(_this);
    InitSetup();
};
document.getElementById("loadCasual").addEventListener("mouseup", function () { return loadConfig(Config.loadCasual); });
document.getElementById("loadSurvial").addEventListener("mouseup", function () { return loadConfig(Config.loadSurvival); });
document.getElementById("loadSurvivalReverse").addEventListener("mouseup", function () { return loadConfig(Config.loadSurvivalReverse); });
loadConfig(Config.loadCasual);
InitSetup();
//reset the game with the given grid dimensions
function InitSetup() {
    visualGrid = new VisualGrid(grid);
    effects = new Effects();
    var i;
    if (game.currentScene.children) {
        for (i = 0; i < game.currentScene.children.length; i++) {
            game.removeChild(game.currentScene.children[i]);
        }
    }
    game.currentScene.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);
    var leftCorner = game.screenToWorldCoordinates(new ex.Point(0, 0));
    background = new Background(leftCorner, Resources.BackgroundTexture);
    background.dy = -10;
    game.add(background);
    //initialize game objects
    if (matcher)
        matcher.dispose(); //unbind events
    if (turnManager)
        turnManager.dispose(); //cancel the timer
    matcher = new MatchManager();
    polyline = new PolyLine();
    stats = new Stats();
    turnManager = new TurnManager(visualGrid.logicalGrid, matcher, Config.EnableTimer ? 0 /* Timed */ : 1 /* Match */);
    transitionManager = new TransitionManager(visualGrid.logicalGrid, visualGrid);
    sweeper = new Sweeper(Config.SweepMovesUp ? Config.SweepMaxRow : Config.SweepMinRow, visualGrid.logicalGrid.cols);
    mask = new ex.Actor(0, Config.GridCellsHigh * Config.CellHeight + 5, visualGrid.logicalGrid.cols * Config.CellWidth, Config.CellHeight * 2, Palette.GameBackgroundColor.clone());
    mask.anchor.setTo(0, 0);
    stats.drawScores();
    game.add(visualGrid);
    game.add(sweeper);
    game.add(polyline);
    game.add(mask);
    for (i = 0; i < Config.NumStartingRows; i++) {
        grid.fill(grid.rows - (i + 1));
    }
    playLoop();
}
game.input.keyboard.on('up', function (evt) {
    if (evt.key === 68 /* D */) {
        game.isDebug = !game.isDebug;
    }
    if (evt.key === 85 /* U */) {
        for (var i = 0; i < grid.rows; i++) {
            grid.shift(i, i - 1);
        }
        // fill first row
        grid.fill(grid.rows - 1);
    }
    if (evt.key === 38 /* Up */ || evt.key == 40 /* Down */ || evt.key === 37 /* Left */ || evt.key === 39 /* Right */) {
        var numCols = grid.cols || 0;
        var numRows = grid.rows || 0;
        if (evt.key === 38 /* Up */) {
            numRows++;
        }
        else if (evt.key === 40 /* Down */) {
            numRows--;
        }
        else if (evt.key === 37 /* Left */) {
            numCols--;
        }
        else if (evt.key === 39 /* Right */) {
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
    if (gameMode === 0 /* Standard */) {
        Resources.KnockSound.setVolume(.5);
        Resources.TapsSound.setVolume(.2);
        Resources.SweepSound.setVolume(.4);
        Resources.MegaSweepSound.setVolume(.4);
        Resources.LoopSound.setLoop(true);
        Resources.LoopSound.play();
    }
    else {
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
    var timeElapsed = turnManager.getTime() / 1000 / 60;
    var analytics = window.ga;
    if (analytics) {
        analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'total score', { 'eventValue': totalScore, 'nonInteraction': 1 });
        analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'longest chain', { 'eventValue': longestChain, 'nonInteraction': 1 });
        if (gameMode == 0 /* Standard */) {
            analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'turns taken', { 'eventValue': turnsTaken, 'nonInteraction': 1 });
        }
        else if (gameMode == 1 /* Timed */) {
            analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'time elapsed', { 'eventValue': timeElapsed, 'nonInteraction': 1 });
        }
    }
    playGameOver();
    if (turnManager)
        turnManager.dispose(); // stop game over from happening infinitely in time attack
    var color = new ex.Color(ex.Color.DarkGray.r, ex.Color.DarkGray.g, ex.Color.DarkGray.b, 0.3);
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
game.start(loader).then(function () {
    playLoop();
});
//# sourceMappingURL=game.js.map