class Util {
   
   public static darken(color: ex.Color, value: number) {
      var r = color.r - (color.r * value);
      var g = color.g - (color.g * value);
      var b = color.b - (color.b * value);

      return new ex.Color(r, g, b, color.a);
   }

} 