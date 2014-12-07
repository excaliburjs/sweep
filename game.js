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
        var r = Math.min(255, Math.floor(color.r + (255 * amount)));
        var g = Math.min(255, Math.floor(color.g + (255 * amount)));
        var b = Math.min(255, Math.floor(color.b + (255 * amount)));
        return new ex.Color(r, g, b, color.a);
    };
    return Util;
})();
var Config = (function () {
    function Config() {
    }
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
    // sweep mechanic
    Config.SweepThreshold = 20;
    Config.EnableSweepMeters = true;
    Config.ClearSweepMetersAfterSingleUse = true;
    // alt sweep mechanic 1
    Config.EnableSweeper = false;
    Config.SweepStartRow = 3;
    Config.SweepMaxRow = 7;
    Config.SweepAltThreshold = 20;
    Config.SweepAltThresholdIncrease = 5;
    return Config;
})();
/// <reference path="util.ts"/>
var Resources = {};
var Palette = {
    GameBackgroundColor: ex.Color.fromHex("#efefef"),
    GridBackgroundColor: ex.Color.fromHex("#efefef"),
    // Beach
    PieceColor1: ex.Color.fromHex("#BF6D72"),
    PieceColor2: ex.Color.fromHex("#DBB96D"),
    PieceColor3: ex.Color.fromHex("#5096F2"),
    PieceColor4: ex.Color.fromHex("#9979E0")
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
    };
    Piece.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (matcher.runInProgress && (!this.selected && this.getType() !== matcher.getRunType())) {
            this.color = new ex.Color(this._originalColor.r, this._originalColor.g, this._originalColor.b, 0.3);
        }
        else if (this.selected) {
            this.color = Util.lighten(this._originalColor, 0.3);
        }
        else {
            this.color = this._originalColor;
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
        piece.cell.piece = null;
        piece.cell = null;
        piece.kill();
    };
    LogicalGrid.prototype.fill = function (row, smooth) {
        var _this = this;
        if (smooth === void 0) { smooth = false; }
        if (smooth) {
            for (var i = 0; i < this.cols; i++) {
                (function () {
                    var piece = PieceFactory.getRandomPiece();
                    var cell = _this.getCell(i, row);
                    piece.x = cell.getCenter().x;
                    piece.y = mask.y + Config.CellHeight;
                    var intendedCell = _this.setCell(i, row, piece, false);
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
                        _this.setCell(i, row, piece, false);
                    }
                    piece.moveTo(cell.getCenter().x, cell.getCenter().y, 300).asPromise().then(function () {
                        piece.x = cell.getCenter().x;
                        piece.y = cell.getCenter().y;
                    });
                })();
            }
            mask.kill();
            game.add(mask);
        }
        else {
            for (var i = 0; i < this.cols; i++) {
                (function () {
                    var currentPiece = PieceFactory.getRandomPiece();
                    var currentCell = _this.setCell(i, row, currentPiece, !smooth);
                    var neighbors = currentCell.getNeighbors();
                    var hasMatchingNeighbor = false;
                    for (var j = 0; j < neighbors.length; j++) {
                        if ((neighbors[j].piece) && currentCell.piece.getType() == neighbors[j].piece.getType()) {
                            hasMatchingNeighbor = true;
                            break;
                        }
                    }
                    if (hasMatchingNeighbor) {
                        if (currentCell.piece) {
                            _this.clearPiece(currentCell.piece);
                        }
                        _this.setCell(i, row, PieceFactory.getRandomPiece(), !smooth);
                    }
                })();
            }
        }
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
                }
            }
            else if (this.getCell(i, from).piece) {
                (function () {
                    var p = _this.getCell(i, from).piece;
                    var dest = _this.getCell(i, to).getCenter();
                    promises.push(p.moveTo(dest.x, dest.y, 300).asPromise());
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
            ctx.strokeStyle = Util.darken(Palette.GridBackgroundColor, 0.1);
            ctx.lineWidth = 1;
            ctx.strokeRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
        });
    };
    VisualGrid.prototype.getCellByPos = function (screenX, screenY) {
        return _.find(this.logicalGrid.cells, function (cell) {
            return cell.piece && cell.piece.contains(screenX, screenY);
        });
    };
    VisualGrid.prototype.sweep = function (type) {
        if (!matcher.gameOver) {
            // can sweep?
            if (stats.getMeter(type) < Config.SweepThreshold)
                return;
            var cells = this.logicalGrid.cells.filter(function (cell) {
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
    };
    return VisualGrid;
})(ex.Actor);
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
        this._run = [];
        this.gameOver = false;
        this.dispose = function () {
            game.input.pointers.primary.off("down", _.bind(this._handlePointerDown, this));
            game.input.pointers.primary.off("up", _.bind(this._handlePointerUp, this));
            game.input.pointers.primary.off("move", _.bind(this._handlePointerMove, this));
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
    MatchManager.prototype._handlePointerDown = function (pe) {
        if (!this.gameOver) {
            var cell = visualGrid.getCellByPos(pe.x, pe.y);
            if (!cell || this.runInProgress || !cell.piece) {
                return;
            }
            if (pe.pointerType === 1 /* Mouse */ && pe.button !== 0 /* Left */) {
                return;
            }
            this.runInProgress = true;
            cell.piece.selected = true;
            this._run.push(cell.piece);
            ex.Logger.getInstance().info("Run started", this._run);
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
                ex.Logger.getInstance().info("Run modified", this._run);
                // notify
                this.eventDispatcher.publish("run", new MatchEvent(_.clone(this._run)));
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
                ex.Logger.getInstance().info("Run modified", this._run);
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
    return MatchManager;
})(ex.Class);
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
        matcher.on('match', _.bind(this._handleMatchEvent, this));
        this._timer = new ex.Timer(_.bind(this._tick, this), 2000, true);
        game.add(this._timer);
    }
    TurnManager.prototype.advanceTurn = function () {
        var _this = this;
        transitionManager.evaluate().then(function () {
            _this.advanceRows();
            console.log("Done!");
        });
    };
    TurnManager.prototype.advanceRows = function () {
        var _this = this;
        var promises = [];
        for (var i = 0; i < grid.rows; i++) {
            promises.push(this.logicalGrid.shift(i, i - 1));
        }
        // fill first row
        promises = _.filter(promises, function (p) {
            return p;
        });
        ex.Promise.join.apply(null, promises).then(function () {
            _this.logicalGrid.fill(grid.rows - 1, true);
        }).error(function (e) {
            console.log(e);
        });
    };
    TurnManager.prototype._handleMatchEvent = function (evt) {
        if (evt.run.length >= 3) {
            stats.scorePieces(evt.run);
            stats.scoreChain(evt.run);
            evt.run.forEach(function (p) { return grid.clearPiece(p); });
            this.advanceTurn();
        }
    };
    TurnManager.prototype._tick = function () {
        if (this.turnMode === 0 /* Timed */) {
            this.advanceRows();
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
                    var promise = piece.moveTo(landingCell.getCenter().x, landingCell.getCenter().y, 300).asPromise();
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
        this._types = [0 /* Circle */, 1 /* Triangle */, 2 /* Square */, 3 /* Star */];
        this._scores = [this._numCirclesDestroyed, this._numTrianglesDestroyed, this._numSquaresDestroyed, this._numStarsDestroyed];
        this._meters = [this._numCirclesDestroyedMeter, this._numTrianglesDestroyedMeter, this._numSquaresDestroyedMeter, this._numStarsDestroyedMeter];
        this._sweepMeter = 0;
        this._sweepMeterThreshold = 0;
        this._chains = [this._longestCircleCombo, this._longestTriangleCombo, this._longestSquareCombo, this._longestStarCombo];
        this._lastChain = 0;
        this._sweepMeterThreshold = Config.SweepAltThreshold;
    }
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
    Stats.prototype.canSweep = function () {
        return this._sweepMeter === this._sweepMeterThreshold;
    };
    Stats.prototype.resetSweeperMeter = function () {
        this._sweepMeter = 0;
        this._sweepMeterThreshold += Config.SweepAltThresholdIncrease;
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
    Stats.prototype._addMeter = function (piece, x, y) {
        var _this = this;
        var square = new Meter(x, y, PieceTypeToColor[piece], Config.SweepThreshold);
        var label = new ex.Label(null, square.getCenter().x, square.getCenter().y + 3);
        label.textAlign = 2 /* Center */;
        label.color = ex.Color.Black;
        game.addEventListener('update', function (data) {
            square.score = _this._meters[piece];
            if (_this._meters[piece] === Config.SweepThreshold) {
                label.text = "Press " + (piece + 1) + " to SWEEP";
            }
            else {
                label.text = _this._meters[piece].toString();
            }
        });
        game.add(square);
        game.add(label);
    };
    Stats.prototype._addSweepMeter = function (x, y) {
        var _this = this;
        var square = new Meter(x, y, ex.Color.Red, this._sweepMeterThreshold);
        var label = new ex.Label(null, square.getCenter().x, y + 20);
        label.textAlign = 2 /* Center */;
        label.color = ex.Color.Black;
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
    }
    Meter.prototype.draw = function (ctx, delta) {
        ctx.strokeStyle = this.color.toString();
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.getWidth(), this.getHeight());
        var percentage = (this.score / this.threshold);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(this.x, this.y, (this.getWidth() * percentage), this.getHeight());
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
        this._emitter.isEmitting = true;
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
        game.add(this._label);
        game.add(this._emitter);
        this.y = visualGrid.y + (this._row * Config.CellHeight);
    };
    Sweeper.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this.x = visualGrid.x;
        this._label.x = visualGrid.x - 50;
        this._label.y = this.y;
        this._emitter.x = visualGrid.x;
        this._emitter.y = this.y;
    };
    Sweeper.prototype.sweep = function () {
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
        // todo advance every so often?
        if (this._row < Config.SweepMaxRow) {
            this._row++;
            this.moveBy(this.x, this.y + Config.CellHeight, 200);
        }
        turnManager.advanceTurn();
    };
    return Sweeper;
})(ex.Actor);
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
/// <reference path="Stats.ts"/>
/// <reference path="sweeper.ts"/>
var game = new ex.Engine(Config.gameWidth, Config.gameHeight, "game");
game.backgroundColor = Palette.GameBackgroundColor;
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// game objects
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
var visualGrid = new VisualGrid(grid);
var turnManager, matcher, transitionManager, sweeper, stats, mask;
InitSetup();
//reset the game with the given grid dimensions
function InitSetup() {
    if (game.currentScene.children) {
        for (var i = 0; i < game.currentScene.children.length; i++) {
            game.removeChild(game.currentScene.children[i]);
        }
    }
    for (var i = 0; i < grid.cells.length; i++) {
        grid.cells[i].piece = null;
    }
    game.currentScene.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);
    //initialize game objects
    if (matcher)
        matcher.dispose(); //unbind events
    matcher = new MatchManager();
    turnManager = new TurnManager(visualGrid.logicalGrid, matcher, 1 /* Match */);
    transitionManager = new TransitionManager(visualGrid.logicalGrid, visualGrid);
    sweeper = new Sweeper(Config.SweepStartRow, visualGrid.logicalGrid.cols);
    stats = new Stats();
    mask = new ex.Actor(0, Config.GridCellsHigh * Config.CellHeight + 5, visualGrid.logicalGrid.cols * Config.CellWidth, Config.CellHeight * 2, Palette.GameBackgroundColor.clone());
    mask.anchor.setTo(0, 0);
    stats.drawScores();
    game.add(visualGrid);
    if (Config.EnableSweeper) {
        game.add(sweeper);
    }
    game.add(mask);
    for (var i = 0; i < Config.NumStartingRows; i++) {
        grid.fill(grid.rows - (i + 1));
    }
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
    if (evt.key === 49)
        visualGrid.sweep(0 /* Circle */);
    if (evt.key === 50)
        visualGrid.sweep(1 /* Triangle */);
    if (evt.key === 51)
        visualGrid.sweep(2 /* Square */);
    if (evt.key === 52)
        visualGrid.sweep(3 /* Star */);
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
        visualGrid = new VisualGrid(grid);
        InitSetup();
    }
    // alt sweep
    if (Config.EnableSweeper && evt.key === 83 /* S */)
        sweeper.sweep();
});
// TODO clean up pieces that are not in play anymore after update loop
game.start(loader).then(function () {
    // todo build game
});
//# sourceMappingURL=game.js.map