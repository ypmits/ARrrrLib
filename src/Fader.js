import Animation from 'Animation';
import Time from 'Time';
import Ease from './../../FARLib/src/Ease';

/**
 * Fades the opacity of a material in- and out with a simple 'show' and 'hide' function
 * Example:
 * import 'Fader' from 'Fader';
 * 
 * var f = new Fader(Scene.root.find("rectangle").material, 500);
 * f.show(duration, delay); // You can override the duration and the delay in this function
 * f.hide(duration, delay); // You can override the duration and the delay in this function
 * 
 * NOTE:
 * You cannot fade in a text-function. Somehow you cannot call the material-function on the text-object to fade.
 * If you want to fade that material you have to do a 'Materials.getTexture("textureName")' to do that.
 */
export default class
{
	constructor(material, duration, delay)
	{
		this.material = material;
		this.opacity = 0;
		this.material.opacity = this.opacity;
		this.duration = (duration != undefined && duration > 0) ? duration : 0;
		this.delay = (delay != undefined && delay > 0) ? delay : 0;
		this.ease = Ease.InOutCubic;
	}

	/**
	 * Shows the opacity of a material
	 * @param {number} duration Overrides the time set in the constructor. The time in milliseconds it takes to animate the animation from start to end
	 * @param {*} delay Overrides the delay in the constructor. The time (in milliseonds) before the show-animation starts
	 */
	show(duration, delay, ease)
	{
		this.material.opacity = 0;
		this.duration = (duration != undefined && duration > 0) ? duration : this.duration;
		this.delay = (delay != undefined && delay > 0) ? delay : this.delay;
		this.ease = (ease != undefined && ease != Ease.easeInOutCubic) ? ease : this.ease;
		
		this.driver = Animation.timeDriver({durationMilliseconds:this.duration, loopCount: 1, mirror: false});
		this.values = Animation.samplers[this.ease](this.opacity, 1);
		this.anim = Animation.animate(this.driver, this.values);

		if(this.delay && this.delay > 0)
		{
			Time.setTimeout(
				function () { 
					this.material.opacity = this.anim;
					if(this.driver != undefined) this.driver.reset();
					this.driver.start();
				}.bind(this), this.delay);
		} else {
			this.material.opacity = this.anim;
			if(this.driver != undefined) this.driver.reset();
			this.driver.start();
		}
		this.opacity = 1;
	}

	/**
	 * Hides the opacity of a material
	 * @param {number} duration The time (in milliseconds) it takes to animate the animation from start to end
	 * @param {*} delay The time (in milliseonds) before the animation starts
	 */
	hide(duration, delay, ease)
	{
		this.material.opacity = 1;
		this.duration = (duration != undefined && duration > 0) ? duration : this.duration;
		this.delay = (delay != undefined && delay > 0) ? delay : this.delay;
		this.ease = (ease != undefined && ease != Ease.easeInOutCubic) ? ease : this.ease;

		this.driver = Animation.timeDriver({durationMilliseconds:this.duration, loopCount: 1, mirror: false});
		this.values = Animation.samplers[this.ease](this.opacity, 0);
		this.anim = Animation.animate(this.driver, this.values);

		if(this.delay && this.delay > 0)
		{
			Time.setTimeout(
				function () { 
					this.material.opacity = this.anim;
					if(this.driver != undefined) this.driver.reset();
					this.driver.start();
				}.bind(this), this.delay);
		} else {
			this.material.opacity = this.anim;
			if(this.driver != undefined) this.driver.reset();
			this.driver.start();
		}
		this.opacity = 0;
	}

	toString() {
        return `	--== MaterialFader[materialName:${this.material.name}, opacity=${this.opacity}, duration=${this.duration}, delay:${this.delay}]`+"	==--\n";
    }
}