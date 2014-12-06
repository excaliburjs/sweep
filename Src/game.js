var Resources = {};
/// <reference path="../Excalibur.d.ts"/>
/// <reference path="../scripts/typings/lodash/lodash.d.ts"/>
/// <reference path="resources.ts"/>
var game = new ex.Engine(720, 480, "game");
var loader = new ex.Loader();
// load up all resources in dictionary
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
var emitter = new ex.ParticleEmitter(game.width / 2, game.height / 2, 2, 2);
emitter.emitterType = 0 /* Circle */;
emitter.radius = 5;
emitter.minVel = 100;
emitter.maxVel = 200;
emitter.minAngle = 0;
emitter.maxAngle = 6.2;
emitter.isEmitting = true;
emitter.emitRate = 474;
emitter.opacity = 0.5;
emitter.fadeFlag = true;
emitter.particleLife = 1000;
emitter.maxSize = 10;
emitter.minSize = 1;
emitter.startSize = 0;
emitter.endSize = 0;
emitter.acceleration = new ex.Vector(0, 63);
emitter.beginColor = ex.Color.Rose;
emitter.endColor = ex.Color.Cyan;
game.add(emitter);
game.start(loader).then(function () {
    // todo build game
});
//# sourceMappingURL=game.js.map