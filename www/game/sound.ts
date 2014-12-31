enum SoundLevel {
   Off = 0,
   FxOnly = 1,
   All = 2
}

class SoundManager {

   private static _CookieName = "sweep-sound-level";
   private static _CurrentSoundLevel = SoundLevel.All;
   private static _SoundElement: HTMLElement;

   public static init() {
      SoundManager._SoundElement = document.getElementById("sound");
      SoundManager._SoundElement.addEventListener('click', SoundManager._handleSoundClick);

      SoundManager._setSoundLevel(SoundManager._getPreference());

      ex.Logger.getInstance().info("SoundManager: loaded preference", SoundManager._CurrentSoundLevel);      
   }

   public static playGameOver() {
      if (SoundManager._CurrentSoundLevel === SoundLevel.Off) return;

      SoundManager._stopMusic();

      Resources.GameOverSound.setVolume(.4);
      Resources.GameOverSound.play();
   }

   public static startLoop() {
      if (SoundManager._CurrentSoundLevel === SoundLevel.Off) return;

      SoundManager._startMusic();

      // play some sounds
      if (gameMode === GameMode.Standard) {
         Resources.KnockSound.setVolume(.5);
         Resources.TapsSound.setVolume(.2);
         Resources.SweepSound.setVolume(.4);
         Resources.MegaSweepSound.setVolume(.4);         
      }
   }

   private static _setSoundLevel(level: SoundLevel) {
      if (SoundManager._CurrentSoundLevel === level) return;

      SoundManager._setPreference(level);
      SoundManager._setIconState(level);

      switch(level) {
         case SoundLevel.All:
            SoundManager._setVolume(1);
            SoundManager.startLoop();            
            break;
         case SoundLevel.FxOnly:
            SoundManager._stopMusic();
            break;
         default:
            SoundManager._stopMusic();  
            SoundManager._setVolume(0);     
      }

      ex.Logger.getInstance().info("Set sound level", level);
   }

   private static _startMusic() {
      if (SoundManager._CurrentSoundLevel !== SoundLevel.All) return;

      SoundManager._stopMusic();

      if (gameMode === GameMode.Standard) {
         Resources.LoopSound.setLoop(true);
         Resources.LoopSound.play();
      } else {
         Resources.ChallengeLoopSound.setLoop(true);
         Resources.ChallengeLoopSound.setVolume(.5);
         Resources.ChallengeLoopSound.play();
      }
   }

   private static _stopMusic() {
      Resources.LoopSound.stop();
      Resources.ChallengeLoopSound.stop();
   }

   private static _setVolume(volume: number) {
      for (var r in Resources) {
         if (Resources[r] instanceof ex.Sound) {
            Resources[r].setVolume(volume);
         }
      }
   }

   private static _getPreference(): SoundLevel {
      var c = Cookies.get(SoundManager._CookieName);
      var n = -1;

      if (typeof c !== "undefined" && (n = parseInt(c, 10)) >= 0) {
         return n;
      }

      return SoundLevel.All;
   }

   private static _setPreference(level: SoundLevel) {
      if (Cookies.enabled) {
         Cookies.set(SoundManager._CookieName, level, { expires: '2020-01-01' });
      }

      SoundManager._CurrentSoundLevel = level;
   }

   private static _handleSoundClick() {
      
      switch(SoundManager._getIconState()) {
         case SoundLevel.All:
            SoundManager._setSoundLevel(SoundLevel.FxOnly);
            break;
         case SoundLevel.FxOnly:
            SoundManager._setSoundLevel(SoundLevel.Off);
            break;
         default:
            SoundManager._setSoundLevel(SoundLevel.All);
      }

   }

   private static _getIconState(): SoundLevel {
      
      if ($(SoundManager._SoundElement).hasClass('fa-volume-up')) {
         return SoundLevel.All;
      } else if ($(SoundManager._SoundElement).hasClass('fa-volume-down')) {
         return SoundLevel.FxOnly;
      } else {
         return SoundLevel.Off;
      }
   }

   private static _setIconState(level: SoundLevel) {

      $(SoundManager._SoundElement).removeClass("fa-volume-down");
      $(SoundManager._SoundElement).removeClass("fa-volume-up");
      $(SoundManager._SoundElement).removeClass("fa-volume-off");

      switch (level) {
         case SoundLevel.Off:
            $(SoundManager._SoundElement).addClass('fa-volume-off');
            break;
         case SoundLevel.FxOnly:
            $(SoundManager._SoundElement).addClass('fa-volume-down');
            break;
         case SoundLevel.All:
            $(SoundManager._SoundElement).addClass('fa-volume-up');
            break;
      }
   }
}