/// <reference path="../scripts/typings/Spectra.d.ts"/>

class Util {

   public static darken(color: ex.Color, amount: number) {
      var r = Math.floor(color.r - (color.r * amount));
      var g = Math.floor(color.g - (color.g * amount));
      var b = Math.floor(color.b - (color.b * amount));

      return new ex.Color(r, g, b, color.a);
   }

   public static lighten(color: ex.Color, amount: number) {
      if (color.a <= 0) return color;

      var c = Spectra({ r: color.r, g: color.g, b: color.b, a: color.a });
      var newColor = c.lighten(amount * 100);

      return new ex.Color(newColor.red(), newColor.green(), newColor.blue(), newColor.alpha());
   }

   public static saturate(color: ex.Color, amount: number) {
      if (color.a <= 0) return color;

      var c = Spectra({ r: color.r, g: color.g, b: color.b, a: color.a });
      var newColor = c.saturate(amount * 100);

      return new ex.Color(newColor.red(), newColor.green(), newColor.blue(), newColor.alpha());
   }

   public static getColorOfPixel(imageData: ImageData, x: number, y: number) {
      var firstPixel = (x + y * imageData.width) * 4;
      var pixels = imageData.data;

      return new ex.Color(pixels[firstPixel + 0], pixels[firstPixel + 1], pixels[firstPixel + 2], pixels[firstPixel + 3]);
   }

   public static setPixelToColor(imageData: ImageData, x: number, y: number, color: ex.Color) {
      var firstPixel = (x + y * imageData.width) * 4;
      var pixel = imageData.data;
      pixel[firstPixel + 0] = color.r;
      pixel[firstPixel + 1] = color.g;
      pixel[firstPixel + 2] = color.b;
      pixel[firstPixel + 3] = ex.Util.clamp(Math.floor(color.a * 255), 0, 255);
   }
}

class LightenEffect implements ex.Effects.ISpriteEffect {

   constructor(public amount: number) { }

   updatePixel(x: number, y: number, imageData: ImageData): void {      
      var pixelColor = Util.getColorOfPixel(imageData, x, y);
      var lightenedColor = Util.lighten(pixelColor, this.amount);

      Util.setPixelToColor(imageData, x, y, lightenedColor);      
   }
}

class SaturateEffect implements ex.Effects.ISpriteEffect {

   constructor(public amount: number) { }

   updatePixel(x: number, y: number, imageData: ImageData): void {
      var pixelColor = Util.getColorOfPixel(imageData, x, y);
      var lightenedColor = Util.saturate(pixelColor, this.amount);

      Util.setPixelToColor(imageData, x, y, lightenedColor);
   }
}