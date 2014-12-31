class Effects {

   public clearEffect(piece: Piece) {

      //TODO move emitter to Cell
      var emitter = new ex.ParticleEmitter(piece.x, piece.y, 1, 1);
      emitter.minVel = 30;
      emitter.maxVel = 125;
      emitter.minAngle = Math.PI / 4;
      emitter.maxAngle = (Math.PI * 3) / 4;
      emitter.isEmitting = false;
      emitter.emitRate = 5;
      emitter.opacity = 0.84;
      emitter.fadeFlag = true;
      emitter.particleLife = 1000;
      emitter.maxSize = 0.4;
      emitter.minSize = 0.2;
      emitter.acceleration = new ex.Vector(0, -500);
      emitter.beginColor = ex.Color.Red;
      emitter.endColor = ex.Color.Yellow;
      emitter.startSize = gameScale.x * 0.5;
      emitter.endSize = 0.01;
      emitter.particleSprite = (<ex.Sprite>piece.currentDrawing).clone();
      emitter.particleSprite.transformAboutPoint(new ex.Point(.5, .5));
      emitter.particleRotationalVelocity = Math.PI / 10;
      emitter.randomRotation = true;
      emitter.fadeFlag = true;
      emitter.focus = new ex.Vector(0, emitter.y - 1000); // relative to the emitter
      emitter.focusAccel = 900;

      game.addChild(emitter);

      emitter.emit(5);
      emitter.moveTo(emitter.x + 3, emitter.y + 1, 1).die();
   }
}