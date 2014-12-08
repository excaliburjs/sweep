enum PieceType {
   Circle,
   Triangle,
   Square,
   Star
}

var PieceTypes = [PieceType.Circle, PieceType.Square, PieceType.Triangle, PieceType.Star];
var PieceTypeToColor = [Palette.PieceColor1, Palette.PieceColor2, Palette.PieceColor3, Palette.PieceColor4];
var PieceTypeToTexture = [Resources.TextureTile2, Resources.TextureTile1, Resources.TextureTile3, Resources.TextureTile4];

class PieceEvent extends ex.GameEvent {
   constructor(public cell: Cell) {
      super();
   }
}

class Piece extends ex.Actor {

   private _id: number;
   private _originalColor: ex.Color;
   private _type: PieceType;

   public cell: Cell = null;
   public selected: boolean = false;

   public hover: boolean = false;
   
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
      this._updateDrawings();
   }

   private _updateDrawings() {
      var tileSprite = new ex.Sprite(PieceTypeToTexture[this._type], 0, 0, Config.PieceWidth, Config.PieceHeight);
      this.addDrawing("default", tileSprite);

      var highlightSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth, 0, Config.PieceWidth, Config.PieceHeight);
      this.addDrawing("highlight", highlightSprite);

      var fadedSprite = new ex.Sprite(PieceTypeToTexture[this._type], Config.PieceWidth * 2, 0, Config.PieceWidth, Config.PieceHeight);
      this.addDrawing("faded", fadedSprite);
   }

   public onInitialize(engine: ex.Engine) {
      this._updateDrawings();
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);

      if (matcher.runInProgress && (!this.selected && this.getType() !== matcher.getRunType())) {
         this.setDrawing("faded");
      } else if (this.selected) {
         this.setDrawing("highlight");
      } else {
         this.setDrawing("default");
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

   public static getPiece(type: PieceType) {
      
      var piece = new Piece(PieceFactory._maxId++, 0, 0, PieceTypeToColor[type].clone(), type);

      game.add(piece);

      return piece;
   }
}

