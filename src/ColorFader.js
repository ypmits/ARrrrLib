import Animation from 'Animation';
import Time from 'Time';


/**
 * Fades the opacity of a material in- and out with a simple 'show' and 'hide' function
 * Example:
 * import 'CFader' from 'ColorFader';
 * 
 * var f = new CFader(Scene.root.find("rectangle").color, 500);
 * f.show(); // You can override the duration and the delay
 * f.hide(); // You can override the duration and the delay
 */
export default class
{
	constructor(color, duration, delay)
	{
		this.color = color;
		this.color.opacity = 0;
		this.duration = (duration != undefined && duration > 0) ? duration : 0;
		this.delay = (delay != undefined && delay > 0) ? delay : 0;
	}

	/**
	 * Shows the opacity of a color
	 * @param {number} duration Overrides the time set in the constructor. The time in milliseconds it takes to animate the animation from start to end
	 * @param {*} delay Overrides the delay in the constructor. The time (in milliseonds) before the show-animation starts
	 */
	show(duration, delay)
	{
		this.color.opacity = 0;
		this.duration = (duration != undefined && duration > 0) ? duration : this.duration;
		this.delay = (delay != undefined && delay > 0) ? delay : this.delay;

		this.driver = Animation.timeDriver({durationMilliseconds:this.duration, loopCount: 1, mirror: false});
		this.values = Animation.samplers.easeInOutCubic(0, 1);
		this.anim = Animation.animate(this.driver, this.values);

		if(this.delay && this.delay > 0)
		{
			Time.setTimeout(
				function () { 
					this.color.opacity = this.anim;
					this.driver.start();
				}.bind(this), this.delay);
		} else {
			this.material.opacity = this.anim;
			this.driver.start();
		}
	}

	/**
	 * Hides the opacity of a color
	 * @param {number} duration The time (in milliseconds) it takes to animate the animation from start to end
	 * @param {*} delay The time (in milliseonds) before the animation starts
	 */
	hide(duration, delay)
	{
		this.color.opacity = 1;
		this.duration = (duration != undefined && duration > 0) ? duration : this.duration;
		this.delay = (delay != undefined && delay > 0) ? delay : this.delay;

		this.driver = Animation.timeDriver({durationMilliseconds:this.duration, loopCount: 1, mirror: false});
		this.values = Animation.samplers.easeInOutCubic(1, 0);
		this.anim = Animation.animate(this.driver, this.values);

		if(this.delay && this.delay > 0)
		{
			Time.setTimeout(
				function () { 
					this.color.opacity = this.anim;
					this.driver.start();
				}.bind(this), this.delay);
		} else {
			this.color.opacity = this.anim;
			this.driver.start();
		}
	}
}