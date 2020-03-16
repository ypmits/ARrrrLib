/**
 * DeviceInfo provides some basic information about the device,
 * it needs a reference to a canvas inside AR-Studio to do so.
 */
export default class DeviceInfo {
	/**
	 * Create an info class.
	 */
	constructor(canvas) {
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
		return this.screenWidthSignal.pinLastValue();
	}
	/**
	 * Get the screen height.
	 * @return {number} The screen height in pixels.
	 */
	getScreenHeight()
	{
		return this.screenHeightSignal.pinLastValue();
	}

	test()
	{
		return "Canvas found! device-width:"+this.screenWidthSignal.lastValue+" device-height:"+this.screenHeightSignal.lastValue;
	}
}
