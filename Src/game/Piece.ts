class Piece extends ex.Actor {

   private _id: number;
   private _color: ex.Color;
   private _type: PieceType;

   constructor(id: number, x?: number, y?: number, width?: number, height?: number, color?: ex.Color, type?: PieceType) {
      super(x, y, Config.pieceWidth, Config.pieceHeight, color);
      this._id = id
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

enum PieceType {
   Circle,
   Triangle,
   Square,
   Star
}