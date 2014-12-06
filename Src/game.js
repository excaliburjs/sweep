var Config = (function () {
    function Config() {
    }
    Config.gameWidth = 720;
    Config.gameHeight = 720;
    Config.PieceWidth = 36;
    Config.PieceHeight = 36;
    Config.CellWidth = 45;
    Config.CellHeight = 45;
    Config.GridCellsHigh = 15;
    Config.GridCellsWide = 10;
    Config.NumStartingRows = 3;
    return Config;
})();
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
/// <reference path="util.ts"/>
var Resources = {};
var Palette = {
    GameBackgroundColor: ex.Color.fromHex("#a4adb2"),
    GridBackgroundColor: ex.Color.fromHex("#EBF8FF"),
    PieceColor1: ex.Color.fromHex("#748BD9"),
    PieceColor2: ex.Color.fromHex("#7D8C45"),
    PieceColor3: ex.Color.fromHex("#BF8136"),
    PieceColor4: ex.Color.fromHex("#8C251C")
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
    LogicalGrid.prototype.getCell = function (x, y) {
        if (x < 0 || x >= this.cols)
            return null;
        if (y < 0 || y >= this.rows)
            return null;
        return this.cells[(x + y * this.cols)];
    };
    LogicalGrid.prototype.setCell = function (x, y, data, kill) {
        if (kill === void 0) { kill = false; }
        var cell = this.getCell(x, y);
        if (!cell)
            return;
        if (data) {
            var center = cell.getCenter();
            data.x = center.x;
            data.y = center.y;
            cell.piece = data;
            this.eventDispatcher.publish("pieceadd", new PieceEvent(cell));
        }
        else {
            this.eventDispatcher.publish("pieceremove", new PieceEvent(cell));
            cell.piece = null;
        }
    };
    LogicalGrid.prototype.fill = function (row) {
        for (var i = 0; i < this.cols; i++) {
            this.setCell(i, row, PieceFactory.getRandomPiece());
        }
    };
    LogicalGrid.prototype.shift = function (from, to) {
        if (to > this.rows || to < 0)
            return;
        for (var i = 0; i < this.cols; i++) {
            if (this.getCell(i, from).piece) {
                this.setCell(i, to, this.getCell(i, from).piece);
                this.setCell(i, from, null);
            }
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
        var cells = this.logicalGrid.cells.filter(function (cell) {
            return cell.piece && cell.piece.getType() === type;
        });
        // todo transitions
        cells.forEach(function (cell) {
            grid.setCell(cell.x, cell.y, null);
        });
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
        _super.call(this);
        this._run = [];
        this.runInProgress = false;
        game.input.pointers.primary.on("down", _.bind(this._handlePieceDown, this));
        game.input.pointers.primary.on("up", _.bind(this._handlePointerUp, this));
        game.input.pointers.primary.on("move", _.bind(this._handlePointerMove, this));
    }
    MatchManager.prototype._handlePieceDown = function (pe) {
        var cell = visualGrid.getCellByPos(pe.x, pe.y);
        if (!cell)
            return;
        this.runInProgress = true;
        cell.piece.selected = true;
        this._run.push(cell.piece);
        ex.Logger.getInstance().info("Run started", this._run);
        // darken/highlight
        // draw line?
    };
    MatchManager.prototype._handlePointerMove = function (pe) {
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
        // if piece contains screen coords and we don't already have it in the run
        if (piece.contains(pe.x, pe.y) && this._run.indexOf(piece) < 0) {
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
        if (piece.contains(pe.x, pe.y) && this._run.length > 1 && this._run.indexOf(piece) === this._run.length - 2) {
            // mark for removal
            removePiece = this._run.indexOf(piece) + 1;
        }
        if (removePiece > -1) {
            // remove from run
            this._run[removePiece].selected = false;
            this._run.splice(removePiece, 1);
            ex.Logger.getInstance().info("Run modified", this._run);
        }
    };
    MatchManager.prototype._handlePointerUp = function () {
        // have a valid run?
        if (this._run.length > 0) {
            ex.Logger.getInstance().info("Run ended", this._run);
            // notify
            this.eventDispatcher.publish("match", new MatchEvent(_.clone(this._run)));
            this._run.forEach(function (p) { return p.selected = false; });
            this._run.length = 0;
        }
        this.runInProgress = false;
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
    TurnManager.prototype._shiftBoard = function () {
        for (var i = 0; i < grid.rows; i++) {
            this.logicalGrid.shift(i, i - 1);
        }
        // fill first row
        this.logicalGrid.fill(grid.rows - 1);
    };
    TurnManager.prototype._handleMatchEvent = function (evt) {
        if (evt.run.length >= 3) {
            evt.run.forEach(function (p) { return p.kill(); });
            this._shiftBoard();
        }
    };
    TurnManager.prototype._tick = function () {
        if (this.turnMode === 0 /* Timed */) {
            this._shiftBoard();
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
        return null;
    };
    TransitionManager.prototype._findFloaters = function (row) {
        return [];
    };
    TransitionManager.prototype.evaluate = function () {
    };
    return TransitionManager;
})();
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
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// build grid
var grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
var visualGrid = new VisualGrid(grid);
var matcher = new MatchManager();
var turnManager = new TurnManager(grid, matcher, 1 /* Match */);
game.currentScene.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);
game.add(visualGrid);
for (var i = 0; i < Config.NumStartingRows; i++) {
    grid.fill(grid.rows - (i + 1));
}
game.input.keyboard.on('down', function (evt) {
    if (evt.key === 68 /* D */) {
        game.isDebug = !game.isDebug;
    }
    if (evt.key === 83 /* S */) {
        for (var i = 0; i < grid.rows; i++) {
            grid.shift(i, i - 1);
        }
        // fill first row
        grid.fill(grid.rows - 1);
    }
    if (evt.key === 49)
        visualGrid.sweep(0 /* Circle */);
    if (evt.key === 50)
        visualGrid.sweep(2 /* Square */);
    if (evt.key === 51)
        visualGrid.sweep(3 /* Star */);
    if (evt.key === 52)
        visualGrid.sweep(1 /* Triangle */);
});
// TODO clean up pieces that are not in play anymore after update loop
game.start(loader).then(function () {
    // todo build game
});
