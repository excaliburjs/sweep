class Config {
   static gameWidth: number = 720;
   static gameHeight: number = 720;
   static PieceContainsPadding: number = 5;
   static PieceWidth: number = 36;
   static PieceHeight: number = 36;
   static CellWidth: number = 45;
   static CellHeight: number = 45;
   static GridCellsHigh: number = 12;
   static GridCellsWide: number = 6;
   static NumStartingRows: number = 3;
   static ScoreXBuffer: number = 20;
   static MeterWidth: number = 90;
   static MeterHeight: number = 30;

   //
   // game modes
   //

   // sweep mechanic
   static SweepThreshold: number;
   static EnableSweepMeters: boolean;
   static ClearSweepMetersAfterSingleUse: boolean;

   // alt sweep mechanic 1
   static EnableSweeper: boolean;
   static SweepMovesUp: boolean;
   static SweepStartRow: number;
   static SweepMaxRow: number;
   static SweepAltThreshold: number;
   static SweepAltThresholdIncrease: number;

   //
   // cascade configs
   //

   static resetDefault() {
      Config.SweepThreshold = 20;
      Config.EnableSweepMeters = true;
      Config.ClearSweepMetersAfterSingleUse = true;

      Config.EnableSweeper = false;
      Config.SweepMovesUp = false;
      Config.SweepStartRow = 3;
      Config.SweepMaxRow = 7;
      Config.SweepAltThreshold = 20;
      Config.SweepAltThresholdIncrease = 5;
   }

   static loadCasual() {
      // same as default, for now
   }

   static loadSurvival() {
      Config.EnableSweepMeters = false;

      Config.EnableSweeper = true;
      Config.SweepMovesUp = false;
      Config.SweepStartRow = 3;
      Config.SweepMaxRow = Config.GridCellsHigh - 6;
      Config.SweepAltThreshold = 20;
      Config.SweepAltThresholdIncrease = 5;
   }

   static loadSurvivalReverse() {
      Config.EnableSweeper = true;
      Config.SweepMovesUp = true;
      Config.SweepStartRow = Config.GridCellsHigh - 2;
      Config.SweepMaxRow = 3;
      Config.SweepAltThreshold = 20;
      Config.SweepAltThresholdIncrease = 5;
   }

}