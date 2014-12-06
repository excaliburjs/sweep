var Config = (function () {
    function Config() {
    }
    Config.PieceWidth = 10;
    Config.PieceHeight = 10;
    Config.CellWidth = 20;
    Config.CellHeight = 20;
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
var Piece = (function (_super) {
    __extends(Piece, _super);
    function Piece(id, x, y, color, type) {
        _super.call(this, x, y, Config.PieceWidth, Config.PieceHeight, color);
        this._id = id;
        this._type = type || 0 /* Circle */;
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
        return new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[index].clone(), index);
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
var LogicalGrid = (function () {
    function LogicalGrid(rows, cols) {
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
    LogicalGrid.prototype.setCell = function (x, y, data) {
        var center = this.getCell(x, y).getCenter();
        data.x = center.x;
        data.y = center.y;
        game.add(data);
        this.cells[(x + y * this.cols)].piece = data;
    };
    LogicalGrid.prototype.fill = function (row) {
        for (var i = 0; i < this.cols; i++) {
            this.setCell(i, row, PieceFactory.getRandomPiece());
        }
    };
    return LogicalGrid;
})();
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
    return VisualGrid;
})(ex.Actor);
/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="resources.ts"/>
/// <reference path="Piece.ts"/>
/// <reference path="grid.ts"/>
var game = new ex.Engine(720, 480, "game");
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
// build grid
var grid = new LogicalGrid(15, 10);
var visualGrid = new VisualGrid(grid);
game.camera.setFocus(visualGrid.getWidth() / 2, visualGrid.getHeight() / 2);
game.add(visualGrid);
grid.fill(grid.rows - 1);
game.input.keyboard.on('down', function (evt) {
    if (evt.key === 68 /* D */) {
        game.isDebug = !game.isDebug;
    }
});
game.start(loader).then(function () {
    // todo build game
});
//# sourceMappingURL=game.js.map