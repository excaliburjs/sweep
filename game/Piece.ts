enum PieceType {
   Circle,
   Triangle,
   Square,
   Star
}

var PieceTypes = [PieceType.Circle, PieceType.Square, PieceType.Triangle, PieceType.Star];
var PieceTypeToColor = [ex.Color.Cyan, ex.Color.Orange, ex.Color.Violet, ex.Color.Chartreuse];

class Piece extends ex.Actor {

   private _id: number;
   private _color: ex.Color;
   private _type: PieceType;

   constructor(id: number, x?: number, y?: number, color?: ex.Color, type?: PieceType) {
      super(x, y, Config.PieceWidth, Config.PieceHeight, color);
      this._id = id;
      this._type = type || PieceType.Circle;
   }

   public getId(): number {
      return this._id;
   }

   public getColor(): ex.Color {
      return this._color;
   }

   public setColor(color: ex.Color): void {
      this._color = color;
   }

   public getType(): PieceType {
      return this._type;
   }

   public setType(type: PieceType): void {
      this._type = type;
   }
}

class PieceFactory {
   private static _maxId: number = 0;
   public static getRandomPiece(): Piece {
      var index = Math.floor(Math.random() * PieceTypes.length);
      return new Piece(PieceFactory._maxId++, 0, 0,PieceTypeToColor[index].clone(), index);
   }
}

