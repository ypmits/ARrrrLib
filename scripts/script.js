/**
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 * WARNING! Make sure that all the used libraries (except for the standard
 * Spark-AR libraries) are explicitly added as a 'script' inside SparkAR!
 * Otherwise you might get errors similar like:
 * 
 * JavaScript error: TypeError: Result of expression 'require('./Math2')' [undefined] is not an object.
 * 
 * Scripting Basics - https://fb.me/spark-scripting-basics
 * Reactive Programming - https://fb.me/spark-reactive-programming
 * Scripting Object Reference - https://fb.me/spark-scripting-reference
 * Changelogs - https://fb.me/spark-changelog
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 */
const console = require('Diagnostics');
const Animation = require('Animation');
const FaceTracking = require('FaceTracking');
const Scene = require('Scene');
const Reactive = require("Reactive");
const Tweener = require("./socialarlib").ARTween;
const Delay = require("./socialarlib").Delay;
const Ease = require("./socialarlib").Ease;
const Smile = require("./socialarlib");
const Math2 = require("./socialarlib").Math2;

var rect = Scene.root.find("rect");
var facemesh = Scene.root.find("faceMesh");
facemesh.transform.scaleX = Reactive.val(2);
facemesh.transform.scaleZ = Reactive.val(2);


new Delay(1000, () => {
	console.log("Let's start the face-stuff!");
	new Tweener(facemesh, [
		{rotationZ: 360, duration: 2000},
		{scaleX: .6, duration: 2000, loop:-1, yoyo:true, ease:Ease.InOutQuad()},
		{scaleY: 3, duration: 2000, loop:-1, yoyo:true, ease:Ease.InOutQuad()},
		{scaleZ: 0, duration: 2000, loop:-1, yoyo:true, ease:Ease.InOutQuad()}
	]).onComplete(function(){
		console.log("Done!"+Ease.InBack());
	});
});


var smiling = new FG.ARSmile(0, ()=>{
	console.log("Start smiling! :)");
}, ()=>{
	console.log("STOP smiling! :(");
});
smiling.start();



var shake = new FG.ARShake(0, ()=>{ console.log("Shake it baby!");});
shake.start();


new Delay(3000, () => {
	smiling.stop();
	console.log("Stopping the smile and let's start the UI-rectangle-stuff!");
	console.log("45 degrees is "+Math2.deg2rad(45)+" in radians");
	// new Tweener(rect, [
	// 	{rotationZ:360, duration:5000, loop:-1, ease:Ease.Linear()}
	// ], true);

	const mouthOpenness = FaceTracking.face(0).mouth.openness;
	const linearSampler = Animation.samplers.linear(1, 2);
	const mouthOpennessDriver = Animation.valueDriver(mouthOpenness, 0.1, 0.6);
	const scaleAnimation = Animation.animate(mouthOpennessDriver, linearSampler);

	// Bind the scale animation signal to the y-axis scale signal of the plane
	rect.transform.scaleY = scaleAnimation;
})