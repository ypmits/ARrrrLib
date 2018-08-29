import Scene from 'Scene';
import Animation from 'Animation';
import console from './../Console';
// import HttpRequestCode from './../HttpRequestCode';

/**
 * NumPad is a container for an oldskool T9-like button-pad
 * @param {number} maxLength The maximum length of 
 */
export default class
{
	constructor(sceneObject, maxLength)
	{
		this.secret = Scene.root.find("Secret").material.diffuse;
		this.secret.currentFrame = 0;
		this.numbersArray = [];

		this.sceneObject = sceneObject;
		this.sceneObject.hidden = false;
		this.useTextfield = false;
		this.maxLength = maxLength;
	}

	/**
	 * Adds a character to the textfield
	 * @param {string} value The value that needs to be added to the textfield
	 * @param {AudioObject} soundOK This is the AudioObject that will be played when the value is added correctly
	 * @param {AudioObject} soundWrong This is the AudioObject that will be played when the value cannot be added (when the textfield-content is too long f.i.)
	 */
	add(value, soundOK, soundWrong)
	{
		// if (this.maxLength) {
		// 	if (soundWrong != undefined) soundWrong.play();
		// 	return;
		// }
		// if (soundOK != undefined) soundOK.play();
		
		if (this.numbersArray.length > this.maxLength-1) {
			console.log("ARRAY: " + this.numbersArray);


			var canvasKeyboard = Scene.root.find("canvasKeyboard");
			canvasKeyboard.hidden = true;

			if (this.numbersArray.length > this.maxLength) {
				console.log("Error: this should never happen. Code is longer than 5 chars!")
				this.numbersArray = this.numbersArray.slice(0, 5);
			}

			// var userTypedCodeFormatted = this.numbersArray.toString().replace(/,/g,"");
			// // var userTypedCodeFormatted = userTypedCode
			// console.log(userTypedCodeFormatted);


			// var img = new HttpRequestCode(userTypedCodeFormatted);
			// console.log(img);

			// temporary code to fix horrible bugs in the prototype, delete asap!!	
			var faceTrackerCanvas = Scene.root.find("facetracker");
			faceTrackerCanvas.hidden = false;

		}
		else
		{
			this.numbersArray.push(value);
			this.secret.currentFrame = this.numbersArray.length;
			// console.log(this.numbersArray);
			// console.log(this.secret.currentFrame);
		}


		// this.t += value;
		// this.textfield.text = this.t;
	}

	/**
	 * Removes the last character if the total length is larger than 0
	 * @param {AudioObject} sound This is the AudioObject that will be played when the function is called
	 */
	removeLast(element, sound) {

		this.backgroundMaterial = element.material;
		this.glow = element.find("Glow");
		this.number = element.find("Number");

		this.glow.material.opacity = 1;
		var driver = Animation.timeDriver({durationMilliseconds:150, loopCount: 1, mirror: false});
		var values = Animation.samplers.easeOutCubic(1, 0);
		var anim = Animation.animate(driver, values);
		this.glow.material.opacity = anim;
		driver.start();

		this.numbersArray.pop();
		this.secret.currentFrame = this.numbersArray.length;
		// console.log(this.numbersArray);
		// console.log(this.secret.currentFrame);

		// if (this.t.length <= 0) return;
		// if (sound != undefined) sound.play();
		// this.t = this.t.substr(0, this.t.length - 1);
		// this.textfield.text = this.t;
	}

	/**
	 * Removes all characters if the total length is larger than 0
	 * @param {AudioObject} sound This is the AudioObject that will be played when the function is called
	 */
	removeAll(element, sound) {
		this.backgroundMaterial = element.material;
		this.glow = element.find("Glow");
		this.number = element.find("Number");

		this.glow.material.opacity = 1;
		var driver = Animation.timeDriver({durationMilliseconds:150, loopCount: 1, mirror: false});
		var values = Animation.samplers.easeOutCubic(1, 0);
		var anim = Animation.animate(driver, values);
		this.glow.material.opacity = anim;
		driver.start();

		this.numbersArray = [];		
		this.secret.currentFrame = 0;
		// console.log(this.numbersArray);
		// console.log(this.secret.currentFrame);

		// if (this.t.length <= 0) return;
		// if (sound != undefined) sound.play();
		// this.t = "";
		// this.textfield.text = this.t;
	}
}
