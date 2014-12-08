enum GameMode {
   Standard,
   Timed
}

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
   static EnableGridLines = false;
   static PolylineThickness = 5;
   static MainMenuButtonWidth = 185;
   static MainMenuButtonHeight = 62;

   //
   // game modes
   //
   static EnableTimer: boolean;
   static EnableSingleTapClear: boolean;
   static TimerValue: number;
   static AdvanceRowsOnMatch: boolean;

   // sweep mechanic
   static SweepThreshold: number;
   static EnableSweepMeters: boolean;
   static ClearSweepMetersAfterSingleUse: boolean;

   // alt sweep mechanic 1
   static EnableSweeper: boolean;
   static SweepMovesUp: boolean;
   static SweepMinRow: number;
   static SweepMaxRow: number;
   static SweepAltThreshold: number;
   static SweepAltThresholdDelta: number;
   static SweepAltMinThreshold: number;
   static SweepAltMaxThreshold: number;

   static SweepShakeDuration: number = 400;
   static MegaSweepShakeDuration: number = 500;
   static MegaSweepDelay: number = 600;

   //
   // cascade configs
   //

   static resetDefault() {
      Config.EnableTimer = false;
      Config.AdvanceRowsOnMatch = true;
      Config.SweepThreshold = 4;
      Config.EnableSweepMeters = true;
      Config.EnableSingleTapClear = false;
      Config.ClearSweepMetersAfterSingleUse = true;

      Config.EnableSweeper = false;
      Config.SweepMovesUp = false;
      Config.SweepMinRow = 3;
      Config.SweepMaxRow = Config.GridCellsHigh - 6;
      Config.SweepAltThreshold = 20;
      Config.SweepAltThresholdDelta = 5;
      Config.SweepAltMinThreshold = 10;
      Config.SweepAltMaxThreshold = 50;
   }

   static loadCasual() {
      gameMode = GameMode.Standard;
   }

   /**
    * @obsolete
    */
   static loadSurvival() {
      Config.EnableTimer = true;
      Config.AdvanceRowsOnMatch = false;
      Config.TimerValue = 1000;
      Config.EnableSingleTapClear = true;
      Config.EnableSweepMeters = false;      
      Config.EnableSweeper = true;
      Config.SweepMovesUp = false;
      Config.SweepMinRow = 3;
      Config.SweepMaxRow = Config.GridCellsHigh - 6;
      Config.SweepAltThreshold = 20;
      Config.SweepAltThresholdDelta = 5;
      Config.SweepAltMinThreshold = 10;
      Config.SweepAltMaxThreshold = 50;     
   }

   static loadSurvivalReverse() {
      gameMode = GameMode.Timed;
      Config.EnableTimer = true;
      Config.AdvanceRowsOnMatch = false;
      Config.TimerValue = 1500;
      Config.EnableSingleTapClear = true;
      Config.EnableSweepMeters = false;
      Config.EnableSweeper = true;
      Config.SweepMovesUp = true;
      Config.SweepMinRow = 3;
      Config.SweepMaxRow = Config.GridCellsHigh - 2;
      Config.SweepAltThreshold = 50;
      Config.SweepAltThresholdDelta = 5;
      Config.SweepAltMinThreshold = 10;
      Config.SweepAltMaxThreshold = 50;
   }

}