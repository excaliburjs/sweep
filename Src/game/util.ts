class Util {
   
   public static darken(color: ex.Color, value: number) {
      var r = Math.floor(color.r - (color.r * value));
      var g = Math.floor(color.g - (color.g * value));
      var b = Math.floor(color.b - (color.b * value));

      return new ex.Color(r, g, b, color.a);
   }

} 