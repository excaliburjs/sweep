class Util {
   
   public static darken(color: ex.Color, amount: number) {
      var r = Math.floor(color.r - (color.r * amount));
      var g = Math.floor(color.g - (color.g * amount));
      var b = Math.floor(color.b - (color.b * amount));

      return new ex.Color(r, g, b, color.a);
   }

   public static lighten(color: ex.Color, amount: number) {
      var r = Math.min(255, Math.floor(color.r + (255 * amount)));
      var g = Math.min(255, Math.floor(color.g + (255 * amount)));
      var b = Math.min(255, Math.floor(color.b + (255 * amount)));

      return new ex.Color(r, g, b, color.a);
   }
} 