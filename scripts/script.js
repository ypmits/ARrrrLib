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
		console.log("Facemesh done animation (ARTween check!)");
	});
});

customConsole = new CustomConsole(Scene.root.find("CustomConsoleBackground"), Scene.root.find("consoleTextfield"), 16, {collapse:true, maxLines:7, resizeText:true});
customConsole.addButton(Scene.root.find("ClearButton"), customConsole.clear);
customConsole.addButton(Scene.root.find("ToTopButton"), customConsole.scrollToTop);
customConsole.addButton(Scene.root.find("UpButton"), customConsole.scrollUp);
customConsole.addButton(Scene.root.find("DownButton"), customConsole.scrollDown);
customConsole.addButton(Scene.root.find("ToBottomButton"), customConsole.scrollToBottom);


// Boolean:
var faceID = 0;
var useEyebrowsFrowned = false;
var useEyebrowsRaised = false;
var useLeftEyeClosed = false;
var useRightEyeClosed = false;
var useMouthOpen = false;
// Eventsource:
var useSmile = true;
var useSurprised = true;
var useShake = true;
var useNod = true;
var useBlink = true;


// Boolean:
var eyebrowsfrowned = new FaceG.EyebrowsFrowned(faceID, () => customConsole.log("Eyebrows Frowned! Yay!"), () => customConsole.log("Eyebrows not Frowned any more :("));
var eyebrowsraised = new FaceG.EyebrowsRaised(faceID, () => customConsole.log("Eyebrows Raised! Yay!"), () => customConsole.log("Eyebrows not Raised any more :("));
var lefteyeclosed = new FaceG.LeftEyeClosed(faceID, () => customConsole.log("Left eye closed"), () => customConsole.log("Left eye open!"));
var righteyeclosed = new FaceG.RightEyeClosed(faceID, () => customConsole.log("Right eye closed"), () => customConsole.log("Right eye open!"));
var mouthopen = new FaceG.MouthOpen(faceID, () => customConsole.log("Mouth opened!"), () => customConsole.log("Mouth closed!"));
// Eventsource:
var smiling = new FaceG.Smile(faceID, () => customConsole.log("Start smiling! :)"), () => customConsole.log("STOP smiling! :("));
var surprised = new FaceG.Surprised(faceID, () => customConsole.log("Surprised!"), () => customConsole.log("Not surprised."));
var shake = new FaceG.Shake(faceID, () => customConsole.log("Shaking head!"));
var nod = new FaceG.Nod(faceID, () => customConsole.log("Nod head!"));
var blink = new FaceG.Blink(faceID, () => customConsole.log("Blink!"));


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