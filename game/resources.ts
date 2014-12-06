/// <reference path="util.ts"/>

var Resources: { [key: string]: ex.ILoadable } = {

   // Textures
   // TextureLevel: new ex.Texture("/images/tex-1.jpg")

};

var Palette = {
   GameBackgroundColor: Util.darken(ex.Color.fromHex("#EBF8FF"), 0.3),
   GridBackgroundColor: ex.Color.fromHex("#EBF8FF"),

   PieceColor1: ex.Color.fromHex("#D8306D"),
   PieceColor2: ex.Color.fromHex("#F2CB05"),
   PieceColor3: ex.Color.fromHex("#6DA8BA"),
   PieceColor4: ex.Color.fromHex("#F25F1B")
};