/**
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * WARNING! Make sure that all the used libraries (except for the standard
 * Spark-AR libraries) are explicitly added as a 'script' inside SparkAR!
 * Otherwise you might get errors similar like:
 * 
 * JavaScript error: TypeError: Result of expression 'require('./Math2')'
 * [undefined] is not an object.
 * 
 * Scripting Basics - https://fb.me/spark-scripting-basics
 * Reactive Programming - https://fb.me/spark-reactive-programming
 * Scripting Object Reference - https://fb.me/spark-scripting-reference
 * Changelogs - https://fb.me/spark-changelog
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */


const console = require('Diagnostics');
const Scene = require('Scene');
const Reactive = require("Reactive");

const ARTween = require("./socialarlib").ARTween;
const Delay = require("./socialarlib").Delay;
const Ease = require("./socialarlib").Ease;
const FaceG = require("./socialarlib").ARFaceGestures;
const CustomConsole = require("./socialarlib").CustomConsole;
const Math2 = require("./socialarlib").Math2;

var facemesh = Scene.root.find("faceMesh");
facemesh.transform.scaleX = Reactive.val(2);
facemesh.transform.scaleZ = Reactive.val(2);
var customConsole = null;


new Delay(1000, () =>
{
	new ARTween(facemesh, [
		{ rotationZ: 360, duration: 2000 },
		{ scaleX: .6, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() },
		{ scaleY: 3, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() },
		{ scaleZ: 0, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() }
	]).onComplete(function ()
	{
		console.log("Done!" + Ease.InBack());
	});
	customConsole = new CustomConsole(Scene.root.find("consoleTextfield"));
});


// Boolean:
var faceID = 0;
var useEyebrowsFrowned = false;
var useEyebrowsRaised = true;
var useLeftEyeClosed = false;
var useRightEyeClosed = false;
var useMouthOpen = true;
// Eventsource:
var useSmile = false;
var useSurprised = false;
var useShake = false;
var useNod = false;
var useBlink = false;











// Boolean:
var eyebrowsfrowned = new FaceG.EyebrowsFrowned(faceID, () => console.log("Eyebrows Frowned! Yay!"), () => console.log("Eyebrows not Frowned any more :("));
var eyebrowsraised = new FaceG.EyebrowsRaised(faceID, () => console.log("Eyebrows Raised! Yay!"), () => console.log("Eyebrows not Raised any more :("));
var lefteyeclosed = new FaceG.LeftEyeClosed(faceID, () => console.log("Left eye closed"), () => console.log("Left eye open!"));
var righteyeclosed = new FaceG.RightEyeClosed(faceID, () => console.log("Right eye closed"), () => console.log("Right eye open!"));
var mouthopen = new FaceG.MouthOpen(faceID, () => console.log("Mouth opened!"), () => console.log("Mouth closed!"));
// Eventsource:
var smiling = new FaceG.Smile(faceID, () => console.log("Start smiling! :)"), () => console.log("STOP smiling! :("));
var surprised = new FaceG.Surprised(faceID, () => console.log("Surprised!"), () => console.log("Not surprised."));
var shake = new FaceG.Shake(faceID, () => console.log("Shaking head!"));
var nod = new FaceG.Nod(faceID, () => console.log("Nod head!"));
var blink = new FaceG.Blink(faceID, () => console.log("Blink!"));



if (useEyebrowsFrowned) eyebrowsfrowned.start();
if (useEyebrowsRaised) eyebrowsraised.start();
if (useLeftEyeClosed) lefteyeclosed.start();
if (useRightEyeClosed) righteyeclosed.start();
if (useMouthOpen) mouthopen.start();
if (useSmile) smiling.start();
if (useSurprised) surprised.start();
if (useShake) shake.start();
if (useNod) nod.start();
if (useBlink) blink.start();









// new Delay(3000, () => {
// 	smiling.stop();
// 	console.log("Stopping the smile and let's start the UI-rectangle-stuff!");
// 	console.log("45 degrees is "+Math2.deg2rad(45)+" in radians");
// 	// new Tweener(rect, [
// 	// 	{rotationZ:360, duration:5000, loop:-1, ease:Ease.Linear()}
// 	// ], true);

// 	const mouthOpenness = FaceTracking.face(0).mouth.openness;
// 	const linearSampler = Animation.samplers.linear(1, 2);
// 	const mouthOpennessDriver = Animation.valueDriver(mouthOpenness, 0.1, 0.6);
// 	const scaleAnimation = Animation.animate(mouthOpennessDriver, linearSampler);

// 	// Bind the scale animation signal to the y-axis scale signal of the plane
// 	rect.transform.scaleY = scaleAnimation;
// })