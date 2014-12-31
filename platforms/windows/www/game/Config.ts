enum GameMode {
   Standard,
   Timed
}

class Config {
   static PieceContainsPadding: number = 2;
   static PieceWidth: number = 36;
   static PieceHeight: number = 36;
   static CellWidth: number = 45;
   static CellHeight: number = 45;
   static GridY: number = -10;
   static GridCellsHigh: number = 11;
   static GridCellsWide: number = 6;
   static NumStartingRows: number = 3;
   static ScoreXBuffer: number = 20;
   static MeterWidth: number = 45;
   static MeterHeight: number = 27;
   static MeterMargin: number = 8;
   static MeterRadius: number = 12;
   static MeterBorderThickness: number = 3;
   static EnableGridLines = false;
   static PolylineThickness = 5;
   static MainMenuButtonWidth = 185;
   static MainMenuButtonHeight = 62;
   static StatsScoresMargin = 8;
   static ScoreTopFontSize = 24;
   static ScoreBonusFontSize = 18;
   static ScoreTopDescSize = 14;
   static LevelFontSize = 275;
   static LevelYOffset = -210;

   // easings
   static PieceEasingFillDuration = 300;

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
   

   //
   // leveling
   //
   static EnableLevels: boolean;
   static SweepScoreMultiplierIncreasesPerLevel: boolean;
   static LevelMultiplierEndBonus = 1.05;

   static SweepScoreMultiplier: number = 2;   

   static ChainThresholdSmall: number = 8;
   static ChainThresholdMedium: number = 11;
   static ChainThresholdLarge: number = 15;

   static ChainBonusSmall: number = 5;
   static ChainBonusMedium: number = 10;
   static ChainBonusLarge: number = 25;
   static ChainBonusSuper: number = 50;

   // endurance score multiplier
   static StandardModeMultiplier: number = 10;
   static TimedModeMultiplier: number = 10;

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
      Config.SweepThreshold = 18;
      Config.EnableSweepMeters = false;
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

      Config.EnableSweepMeters = true;
      Config.EnableLevels = false;
      Config.SweepScoreMultiplierIncreasesPerLevel = false;
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