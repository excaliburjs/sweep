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

   //
   // cascade configs
   //

   static resetDefault() {
      Config.EnableTimer = false;
      Config.AdvanceRowsOnMatch = true;
      Config.SweepThreshold = 15;
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
      // same as default, for now
      document.getElementById("instructions").innerHTML =
         "Take your time and prevent the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " +
         "If things get hairy, <strong>press 1-4</strong> to choose a color to SWEEP and remove them from the board. Be careful, though, all other " +
         "meters will be depleted after each use.";
   }

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
      

      document.getElementById("instructions").innerHTML =
         "Battle against the clock and stop the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " +
         "If things get hairy, press <strong>S</strong> to SWEEP everything above the sweeper line! Each time the sweeper will move " +
         "down. As time goes on, it'll cost less to earn a SWEEP so play wisely.";
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

      document.getElementById("instructions").innerHTML =
      "Battle against the clock and stop the tiles from reaching the top. <strong>Drag</strong> to chain tiles together to remove them. " +
      "If things get hairy, press <strong>S</strong> to SWEEP everything above the sweeper line! Each time the sweeper will move up. " +
      "As time goes on, it'll cost more to earn a SWEEP so play wisely.";
   }

}