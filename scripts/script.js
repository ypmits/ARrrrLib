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

const log = require('Diagnostics').log;
const Scene = require('Scene');
const Reactive = require("Reactive");

const ARTween = require("./socialarlib").ARTween;
const ObjectFinder = require("./socialarlib").ObjectFinder;
const Delay = require("./socialarlib").Delay;
const Ease = require("./socialarlib").Ease;
const FaceGestures = require("./socialarlib").ARFaceGestures;
const CustomConsole = require("./socialarlib").CustomConsole;
const CameraLookAt = require("./socialarlib").CameraLookAt;
const Math2 = require("./socialarlib").Math2;

// ObjectFinder:
// var promise1 = ObjectFinder.find("IcoSphereHolder").then(element => {
// 	log(`[ObjectFinder test:find] Found the element: ${element}`);
// });
// var promise2 = ObjectFinder.find("IcoSphereHolder0").then(element => {
// 	log(`[ObjectFinder test:find] Found the element: ${element}`);
// });
// Promise.all([promise1, promise2]).then(v => {
// 	log(`All are good: (num:${v.length})`);
// });

ObjectFinder.find("IcoSphereHolder").then(el1 =>
{
	ObjectFinder.find("IcoSphereHolder0").then(el2 =>
	{
		el1.transform.x = Reactive.mul(el2.transform.x, Reactive.val(1));
	});
});

ObjectFinder.findAll("IcoSphere", null, true).then(elements =>
{
	// log(`[ObjectFinder test:findAll] Found ${elements.length}:`);
	for (let i = 0; i < elements.length; i++)
	{
		const element = elements[i];
		// log("    - sphere:"+element);
	}
});

// Testing the 'Tweening' and 'Delay':
// ObjectFinder.find("faceMesh").then(fm =>
// {
// 	log(`faceMesh found (name:${fm.name})! Continueing...`);
// 	fm.transform.scaleX = Reactive.val(2);
// 	fm.transform.scaleZ = Reactive.val(2);
// 	new Delay(1000, () =>
// 	{
// 		new ARTween(fm, [
// 			{ rotationZ: 360, duration: 2000 },
// 			{ scaleX: .6, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() },
// 			{ scaleY: 3, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() },
// 			{ scaleZ: 0, duration: 2000, loop: -1, yoyo: true, ease: Ease.InOutQuad() }
// 		]).onComplete(() => { log("Facemesh done animation (ARTween check!)"); });
// 	});
// });

// Testing the Custom-console:
// var background_P = ;
// var textfield_P = ;
// var button_clear_P = ObjectFinder.find("ClearButton");
// var button_to_top_P = ObjectFinder.find("ToTopButton");
// var button_up_P = ObjectFinder.find("UpButton");
// var button_down_P = ObjectFinder.find("DownButton");
// var button_to_bottom_P = ObjectFinder.find("ToBottomButton");
// log(`background:${background_P}, clear:${button_clear_P}, toTop:${button_to_top_P}, up:${button_up_P}, down:${button_down_P}, toBottom:${button_to_bottom_P}`);

var customConsole = undefined;
Promise.all([ObjectFinder.find("CustomConsoleBackground"), ObjectFinder.find("consoleTextfield")]).then(values => {
	customConsole = new CustomConsole(values[0], values[1], 16, { collapse: true, maxLines: 7, resizeText: true });
	customConsole.addClearButtonPromise( ObjectFinder.find("ClearButton") );
	customConsole.addToTopButtonPromise( ObjectFinder.find("ToTopButton") );
	customConsole.addScrollUpButtonPromise( ObjectFinder.find("UpButton") );
	customConsole.addScrollDownButtonPromise( ObjectFinder.find("DownButton"));
	customConsole.addScrollToBottomButtonPromise( ObjectFinder.find("ToBottomButton"));
}, e => { console.log("Rejections: "+e)});

// Testing the CameraLookat:
// new CameraLookAt({radius:10}).watch("IcoSphereHolder", e =>
// {
// 	customConsole.log("value: "+e.newValue);
// });
// new CameraLookAt().watch("IcoSphereHolder0", e =>
// {
// 	customConsole.log("value: "+e.newValue);
// });
// new CameraLookAt().watch("IcoSphereHolder1", e =>
// {
// 	customConsole.log("value: "+e.newValue);
// });
// new CameraLookAt().watch("IcoSphereHolder2", e =>
// {
// 	customConsole.log("value: "+e.newValue);
// });

// Scene.root.findFirst("").then(obj =>
// {
// 	let cameraLookAt = new CameraLookAt(10, true);
// 	cameraLookAt.watch(obj).monitor({ fireOnInitialValue: true }).subscribe(e =>
// 	{
// 		if (e.newValue)
// 		{
// 			console.log("object inside radius");
// 		} else
// 		{
// 			console.log("object outside radius");
// 		}
// 	});
// });
/**


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
*/








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