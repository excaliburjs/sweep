var Config = (function () {
    function Config() {
    }
    Config.PieceWidth = 20;
    Config.PieceHeight = 20;
    Config.CellWidth = 30;
    Config.CellHeight = 30;
    return Config;
})();
var Resources = {};
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
var PieceTypeToColor = [ex.Color.Cyan, ex.Color.Orange, ex.Color.Violet, ex.Color.Chartreuse];
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
        this._id = id;
        this._type = type || 0 /* Circle */;
        this.enableCapturePointer = true;
        this.capturePointer.captureMoveEvents = true;
    }
    Piece.prototype.getId = function () {
        return this._id;
    };
    Piece.prototype.getColor = function () {
        return this._color;
    };
    Piece.prototype.setColor = function (color) {
        this._color = color;
    };
    Piece.prototype.getType = function () {
        return this._type;
    };
    Piece.prototype.setType = function (type) {
        this._type = type;
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
    function Cell(x, y, piece) {
        this.x = x;
        this.y = y;
        this.piece = piece;
    }
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
                this.cells[i + j * this.cols] = new Cell(i, j, null);
            }
        }
    }
    LogicalGrid.prototype.getCell = function (x, y) {
        if (x < 0 || x > this.cols)
            return null;
        if (y < 0 || y > this.rows)
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
            ctx.fillStyle = 'gray';
            ctx.fillRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(c.x * Config.CellWidth, c.y * Config.CellHeight, Config.CellWidth, Config.CellHeight);
        });
    };
    VisualGrid.prototype.getCellByPos = function (screenX, screenY) {
        return _.find(this.logicalGrid.cells, function (cell) {
            return cell.piece && cell.piece.contains(screenX, screenY);
        });
    };
    return VisualGrid;
})(ex.Actor);
var MatchEvent = (function (_super) {
    __extends(MatchEvent, _super);
    function MatchEvent() {
        _super.call(this);
    }
    return MatchEvent;
})(ex.GameEvent);
var MatchManager = (function (_super) {
    __extends(MatchManager, _super);
    function MatchManager(grid) {
        var _this = this;
        _super.call(this);
        this._pieces = [];
        this._run = [];
        this._runInProgress = false;
        grid.on("pieceadd", function (pe) {
            if (!pe.cell.piece)
                return;
            if (_.find(_this._pieces, pe.cell.piece))
                return;
            _this._pieces.push(pe.cell.piece);
            pe.cell.piece.on("pointerdown", _this._handlePieceDown.bind(_this));
            pe.cell.piece.on("pointerup", _this._handlePieceUp.bind(_this));
            pe.cell.piece.on("pointermove", _this._handlePieceMove.bind(_this));
        });
        grid.on("pieceremove", function (pe) {
            // todo
        });
        game.input.pointers.on("up", this._handlePieceUp);
    }
    MatchManager.prototype._handlePieceDown = function (pe) {
        var cell = visualGrid.getCellByPos(pe.x, pe.y);
        if (!cell)
            return;
        this._runInProgress = true;
        this._run.push(cell.piece);
        ex.Logger.getInstance().info("Run started", this._run);
        // darken/highlight
        // draw line?
    };
    MatchManager.prototype._handlePieceMove = function (pe) {
        // add piece to run if valid
        // draw line?
        if (!this._runInProgress)
            return;
        ex.Logger.getInstance().info("Run modified", this._run);
    };
    MatchManager.prototype._handlePieceUp = function (pe) {
        // todo figure out match
        ex.Logger.getInstance().info("Run ended", this._run);
        this._run.length = 0;
        this._runInProgress = false;
    };
    return MatchManager;
})(ex.Class);
var TurnManager = (function () {
    function TurnManager(logicalGrid, matcher) {
        this.logicalGrid = logicalGrid;
        this.matcher = matcher;
        matcher.on('match', this._handleMatchEvent);
        this._timer = new ex.Timer(this._tick, 1000, true);
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
        this._shiftBoard();
    };
    TurnManager.prototype._tick = function () {
        //ex.Logger.getInstance().info("Tick", new Date());
    };
    return TurnManager;
})();
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
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// build grid
var grid = new LogicalGrid(15, 10);
var visualGrid = new VisualGrid(grid);
var matcher = new MatchManager(grid);
var turnManager = new TurnManager(grid, matcher);
game.currentScene.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);
game.add(visualGrid);
grid.fill(grid.rows - 1);
grid.fill(grid.rows - 2);
grid.fill(grid.rows - 3);
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
});
game.start(loader).then(function () {
    // todo build game
});
//# sourceMappingURL=game.js.map