import Scene from 'Scene';
import console from 'Console';

/**
 * DeviceInfo provides some basic information about the device,
 * it needs a reference to a canvas inside AR-Studio to do so.
 */
export default class {
	/**
	 * Create an info class.
	 */
	constructor(canvasName) {
		var canvas = Scene.root.find(canvasName);
		if(canvas == undefined) throw new Error("No canvas for getting 'device-information' found!");
		this.screenWidthSignal = canvas.width;
		this.screenHeightSignal = canvas.height;
	}
	/**
	 * Get the screen width.
	 * @return {number} The screen width in pixels.
	 */
	getScreenWidth()
	{
		return this.screenWidthSignal.lastValue;
	}
	/**
	 * Get the screen height.
	 * @return {number} The screen height in pixels.
	 */
	getScreenHeight()
	{
		return this.screenHeightSignal.lastValue;
	}

	toString()
	{
		console.log("Canvas found! device-width:"+this.screenWidthSignal.lastValue+" device-height:"+this.screenHeightSignal.lastValue);
	}
}
