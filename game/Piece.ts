enum PieceType {
   Circle,
   Triangle,
   Square,
   Star
}

var PieceTypes = [PieceType.Circle, PieceType.Square, PieceType.Triangle, PieceType.Star];
var PieceTypeToColor = [ex.Color.Cyan, ex.Color.Orange, ex.Color.Violet, ex.Color.Chartreuse];

class PieceEvent extends ex.GameEvent {
   constructor(public cell: Cell) {
      super();
   }
}

class Piece extends ex.Actor {

   private _id: number;
   private _originalColor: ex.Color;
   private _type: PieceType;

   public selected: boolean = false;

   constructor(id: number, x?: number, y?: number, color?: ex.Color, type?: PieceType) {
      super(x, y, Config.PieceWidth, Config.PieceHeight, color);
      this._id = id;
      this._type = type || PieceType.Circle;
      this._originalColor = color;
   }

   public getId(): number {
      return this._id;
   }

   public getType(): PieceType {
      return this._type;
   }

   public setType(type: PieceType): void {
      this._type = type;
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      if (matcher.runInProgress && (!this.selected && this.getType() !== matcher.getRunType())) {
         this.color = new ex.Color(this._originalColor.r, this._originalColor.g, this._originalColor.b, 0.2);
      } else {
         this.color = this._originalColor;
      }
   }
}

class PieceFactory {
   private static _maxId: number = 0;
   public static getRandomPiece(): Piece {
      var index = Math.floor(Math.random() * PieceTypes.length);
      var piece = new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[index].clone(), index);
      game.add(piece);

      return piece;
   }
}

