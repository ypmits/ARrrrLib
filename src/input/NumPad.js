import Scene from 'Scene';
import Animation from 'Animation';
import console from './../Console';

/**
 * NumPad is a container for an oldskool T9-like button-pad
 * @param {number} maxLength The maximum length of 
 */
export default class
{
	constructor(maxLength)
	{
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
		if (this.numbersArray.length > this.maxLength-1) {
			if (this.numbersArray.length > this.maxLength) {
				console.log("Error: this should never happen. Code is longer than 5 chars!")
				this.numbersArray = this.numbersArray.slice(0, 5);
			}
		}
		else
		{
			this.numbersArray.push(value);
			this.secret.currentFrame = this.numbersArray.length;
		}
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
	}
}
