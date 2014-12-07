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

   // sweep mechanic
   static SweepThreshold: number = 20;
   static EnableSweepMeters: boolean = true;
   static ClearSweepMetersAfterSingleUse = true;

   // alt sweep mechanic 1
   static EnableSweeper = false;
   static SweepStartRow = 3;
   static SweepMaxRow = 7;
   static SweepAltThreshold = 20;
   static SweepAltThresholdIncrease = 5;
}