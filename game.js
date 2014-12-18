/// <reference path="../scripts/typings/Spectra.d.ts"/>
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
        Config.SweepThreshold = 18;
        Config.EnableSweepMeters = false;
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
        Config.EnableSweepMeters = true;
        Config.EnableLevels = false;
        Config.SweepScoreMultiplierIncreasesPerLevel = false;
    };
    /**
     * @obsolete
     */
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
    };
    Config.PieceContainsPadding = 2;
    Config.PieceWidth = 36;
    Config.PieceHeight = 36;
    Config.CellWidth = 45;
    Config.CellHeight = 45;
    Config.GridY = -10;
    Config.GridCellsHigh = 11;
    Config.GridCellsWide = 6;
    Config.NumStartingRows = 3;
    Config.ScoreXBuffer = 20;
    Config.MeterWidth = 45;
    Config.MeterHeight = 27;
    Config.MeterMargin = 8;
    Config.MeterRadius = 12;
    Config.MeterBorderThickness = 3;
    Config.EnableGridLines = false;
    Config.PolylineThickness = 5;
    Config.MainMenuButtonWidth = 185;
    Config.MainMenuButtonHeight = 62;
    Config.StatsScoresMargin = 8;
    Config.ScoreTopFontSize = 24;
    Config.ScoreBonusFontSize = 18;
    Config.ScoreTopDescSize = 14;
    Config.LevelFontSize = 275;
    Config.LevelYOffset = -210;
    // easings
    Config.PieceEasingFillDuration = 300;
    Config.LevelMultiplierEndBonus = 1.05;
    Config.SweepScoreMultiplier = 2;
    Config.ChainThresholdSmall = 8;
    Config.ChainThresholdMedium = 11;
    Config.ChainThresholdLarge = 15;
    Config.ChainBonusSmall = 5;
    Config.ChainBonusMedium = 10;
    Config.ChainBonusLarge = 25;
    Config.ChainBonusSuper = 50;
    // endurance score multiplier
    Config.StandardModeMultiplier = 10;
    Config.TimedModeMultiplier = 10;
    Config.SweepShakeDuration = 400;
    Config.MegaSweepShakeDuration = 500;
    Config.MegaSweepDelay = 600;
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
var PieceTypeToTexture = [Resources.TextureTile1, Resources.TextureTile2, Resources.TextureTile3, Resources.TextureTile4];
var PieceTypeToSprites = [
    [new ex.Sprite(PieceTypeToTexture[0], 0, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[0], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[0], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight)],
    [new ex.Sprite(PieceTypeToTexture[1], 0, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[1], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[1], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight)],
    [new ex.Sprite(PieceTypeToTexture[2], 0, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[2], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[2], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight)],
    [new ex.Sprite(PieceTypeToTexture[3], 0, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[3], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight), new ex.Sprite(PieceTypeToTexture[3], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight)]
];
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
        this._updateDrawings();
        this.scale.setTo(gameScale.x, gameScale.y);
        this.calculatedAnchor = new ex.Point(Config.PieceWidth / 2 * this.scale.x, Config.PieceHeight / 2 * this.scale.y);
        this.setCenterDrawing(true);
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
        //var tileSprite = new ex.Sprite(PieceTypeToTexture[this._type], 0, 0, Config.PieceWidth, Config.PieceHeight);
        //this.addDrawing("default", tileSprite);
        this.addDrawing("default", PieceTypeToSprites[this._type][0]);
        //var highlightSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight);
        //this.addDrawing("highlight", highlightSprite);
        this.addDrawing("highlight", PieceTypeToSprites[this._type][1]);
        //var fadedSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight);
        //this.addDrawing("faded", fadedSprite);
        this.addDrawing("faded", PieceTypeToSprites[this._type][2]);
        this.setDrawing("default");
    };
    Piece.prototype.onInitialize = function (engine) {
        this._updateDrawings();
    };
    Piece.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        //console.log("piece pos", this.x, this.y, this);
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
    Piece.prototype.dispose = function () {
    };
    return Piece;
})(ex.Actor);
var PieceFactory = (function () {
    function PieceFactory() {
    }
    PieceFactory.getRandomPiece = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var index = Math.floor(Math.random() * PieceTypes.length);
        var piece = new Piece(PieceFactory._maxId++, x, y, PieceTypeToColor[index], index);
        game.add(piece);
        return piece;
    };
    PieceFactory.getPiece = function (type) {
        var piece = new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[type], type);
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
        var cw = Config.CellWidth * gameScale.x;
        var ch = Config.CellHeight * gameScale.y;
        return new ex.Point(this.x * cw + (cw / 2) + visualGrid.x, this.y * ch + (ch / 2) + visualGrid.y);
    };
    return Cell;
})();
var LogicalGrid = (function (_super) {
    __extends(LogicalGrid, _super);
    function LogicalGrid(rows, cols) {
        _super.call(this);
        this.rows = rows;
        this.cols = cols;
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
            piece.visible = false;
            piece.cell.piece = null;
            piece.cell = null;
            piece.kill();
            piece.dispose();
        }
    };
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
    LogicalGrid.prototype.getPieces = function () {
        return this.cells.filter(function (c) { return c.piece !== null; }).map(function (c) { return c.piece; });
    };
    LogicalGrid.prototype.fill = function (row, smooth, delay) {
        var _this = this;
        if (smooth === void 0) { smooth = false; }
        if (delay === void 0) { delay = 0; }
        for (var i = 0; i < this.cols; i++) {
            (function () {
                var cell = _this.getCell(i, row);
                var piece = PieceFactory.getRandomPiece(cell.getCenter().x, visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2));
                //piece.y = visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2);
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
                    piece.y = visualGrid.y + visualGrid.getHeight() + (Config.CellHeight / 2);
                    _this.setCell(i, row, piece, !smooth);
                }
                if (smooth) {
                    piece.delay(delay).easeTo(cell.getCenter().x, cell.getCenter().y, Config.PieceEasingFillDuration, ex.EasingFunctions.EaseInOutCubic).asPromise().then(function () {
                        piece.x = cell.getCenter().x;
                        piece.y = cell.getCenter().y;
                    });
                }
            })();
        }
    };
    LogicalGrid.prototype.seed = function (rows, smooth, delay) {
        var _this = this;
        if (smooth === void 0) { smooth = false; }
        if (delay === void 0) { delay = 0; }
        for (var i = 0; i < rows; i++) {
            grid.fill(grid.rows - (i + 1), smooth, delay);
        }
        if (this.getNumAvailablePieces() < 2) {
            this.getPieces().forEach(function (p) { return _this.clearPiece(p); });
            // DANGER WILL ROBINSON DANGER DANGER!
            this.seed(rows, smooth, delay);
        }
    };
    LogicalGrid.prototype.shift = function (from, to) {
        var _this = this;
        if (to > this.rows)
            ex.Promise.wrap(true);
        var promises = [];
        for (var i = 0; i < this.cols; i++) {
            if (to < 0) {
                var piece = this.getCell(i, from).piece;
                if (piece) {
                    this.clearPiece(piece);
                    if (!matcher.gameOver) {
                        matcher.gameOver = true;
                        gameOver();
                    }
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
    };
    return LogicalGrid;
})(ex.Class);
var VisualGrid = (function (_super) {
    __extends(VisualGrid, _super);
    function VisualGrid(logicalGrid) {
        _super.call(this, 0, Config.GridY, Config.CellWidth * logicalGrid.cols, Config.CellHeight * logicalGrid.rows);
        this.logicalGrid = logicalGrid;
        this.anchor.setTo(0, 0);
        this.scale.setTo(gameScale.x, gameScale.y);
    }
    VisualGrid.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this.scale.setTo(gameScale.x, gameScale.y);
    };
    VisualGrid.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        ctx.fillStyle = Palette.GridBackgroundColor.toString();
        ctx.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
    };
    VisualGrid.prototype.getCellByPos = function (screenX, screenY) {
        return _.find(this.logicalGrid.cells, function (cell) {
            return cell.piece && cell.piece.contains(screenX, screenY);
        });
    };
    return VisualGrid;
})(ex.Actor);
/// <reference path="../scripts/typings/Cookies.d.ts"/>
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this);
        this._show = false;
        this._showing = false;
        this._hide = false;
        this._hiding = false;
        this.color = new ex.Color(0, 0, 0, 0.9);
    }
    MainMenu.prototype.onInitialize = function (engine) {
        var _this = this;
        _super.prototype.onInitialize.call(this, engine);
        this._logo = new ex.UIActor();
        this._logo.addDrawing(Resources.TextureLogo.asSprite());
        this._logo.currentDrawing.setScaleX(0.7 * gameScale.x);
        this._logo.currentDrawing.setScaleY(0.7 * gameScale.y);
        this._logo.currentDrawing.transformAboutPoint(new ex.Point(0.5, 0.5));
        this._standardButton = new MenuButton(Resources.TextureStandardBtn.asSprite(), MainMenu.LoadStandardMode, this.x, this.y + MainMenu._StandardButtonPos.y);
        this._challengeButton = new MenuButton(Resources.TextureChallengeBtn.asSprite(), MainMenu.LoadChallengeMode, this.x, this.y + MainMenu._ChallengeButtonPos.y);
        game.add(this._logo);
        game.add(this._standardButton);
        game.add(this._challengeButton);
        document.getElementById("dismiss-normal-modal").addEventListener("click", _.bind(this._dismissNormalTutorial, this));
        document.getElementById("dismiss-challenge-modal").addEventListener("click", _.bind(this._dismissChallengeTutorial, this));
        var tutNormalIdx = 0;
        var tutChallengeIdx = 0;
        document.getElementById("tutorial-normal-next").addEventListener("click", function (e) {
            e.preventDefault();
            var slides = document.querySelectorAll("#tutorial-normal .slide");
            if (slides.length <= 0)
                return;
            if (slides.length === (tutNormalIdx + 1)) {
                tutNormalIdx = 0;
                document.getElementById("tutorial-normal-next").innerHTML = "Next";
                _this._dismissNormalTutorial();
                return;
            }
            if (slides.length - 1 === tutNormalIdx + 1) {
                document.getElementById("tutorial-normal-next").innerHTML = "Got it!";
            }
            else {
                document.getElementById("tutorial-normal-next").innerHTML = "Next";
            }
            tutNormalIdx = (tutNormalIdx + 1) % slides.length;
            for (var i = 0; i < slides.length; i++) {
                slides[i].classList.add("hide");
            }
            slides[tutNormalIdx].classList.remove("hide");
            return;
        });
        document.getElementById("tutorial-challenge-next").addEventListener("click", function (e) {
            e.preventDefault();
            var slides = document.querySelectorAll("#tutorial-challenge .slide");
            if (slides.length <= 0)
                return;
            if (slides.length === (tutChallengeIdx + 1)) {
                tutChallengeIdx = 0;
                document.getElementById("tutorial-challenge-next").innerHTML = "Next";
                _this._dismissChallengeTutorial();
                return;
            }
            if (slides.length - 1 === tutChallengeIdx + 1) {
                document.getElementById("tutorial-challenge-next").innerHTML = "Got it!";
            }
            else {
                document.getElementById("tutorial-challenge-next").innerHTML = "Next";
            }
            tutChallengeIdx = (tutChallengeIdx + 1) % slides.length;
            for (var i = 0; i < slides.length; i++) {
                slides[i].classList.add("hide");
            }
            slides[tutChallengeIdx].classList.remove("hide");
            return;
        });
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
        this._standardButton.x = this.getCenter().x - (this._standardButton.getWidth() / 2);
        this._standardButton.y = this.y + MainMenu._StandardButtonPos.y * this._standardButton.scale.y;
        this._challengeButton.x = this.getCenter().x - (this._challengeButton.getWidth() / 2);
        this._challengeButton.y = this.y + MainMenu._ChallengeButtonPos.y * this._challengeButton.scale.y;
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
        if (this._hide) {
        }
    };
    MainMenu.prototype.show = function () {
        matcher.inMainMenu = true;
        this.visible = true;
        this._logo.visible = true;
        this._standardButton.visible = true;
        this._standardButton.enableCapturePointer = true;
        this._challengeButton.visible = true;
        this._challengeButton.enableCapturePointer = true;
        this._show = true;
        this._hide = false;
    };
    MainMenu.prototype.hide = function () {
        matcher.inMainMenu = false;
        this.visible = false;
        this._logo.visible = false;
        this._standardButton.visible = false;
        this._standardButton.enableCapturePointer = false;
        this._challengeButton.visible = false;
        this._challengeButton.enableCapturePointer = false;
        this._show = false;
        this._hide = true;
    };
    MainMenu.prototype._dismissNormalTutorial = function () {
        removeClass(document.getElementById("tutorial-normal"), "show");
        MainMenu._markTutorialAsDone(0 /* Standard */);
        if (MainMenu._LoadAfterTutorial) {
            MainMenu._LoadAfterTutorial = false;
            MainMenu.LoadStandardMode(true);
            return;
        }
        if (gameMode !== 0 /* Standard */)
            MainMenu.LoadStandardMode(true);
    };
    MainMenu.prototype._dismissChallengeTutorial = function () {
        removeClass(document.getElementById("tutorial-challenge"), "show");
        MainMenu._markTutorialAsDone(1 /* Timed */);
        if (MainMenu._LoadAfterTutorial) {
            MainMenu._LoadAfterTutorial = false;
            MainMenu.LoadChallengeMode(true);
            return;
        }
        if (gameMode !== 1 /* Timed */)
            MainMenu.LoadChallengeMode(true);
    };
    MainMenu._markTutorialAsDone = function (gameMode) {
        Cookies.set("ld-31-tutorial-" + gameMode, "1", { expires: new Date(2020, 0, 1) });
    };
    MainMenu._hasFinishedTutorial = function (gameMode) {
        var c = Cookies.get("ld-31-tutorial-" + gameMode);
        ex.Logger.getInstance().info("Retrieved tutorial cookie: tutorial-" + gameMode, c);
        return c && c === "1";
    };
    MainMenu.ShowNormalTutorial = function () {
        // play normal tutorial
        removeClass(document.getElementById("game-over"), "show");
        addClass(document.getElementById("tutorial-normal"), "show");
    };
    MainMenu.ShowChallengeTutorial = function () {
        removeClass(document.getElementById("game-over"), "show");
        addClass(document.getElementById("tutorial-challenge"), "show");
    };
    // todo move loadConfig logic to here so we can manage state better?
    MainMenu.LoadStandardMode = function (skipTutorialCheck) {
        if (skipTutorialCheck === void 0) { skipTutorialCheck = false; }
        ex.Logger.getInstance().info("Loading standard mode");
        skipTutorialCheck = (typeof skipTutorialCheck === "boolean" && skipTutorialCheck);
        if (!skipTutorialCheck && !MainMenu._hasFinishedTutorial(0 /* Standard */)) {
            MainMenu._LoadAfterTutorial = true;
            MainMenu.ShowNormalTutorial();
        }
        else {
            loadConfig(Config.loadCasual);
            mainMenu.hide();
        }
    };
    MainMenu.LoadChallengeMode = function (skipTutorial) {
        if (skipTutorial === void 0) { skipTutorial = false; }
        ex.Logger.getInstance().info("Loading challenge mode");
        skipTutorial = (typeof skipTutorial === "boolean" && skipTutorial);
        if (!skipTutorial && !MainMenu._hasFinishedTutorial(1 /* Timed */)) {
            MainMenu._LoadAfterTutorial = true;
            MainMenu.ShowChallengeTutorial();
        }
        else {
            loadConfig(Config.loadSurvivalReverse);
            mainMenu.hide();
        }
    };
    MainMenu._StandardButtonPos = new ex.Point(42, 170);
    MainMenu._ChallengeButtonPos = new ex.Point(42, 170 + Config.MainMenuButtonHeight + 20);
    MainMenu._LogoPos = new ex.Point(0, 50);
    MainMenu._LoadAfterTutorial = false;
    return MainMenu;
})(ex.UIActor);
var MenuButton = (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(sprite, action, x, y) {
        _super.call(this, x, y, Config.MainMenuButtonWidth, Config.MainMenuButtonHeight);
        this.action = action;
        this.scale.setTo(ex.Util.clamp(gameScale.x, 0, 1), ex.Util.clamp(gameScale.y, 0, 1));
        //this.setCenterDrawing(true);
        this.addDrawing(sprite);
        this.off("pointerup", this.action);
        this.on("pointerup", this.action);
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
        this.inMainMenu = true;
        this.preventOtherPointerUp = false;
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
        if (!this.gameOver && !this.inMainMenu) {
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
                cell.piece.scaleTo(gameScale.x * 1.3, gameScale.y * 1.3, 1.8, 1.8).scaleTo(gameScale.x, gameScale.y, 1.8, 1.8);
                this._run.push(cell.piece);
                this._playNote();
                ex.Logger.getInstance().debug("Run started", this._run);
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
        if (!this.gameOver && !this.inMainMenu) {
            // add piece to run if valid
            // draw line?
            if (!this.runInProgress)
                return;
            var cell = visualGrid.getCellByPos(pe.x, pe.y);
            //run is in progress but we are not a cell. If we mouse up at this point we only
            //want the run to end and nothing else to happen
            if (!cell) {
                this.preventOtherPointerUp = true;
                return;
            }
            var piece = cell.piece;
            if (!piece)
                return;
            piece.setCenterDrawing(true);
            if (!Config.EnableSingleTapClear) {
                var removePiece = -1;
                var containsBounds = new ex.BoundingBox(piece.getBounds().left + Config.PieceContainsPadding, piece.getBounds().top + Config.PieceContainsPadding, piece.getBounds().right - Config.PieceContainsPadding, piece.getBounds().bottom - Config.PieceContainsPadding);
                // if piece contains screen coords and we don't already have it in the run
                if (containsBounds.contains(new ex.Point(pe.x, pe.y)) && !piece.selected) {
                    // if the two pieces aren't neighbors or aren't the same type, invalid move
                    if (this._run.length > 0 && (!this.areNeighbors(piece, this._run[this._run.length - 1]) || piece.getType() !== this._run[this._run.length - 1].getType()))
                        return;
                    // add to run
                    piece.selected = true;
                    this._run.push(piece);
                    this._playNote();
                    ex.Logger.getInstance().debug("Run modified", this._run);
                    // notify
                    this.eventDispatcher.publish("run", new MatchEvent(_.clone(this._run)));
                    if (!piece.hover) {
                        piece.hover = true;
                        piece.scaleTo(gameScale.x * 1.2, gameScale.y * 1.2, 1.2, 1.8);
                    }
                }
                else {
                    if (piece.hover) {
                        piece.hover = false;
                        piece.scaleTo(gameScale.x, gameScale.y, 1.8, 1.8);
                    }
                    //if piece is already in the run, and is not the most recently selected piece, user went backwards
                    var priorPieceIdx = this._run.indexOf(piece);
                    if (priorPieceIdx != -1 && this._run.length > 1 && priorPieceIdx != (this._run.length - 1)) {
                        //remove all pieces in front of this piece from run
                        var numToRemove = (this._run.length) - priorPieceIdx - 1;
                        for (var i = 0; i < numToRemove; i++) {
                            this._run[this._run.length - 1 - i].selected = false;
                        }
                        this._run.splice(priorPieceIdx + 1, numToRemove);
                        Resources.UndoSound.play();
                        ex.Logger.getInstance().debug("Run modified", this._run);
                    }
                }
            }
            else {
            }
        }
    };
    MatchManager.prototype._handlePointerUp = function (pe) {
        if (!this.gameOver && !this.inMainMenu) {
            if (pe.pointerType === 1 /* Mouse */ && pe.button !== 0 /* Left */) {
                return;
            }
            // have a valid run?
            if (this._run.length > 0) {
                ex.Logger.getInstance().debug("Run ended", this._run);
                // notify
                this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));
                this._run.forEach(function (p) { return p.selected = false; });
                this._run.length = 0;
            }
            this.runInProgress = false;
        }
    };
    MatchManager.prototype._handleCancelRun = function () {
        if (!this.gameOver && !this.inMainMenu) {
            Resources.UndoSound.play();
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
        });
    };
    TurnManager.prototype.advanceRows = function () {
        var _this = this;
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
            if (gameMode == 0 /* Standard */) {
                if (grid.getNumAvailablePieces() <= 0) {
                    //reset the board if there are no legal moves
                    //debugger;
                    //sweeper.sweepAll(true);
                    grid.getPieces().forEach(function (p) {
                        effects.clearEffect(p);
                        grid.clearPiece(p);
                    });
                    noMoves.play().then(function () {
                        _this.logicalGrid.seed(Config.NumStartingRows, true);
                    });
                }
            }
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
        this._level = 1;
        this._circleMultiplier = 1;
        this._triangleMultiplier = 1;
        this._squareMultiplier = 1;
        this._starMultiplier = 1;
        this._multipliers = [this._circleMultiplier, this._triangleMultiplier, this._squareMultiplier, this._starMultiplier];
        this._types = [0 /* Circle */, 1 /* Triangle */, 2 /* Square */, 3 /* Star */];
        this._scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
        this._meters = [this._numCirclesDestroyedMeter, this._numTrianglesDestroyedMeter, this._numSquaresDestroyedMeter, this._numStarsDestroyedMeter];
        this._sweepMeter = 0;
        this._sweepMeterThreshold = 0;
        this._chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];
        this._lastChain = 0;
        this._lastChainBonus = 0;
        this._totalChainBonus = 0;
        this._totalPiecesSwept = 0;
        this._finalScore = 0;
        this._sweepMeterThreshold = Config.SweepAltThreshold;
        this._meterActors = new Array();
        this._meterLabels = new Array();
    }
    Stats.prototype.getTotalScore = function () {
        var totalScore = this._scores[0] + this._scores[1] + this._scores[2] + this._scores[3];
        return totalScore;
    };
    Stats.prototype.getTotalPiecesSwept = function () {
        return this._totalPiecesSwept;
    };
    Stats.prototype.getTotalChainBonus = function () {
        return this._totalChainBonus;
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
        Config.EnableLevels && this.allMetersFull() && this._level++;
        var i;
        for (i = 0; i < this._meters.length; i++) {
            this._meters[i] = 0;
        }
        for (i = 0; i < this._multipliers.length; i++) {
            this._multipliers[i] = Config.EnableLevels && Config.SweepScoreMultiplierIncreasesPerLevel ? this._level : 1;
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
        for (var i = 0; i < this._multipliers.length; i++) {
            this._multipliers[i] = 1;
        }
        // if moving upwards, decrease threshold
        if (Config.SweepMovesUp) {
            this._sweepMeterThreshold = Math.max(Config.SweepAltMinThreshold, this._sweepMeterThreshold - Config.SweepAltThresholdDelta);
        }
        else {
            this._sweepMeterThreshold = Math.min(Config.SweepAltMaxThreshold, this._sweepMeterThreshold + Config.SweepAltThresholdDelta);
        }
    };
    Stats.prototype.scorePieces = function (pieces) {
        var type = this._types.indexOf(pieces[0].getType());
        this._totalPiecesSwept += pieces.length;
        var newScore = this._meters[type] + pieces.length;
        this._meters[type] = Math.min(newScore, Config.SweepThreshold);
        this._sweepMeter = Math.min(this._sweepMeter + pieces.length, this._sweepMeterThreshold);
        this._scores[type] += this.scoreMultiplier(pieces.length + this.chainBonus(pieces), type);
    };
    Stats.prototype.scoreMultiplier = function (currentScore, type) {
        var modifiedScore = currentScore;
        if (this._meters[type] == Config.SweepThreshold) {
            this._multipliers[type] = Config.EnableLevels && Config.SweepScoreMultiplierIncreasesPerLevel ? this._level + 1 : Config.SweepScoreMultiplier;
            modifiedScore = currentScore * Config.SweepScoreMultiplier;
        }
        return modifiedScore;
    };
    Stats.prototype.calculateEnduranceBonus = function () {
        var enduranceMultiplier = 0;
        if (gameMode == 0 /* Standard */) {
            enduranceMultiplier = this._turnNumber * Config.StandardModeMultiplier;
            this._finalScore = this.getTotalScore() + enduranceMultiplier;
        }
        else if (gameMode == 1 /* Timed */) {
            enduranceMultiplier = Math.round(turnManager.getTime() / 1000 / 60) * Config.TimedModeMultiplier;
            this._finalScore = this.getTotalScore() + enduranceMultiplier;
        }
        return enduranceMultiplier;
    };
    Stats.prototype.calculateLevelBonus = function () {
        var levelMultiplier = Config.LevelMultiplierEndBonus;
        if (Config.EnableLevels) {
            var modifiedScore = Math.floor(this._finalScore * levelMultiplier * Math.log(this._level + 2));
            var diff = modifiedScore - this._finalScore;
            this._finalScore = modifiedScore;
            return diff.toString();
        }
        return "0";
    };
    Stats.prototype.getFinalScore = function () {
        return this._finalScore;
    };
    Stats.prototype.chainBonus = function (pieces) {
        var chain = pieces.length;
        var bonus = 0;
        if (chain > 3) {
            if (chain < Config.ChainThresholdSmall) {
                bonus = Config.ChainBonusSmall;
            }
            else if (chain < Config.ChainThresholdMedium) {
                bonus = Config.ChainBonusMedium;
            }
            else if (chain < Config.ChainThresholdLarge) {
                bonus = Config.ChainBonusLarge;
            }
            else {
                bonus = Config.ChainBonusSuper;
            }
        }
        this._lastChainBonus = bonus;
        this._totalChainBonus += bonus;
        return bonus;
    };
    Stats.prototype.scoreChain = function (pieces) {
        var chainScore = this._chains[this._types.indexOf(pieces[0].getType())];
        this._lastChain = pieces.length;
        if (chainScore < pieces.length) {
            this._chains[this._types.indexOf(pieces[0].getType())] = pieces.length;
        }
    };
    Stats.prototype.getMultipliers = function () {
        return this._multipliers;
    };
    Stats.prototype.drawScores = function () {
        this._addTotalScore();
        if (gameMode === 0 /* Standard */) {
            this._addMultipliers();
            this._addWaves();
        }
        if (Config.EnableLevels) {
            this._addLevel();
        }
        if (Config.EnableSweepMeters) {
            this._addMeters();
            this._addMegaSweep();
        }
        if (Config.EnableSweeper) {
            this._addSweepMeter();
        }
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
    Stats.prototype._addTotalScore = function () {
        var _this = this;
        var totalScore = 0;
        var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
        var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
        var margin = Config.StatsScoresMargin * gameScale.x;
        var scoreLabel = new ex.Label(totalScore.toString(), visualGrid.x + margin, visualGrid.y + margin, scoreFontSize.toString() + "px museo-sans, arial");
        var scoreDescLabel = new ex.Label("score", visualGrid.x + margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize.toString() + "px museo-sans, arial");
        scoreLabel.color = scoreDescLabel.color = ex.Color.White.clone();
        scoreLabel.opacity = 0.6;
        scoreDescLabel.opacity = 0.2;
        scoreLabel.baseAlign = scoreDescLabel.baseAlign = 0 /* Top */;
        game.addEventListener('update', function (data) {
            margin = Config.StatsScoresMargin * gameScale.x;
            scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
            scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
            scoreLabel.x = visualGrid.x + margin;
            scoreLabel.y = visualGrid.y + margin;
            scoreDescLabel.x = visualGrid.x + margin;
            scoreDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
            scoreLabel.font = scoreFontSize.toString() + "px museo-sans, arial";
            scoreDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";
            scoreLabel.text = _this.getTotalScore().toString();
        });
        game.add(scoreLabel);
        game.add(scoreDescLabel);
    };
    Stats.prototype._addWaves = function () {
        var _this = this;
        var centerOffset = -12;
        var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
        var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
        var margin = Config.StatsScoresMargin * gameScale.x;
        var waveLabel = new ex.Label(this._turnNumber.toString(), visualGrid.getCenter().x, visualGrid.y + margin, scoreFontSize.toString() + "px museo-sans, arial");
        var waveDescLabel = new ex.Label("wave", visualGrid.getCenter().x + margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize.toString() + "px museo-sans, arial");
        waveLabel.color = waveDescLabel.color = ex.Color.White.clone();
        waveLabel.opacity = 0.6;
        waveDescLabel.opacity = 0.2;
        waveLabel.baseAlign = waveDescLabel.baseAlign = 0 /* Top */;
        waveLabel.textAlign = waveDescLabel.textAlign = 2 /* Center */;
        game.addEventListener('update', function (data) {
            margin = Config.StatsScoresMargin * gameScale.x;
            scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
            scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
            waveLabel.x = visualGrid.getCenter().x;
            waveLabel.y = visualGrid.y + margin;
            waveLabel.font = scoreFontSize.toString() + "px museo-sans, arial";
            waveDescLabel.x = visualGrid.getCenter().x;
            waveDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
            waveDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";
            waveLabel.text = _this._turnNumber.toString().toString();
        });
        game.add(waveLabel);
        game.add(waveDescLabel);
    };
    Stats.prototype._addMultipliers = function () {
        var _this = this;
        var margin = Config.StatsScoresMargin * gameScale.x;
        var bonusFontSize = Config.ScoreBonusFontSize * gameScale.x;
        var scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
        var scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
        var bonusLabels = [], i, j, bonusLabel;
        var bonusMargin = (bonusFontSize * 1.1);
        for (i = 0, j = this._multipliers.length - 1; i < this._multipliers.length; i++, j--) {
            bonusLabel = new ex.Label(this._turnNumber.toString(), visualGrid.getRight() - margin - (j * bonusMargin), visualGrid.y + margin, bonusFontSize + "px museo-sans, arial");
            bonusLabel.color = PieceTypeToColor[i].clone();
            bonusLabel.opacity = 0.6;
            bonusLabel.baseAlign = 0 /* Top */;
            bonusLabel.textAlign = 1 /* Right */;
            bonusLabels.push(bonusLabel);
            game.add(bonusLabel);
        }
        var bonusDescLabel = new ex.Label("bonuses", visualGrid.getRight() - margin, visualGrid.y + (scoreFontSize * 1.1) + margin, scoreDescSize + "px museo-sans, arial");
        bonusDescLabel.color = ex.Color.White.clone();
        bonusDescLabel.opacity = 0.2;
        bonusDescLabel.baseAlign = 0 /* Top */;
        bonusDescLabel.textAlign = 1 /* Right */;
        game.addEventListener('update', function (data) {
            margin = Config.StatsScoresMargin * gameScale.x;
            bonusFontSize = Config.ScoreBonusFontSize * gameScale.x;
            scoreFontSize = Config.ScoreTopFontSize * gameScale.x;
            scoreDescSize = Config.ScoreTopDescSize * gameScale.x;
            bonusMargin = (bonusFontSize * 1.1);
            bonusDescLabel.x = visualGrid.getRight() - margin;
            bonusDescLabel.y = visualGrid.y + margin + (scoreFontSize * 1.1);
            bonusDescLabel.font = scoreDescSize.toString() + "px museo-sans, arial";
            for (i = 0, j = _this._multipliers.length - 1; i < _this._multipliers.length; i++, j--) {
                bonusLabel = bonusLabels[i];
                bonusLabel.x = visualGrid.getRight() - margin - (j * bonusMargin);
                bonusLabel.y = visualGrid.y + margin;
                bonusLabel.text = _this._multipliers[i].toString() + "x";
                if (_this._multipliers[i] <= 1) {
                    bonusLabel.opacity = 0.2;
                    bonusLabel.font = bonusFontSize + "px museo-sans, arial";
                }
                else {
                    bonusLabel.opacity = 0.6;
                    bonusLabel.font = "normal normal 700 " + bonusFontSize + "px museo-sans, arial";
                }
            }
        });
        game.add(bonusDescLabel);
    };
    Stats.prototype._addLevel = function () {
        var _this = this;
        var offset = Config.LevelYOffset * gameScale.y;
        var levelFontSize = Config.LevelFontSize * gameScale.x;
        var levelLabel = new ex.Label(this._level.toString(), visualGrid.getCenter().x, visualGrid.getCenter().y + offset, "normal normal 700 " + levelFontSize.toString() + "px museo-sans, arial");
        levelLabel.color = ex.Color.White.clone();
        levelLabel.opacity = 0.1;
        levelLabel.baseAlign = 0 /* Top */;
        levelLabel.textAlign = 2 /* Center */;
        game.addEventListener('update', function (data) {
            offset = Config.LevelYOffset * gameScale.y;
            levelFontSize = Config.LevelFontSize * gameScale.x;
            levelLabel.x = visualGrid.getCenter().x;
            levelLabel.y = visualGrid.getCenter().y + offset;
            levelLabel.font = "normal normal 700 " + levelFontSize.toString() + "px museo-sans, arial";
            levelLabel.text = _this._level.toString();
        });
        game.add(levelLabel);
    };
    Stats.prototype._addMegaSweep = function () {
        var _this = this;
        // todo sprite animation
        var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
        var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
        var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;
        var meter = new Meter(meterXPos, meterYPos, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, 1, Config.EnableLevels ? Resources.TextureMegaSweepIndicator : Resources.TextureSweepIndicator, false);
        meter.score = 1;
        meter.enableCapturePointer = true;
        meter.anchor.setTo(0, 0);
        meter.on("pointerup", function () {
            if (!matcher.preventOtherPointerUp) {
                sweeper.sweepAll();
            }
            matcher.preventOtherPointerUp = false;
        });
        game.addEventListener('update', function (data) {
            // mega sweep
            if (_this.allMetersFull()) {
                meter.visible = true;
            }
            else {
                meter.visible = false;
            }
        });
        game.add(meter);
        this._meterActors.push(meter);
    };
    Stats.prototype._addMeter = function (piece, x, y, pos) {
        var _this = this;
        var meter = new Meter(x + (pos * Config.MeterWidth) + (pos * Config.MeterMargin), y, Config.MeterWidth, Config.MeterHeight, PieceTypeToColor[piece], Config.SweepThreshold, Resources.TextureSweepIndicator);
        meter.enableCapturePointer = true;
        meter.on("pointerup", function () {
            if (!matcher.preventOtherPointerUp) {
                sweeper.sweep(piece);
            }
            matcher.preventOtherPointerUp = false;
        });
        game.addEventListener('update', function (data) {
            meter.score = _this._meters[piece];
            // mega sweep
            if (_this.allMetersFull()) {
                meter.visible = false;
            }
            else {
                meter.visible = true;
            }
        });
        game.add(meter);
        this._meterActors.push(meter);
    };
    Stats.prototype._addMeters = function () {
        var meters = [], i, meter;
        var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
        var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
        var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;
        for (i = 0; i < this._meters.length; i++) {
            this._addMeter(PieceTypes[i], meterXPos, meterYPos, i);
        }
    };
    Stats.prototype.clearMeters = function () {
        if (this._meterActors) {
            for (var i = 0; i < this._meterActors.length; i++) {
                game.remove(this._meterActors[i]);
            }
        }
        if (this._meterLabels) {
            for (var i = 0; i < this._meterLabels.length; i++) {
                game.remove(this._meterLabels[i]);
            }
        }
    };
    //sweep meter for challenge mode
    Stats.prototype._addSweepMeter = function () {
        var _this = this;
        var totalMeterWidth = (PieceTypes.length * Config.MeterWidth) + ((PieceTypes.length - 1) * Config.MeterMargin);
        var meterYPos = visualGrid.y + visualGrid.getHeight() + Config.MeterMargin;
        var meterXPos = visualGrid.x + (visualGrid.getWidth() - totalMeterWidth) / 2;
        var square = new Meter(meterXPos, meterYPos, (Config.MeterWidth * 4) + (Config.MeterMargin * 3), Config.MeterHeight, Palette.MegaSweepColor, this._sweepMeterThreshold, Resources.TextureSweepIndicator);
        square.enableCapturePointer = true;
        square.on("pointerup", function () {
            sweeper.sweep();
        });
        game.addEventListener('update', function (data) {
            square.score = _this._sweepMeter;
            square.threshold = _this._sweepMeterThreshold;
        });
        game.add(square);
        this._meterActors.push(square);
    };
    return Stats;
})();
var Meter = (function (_super) {
    __extends(Meter, _super);
    function Meter(x, y, width, height, color, threshold, sweepIndicator, circle) {
        if (circle === void 0) { circle = true; }
        _super.call(this, x, y, width, height);
        this.threshold = threshold;
        this.circle = circle;
        this.color = color;
        this.anchor.setTo(0, 0);
        this._sweepIndicator = sweepIndicator.asSprite();
    }
    Meter.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        var screenPos = engine.worldToScreenCoordinates(new ex.Point(this.x, this.y));
        this.x = screenPos.x;
        this.y = screenPos.y;
    };
    Meter.prototype.draw = function (ctx, delta) {
        var x = this.getBounds().left;
        var y = this.getBounds().top;
        var percentage = (this.score / this.threshold);
        if (this.circle) {
            x = this.getCenter().x;
            y = this.getCenter().y;
            var radius = Config.MeterRadius * gameScale.x;
            var border = Config.MeterBorderThickness * gameScale.x;
            // bg
            var bg;
            if (this.score === this.threshold) {
                bg = new ex.Color(this.color.r, this.color.g, this.color.b, 1).toString();
            }
            else {
                bg = new ex.Color(this.color.r, this.color.g, this.color.b, 0.3).toString();
            }
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, ex.Util.toRadians(360), false);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.closePath();
            // meter
            var from = 0;
            var to = ((2 * Math.PI) * percentage);
            to = ex.Util.clamp(to, ex.Util.toRadians(5), ex.Util.toRadians(360));
            // shift -90 degrees
            from -= ex.Util.toRadians(90);
            to -= ex.Util.toRadians(90);
            ctx.beginPath();
            ctx.arc(x, y, radius, from, to, false);
            ctx.strokeStyle = this.color.toString();
            ctx.lineWidth = border;
            ctx.stroke();
            ctx.closePath();
        }
        else {
            // border
            ctx.strokeStyle = Util.darken(this.color, 0.6).toString();
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, this.getWidth(), this.getHeight());
            // bg
            ctx.fillStyle = new ex.Color(this.color.r, this.color.g, this.color.b, 0.3).toString();
            ctx.fillRect(x, y, this.getWidth(), this.getHeight());
            // fill
            ctx.fillStyle = this.color.toString();
            ctx.fillRect(x, y, (this.getWidth() * percentage), this.getHeight());
        }
        if (this.score === this.threshold) {
            var centeredX = this.getCenter().x - (this._sweepIndicator.width / 2);
            var centeredY = this.getCenter().y - (this._sweepIndicator.height / 2);
            this._sweepIndicator.draw(ctx, centeredX, centeredY);
        }
    };
    return Meter;
})(ex.UIActor);
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
        this._emitter.beginColor = ex.Color.fromHex("#FF4A51");
        this._emitter.endColor = ex.Color.Transparent;
        this._emitter.anchor.setTo(0, 1);
    }
    Sweeper.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        if (Config.EnableSweeper) {
            this._emitter.isEmitting = true;
            //game.add(this._label);
            game.add(this._emitter);
        }
        this.y = visualGrid.y + (this._row * Config.CellHeight * gameScale.y);
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
        this._emitter.x = visualGrid.x;
        this._emitter.y = this.y;
        this._emitter.setWidth(visualGrid.getWidth());
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
        grid.getPieces().forEach(function (piece) {
            // todo adjust mega sweep scoring?
            stats.scorePieces([piece]);
            // clear
            effects.clearEffect(piece);
            grid.clearPiece(piece);
        });
        // reset meter
        stats.resetAllMeters();
        // add combo multiplier
        //stats.increaseScoreMultiplier();
        // fill grid
        grid.seed(Config.NumStartingRows, true, Config.MegaSweepDelay);
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
                effects.clearEffect(cell.piece);
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
                effects.clearEffect(cell.piece);
                grid.clearPiece(cell.piece);
            });
            // reset meter
            stats.resetSweeperMeter();
            // advance sweeper
            if (!Config.SweepMovesUp && this._row < Config.SweepMaxRow) {
                this._row++;
                this.moveBy(this.x, this.y + Config.CellHeight * gameScale.y, 200);
            }
            else if (Config.SweepMovesUp && this._row > Config.SweepMinRow) {
                this._row--;
                this.moveBy(this.x, this.y - Config.CellHeight * gameScale.y, 200);
            }
            turnManager.advanceTurn();
        }
        Resources.SweepSound.play();
    };
    return Sweeper;
})(ex.Actor);
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(corner, texture) {
        _super.call(this, corner.x, corner.y, game.getWidth() + texture.width, game.getHeight() + texture.height);
        this.corner = corner;
        this.texture = texture;
        this.addDrawing(texture);
    }
    Background.prototype.update = function (engine, delta) {
        this.corner = engine.screenToWorldCoordinates(new ex.Point(0, 0));
        this.x = this.corner.x - 20;
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
        //TODO move emitter to Cell
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
        emitter.startSize = gameScale.x * 0.5;
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
        emitter.moveTo(emitter.x + 3, emitter.y + 1, 1).die();
    };
    return Effects;
})();
var NoMoves = (function (_super) {
    __extends(NoMoves, _super);
    function NoMoves() {
        _super.call(this, -200, game.getHeight() / 2, 200, 100);
        this.color = ex.Color.Azure.clone();
        this.anchor.setTo(.5, .5);
        this.setCenterDrawing(true);
        this.addDrawing(Resources.NoMovesTexture);
    }
    NoMoves.prototype.play = function () {
        var _this = this;
        var corner = this._engine.screenToWorldCoordinates(new ex.Point(0, 0));
        this.x = corner.x - this.getWidth();
        this.y = game.getHeight() / 2;
        return this.easeTo(game.getWidth() / 2, game.getHeight() / 2, 500, ex.EasingFunctions.EaseInOutCubic).delay(200).easeTo(game.getWidth() + this.getWidth(), this.y, 500, ex.EasingFunctions.EaseInOutCubic).asPromise().then(function () {
            _this.x = corner.x - _this.getWidth();
        });
    };
    return NoMoves;
})(ex.UIActor);
var Mask = (function (_super) {
    __extends(Mask, _super);
    function Mask() {
        _super.call(this, 0, 0, 0, Config.CellHeight);
        this.anchor.setTo(0, 0);
        this.color = Util.darken(new ex.Color(Palette.GridBackgroundColor.r, Palette.GridBackgroundColor.g, Palette.GridBackgroundColor.b), 0.3);
        //this.color = ex.Color.Transparent;
    }
    Mask.prototype.update = function (engine, delta) {
        var vgWorldPos = game.worldToScreenCoordinates(new ex.Point(visualGrid.x, visualGrid.getBottom()));
        this.x = vgWorldPos.x;
        this.y = vgWorldPos.y;
        this.setWidth(visualGrid.getWidth());
    };
    return Mask;
})(ex.UIActor);
var SoundLevel;
(function (SoundLevel) {
    SoundLevel[SoundLevel["Off"] = 0] = "Off";
    SoundLevel[SoundLevel["FxOnly"] = 1] = "FxOnly";
    SoundLevel[SoundLevel["All"] = 2] = "All";
})(SoundLevel || (SoundLevel = {}));
var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.init = function () {
        SoundManager._SoundElement = document.getElementById("sound");
        SoundManager._SoundElement.addEventListener('click', SoundManager._handleSoundClick);
        SoundManager._setSoundLevel(SoundManager._getPreference());
        ex.Logger.getInstance().info("SoundManager: loaded preference", SoundManager._CurrentSoundLevel);
    };
    SoundManager.playGameOver = function () {
        if (SoundManager._CurrentSoundLevel === 0 /* Off */)
            return;
        SoundManager._stopMusic();
        Resources.GameOverSound.setVolume(.4);
        Resources.GameOverSound.play();
    };
    SoundManager.startLoop = function () {
        if (SoundManager._CurrentSoundLevel === 0 /* Off */)
            return;
        SoundManager._startMusic();
        // play some sounds
        if (gameMode === 0 /* Standard */) {
            Resources.KnockSound.setVolume(.5);
            Resources.TapsSound.setVolume(.2);
            Resources.SweepSound.setVolume(.4);
            Resources.MegaSweepSound.setVolume(.4);
        }
    };
    SoundManager._setSoundLevel = function (level) {
        if (SoundManager._CurrentSoundLevel === level)
            return;
        SoundManager._setPreference(level);
        SoundManager._setIconState(level);
        switch (level) {
            case 2 /* All */:
                SoundManager._setVolume(1);
                SoundManager.startLoop();
                break;
            case 1 /* FxOnly */:
                SoundManager._stopMusic();
                break;
            default:
                SoundManager._stopMusic();
                SoundManager._setVolume(0);
        }
        ex.Logger.getInstance().info("Set sound level", level);
    };
    SoundManager._startMusic = function () {
        if (SoundManager._CurrentSoundLevel !== 2 /* All */)
            return;
        SoundManager._stopMusic();
        if (gameMode === 0 /* Standard */) {
            Resources.LoopSound.setLoop(true);
            Resources.LoopSound.play();
        }
        else {
            Resources.ChallengeLoopSound.setLoop(true);
            Resources.ChallengeLoopSound.setVolume(.5);
            Resources.ChallengeLoopSound.play();
        }
    };
    SoundManager._stopMusic = function () {
        Resources.LoopSound.stop();
        Resources.ChallengeLoopSound.stop();
    };
    SoundManager._setVolume = function (volume) {
        for (var r in Resources) {
            if (Resources[r] instanceof ex.Sound) {
                Resources[r].setVolume(volume);
            }
        }
    };
    SoundManager._getPreference = function () {
        var c = Cookies.get(SoundManager._CookieName);
        var n = -1;
        if (typeof c !== "undefined" && (n = parseInt(c, 10)) >= 0) {
            return n;
        }
        return 2 /* All */;
    };
    SoundManager._setPreference = function (level) {
        if (Cookies.enabled) {
            Cookies.set(SoundManager._CookieName, level, { expires: '2020-01-01' });
        }
        SoundManager._CurrentSoundLevel = level;
    };
    SoundManager._handleSoundClick = function () {
        switch (SoundManager._getIconState()) {
            case 2 /* All */:
                SoundManager._setSoundLevel(1 /* FxOnly */);
                break;
            case 1 /* FxOnly */:
                SoundManager._setSoundLevel(0 /* Off */);
                break;
            default:
                SoundManager._setSoundLevel(2 /* All */);
        }
    };
    SoundManager._getIconState = function () {
        if ($(SoundManager._SoundElement).hasClass('fa-volume-up')) {
            return 2 /* All */;
        }
        else if ($(SoundManager._SoundElement).hasClass('fa-volume-down')) {
            return 1 /* FxOnly */;
        }
        else {
            return 0 /* Off */;
        }
    };
    SoundManager._setIconState = function (level) {
        $(SoundManager._SoundElement).removeClass("fa-volume-down");
        $(SoundManager._SoundElement).removeClass("fa-volume-up");
        $(SoundManager._SoundElement).removeClass("fa-volume-off");
        switch (level) {
            case 0 /* Off */:
                $(SoundManager._SoundElement).addClass('fa-volume-off');
                break;
            case 1 /* FxOnly */:
                $(SoundManager._SoundElement).addClass('fa-volume-down');
                break;
            case 2 /* All */:
                $(SoundManager._SoundElement).addClass('fa-volume-up');
                break;
        }
    };
    SoundManager._CookieName = "sweep-sound-level";
    SoundManager._CurrentSoundLevel = 2 /* All */;
    return SoundManager;
})();
/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="../scripts/typings/zepto/zepto.d.ts"/>
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
var _this = this;
var game = new ex.Engine(0, 0, "game", 0 /* FullScreen */);
var gameScale = new ex.Point(1, 1);
var gameMode = 0 /* Standard */;
var loader = new ex.Loader();
// transparent bg
game.backgroundColor = ex.Color.Transparent;
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
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
var visualGrid, turnManager, matcher, transitionManager, sweeper, stats, background, noMoves, effects;
// game modes
var loadConfig = function (config) {
    Config.resetDefault();
    config.call(_this);
    InitSetup();
};
Config.resetDefault();
document.getElementById("how-to-play").addEventListener("click", function () {
    if (gameMode === 0 /* Standard */) {
        MainMenu.ShowNormalTutorial();
    }
    else {
        MainMenu.ShowChallengeTutorial();
    }
});
document.getElementById("play-again").addEventListener('click', function () {
    if (gameMode == 0 /* Standard */) {
        MainMenu.LoadStandardMode();
    }
    else if (gameMode == 1 /* Timed */) {
        MainMenu.LoadChallengeMode();
    }
});
document.getElementById("challenge").addEventListener('click', function () {
    if (gameMode == 0 /* Standard */) {
        MainMenu.LoadChallengeMode();
    }
    else if (gameMode == 1 /* Timed */) {
        MainMenu.LoadStandardMode();
    }
});
//reset the game with the given grid dimensions
function InitSetup() {
    grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
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
    if (turnManager && turnManager.currentPromise.state() === 2 /* Pending */) {
        turnManager.currentPromise.resolve();
    }
    //initialize game objects
    if (matcher)
        matcher.dispose(); //unbind events
    if (turnManager)
        turnManager.dispose(); //cancel the timer
    matcher = new MatchManager();
    if (stats) {
        stats.clearMeters();
    }
    stats = new Stats();
    turnManager = new TurnManager(visualGrid.logicalGrid, matcher, Config.EnableTimer ? 0 /* Timed */ : 1 /* Match */);
    transitionManager = new TransitionManager(visualGrid.logicalGrid, visualGrid);
    sweeper = new Sweeper(Config.SweepMovesUp ? Config.SweepMaxRow : Config.SweepMinRow, visualGrid.logicalGrid.cols);
    game.add(visualGrid);
    game.add(sweeper);
    stats.drawScores();
    // hide game over
    $("#game-over").removeClass("show");
    //add pieces to initial rows
    grid.seed(Config.NumStartingRows);
    // start sound
    SoundManager.startLoop();
    // feature flags
    Config.EnableLevels && $(".feature-levels").removeClass("hide");
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
    if (gameMode == 0 /* Standard */) {
        document.getElementById("challenge").innerHTML = "Try Challenge Mode";
    }
    else if (gameMode == 1 /* Timed */) {
        document.getElementById("challenge").innerHTML = "Try Standard Mode";
    }
    var enduranceBonus = stats.calculateEnduranceBonus();
    var levelBonus = stats.calculateLevelBonus();
    var totalScore = stats.getFinalScore();
    var longestChain = stats.getLongestChain();
    var turnsTaken = stats.getTurnNumber();
    var timeElapsed = Math.round(turnManager.getTime() / 1000 / 60);
    var analytics = window.ga;
    if (analytics) {
        analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'total score', { 'eventValue': totalScore });
        analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'longest chain', { 'eventValue': longestChain });
        if (gameMode == 0 /* Standard */) {
            analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'turns taken', { 'eventValue': turnsTaken });
        }
        else if (gameMode == 1 /* Timed */) {
            analytics('send', 'event', 'ludum-30-stats', GameMode[gameMode], 'time elapsed', { 'eventValue': timeElapsed });
        }
    }
    SoundManager.playGameOver();
    if (turnManager)
        turnManager.dispose(); // stop game over from happening infinitely in time attack
    addClass(document.getElementById("game-over"), "show");
    $("#game-over-swept").text(stats.getTotalPiecesSwept().toString());
    $("#game-over-chain").text(stats.getTotalChainBonus().toString());
    $("#game-over-multiplier").text((stats.getFinalScore() - enduranceBonus - stats.getTotalChainBonus() - stats.getTotalPiecesSwept()).toString());
    $("#game-over-time").text(enduranceBonus.toString());
    $("#game-over-level").text(levelBonus);
    $("#game-over-total").text(stats.getFinalScore().toString());
    try {
        appendTwitter();
        var social = $('#social-container');
        var facebookW = $('#fidget');
        facebookW.remove();
        social.append(facebookW);
    }
    catch (e) {
        ex.Logger.getInstance().warn("Twitter or Facebook share init failed", e);
    }
}
var twitterScript;
function appendTwitter() {
    // twitter is silly, can't dynamically update tweet text
    //
    var text = $("#twidget").data('text');
    $("#twidget").data('text', text.replace("SOCIAL_SCORE", stats.getFinalScore()).replace("SOCIAL_MODE", gameMode === 1 /* Timed */ ? "challenge mode" : "standard mode"));
    if (twitterScript) {
        $(twitterScript).remove();
    }
    twitterScript = document.createElement('script');
    twitterScript.innerText = "!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + '://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); } } (document, 'script', 'twitter-wjs');";
    $("#game-over").append(twitterScript);
}
// TODO clean up pieces that are not in play anymore after update loop
game.start(loader).then(function () {
    // set game scale
    var defaultGridHeight = Config.CellHeight * Config.GridCellsHigh;
    // todo do this on game.on('update')
    // scale based on height of viewport
    // target 85% height
    var scale = defaultGridHeight / game.getHeight();
    var scaleDiff = 0.85 - scale;
    ex.Logger.getInstance().info("Current viewport scale", scale);
    gameScale.setTo(1 + scaleDiff, 1 + scaleDiff);
    InitSetup();
});
//# sourceMappingURL=game.js.map