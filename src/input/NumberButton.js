import Animation from 'Animation';
import R from 'Reactive';
import console from '../Console';

export default class
{
	constructor(element, id)
	{
		this.id = id;
		
		this.backgroundMaterial = element.material;
		this.glow = element.find("Glow");
		this.number = element.find("Number");
		this.glow.material.opacity = 0;
		// this.backgroundMaterial.opacity = 0;
		// this.number.material.opacity = 0;
	}

	show()
	{
		console.log("Show");
		var driver = Animation.timeDriver({durationMilliseconds:500, loopCount: 0, mirror: false});
		var values = Animation.samplers.easeInOutCubic(0, 1);
		this.anim = Animation.animate(driver, values);

		driver.start();
	}

	hide()
	{

	}

	/**
	 * The function to call when a user types
	 */
	doType()
	{
		this.glow.material.opacity = 1;
		var driver = Animation.timeDriver({durationMilliseconds:150, loopCount: 1, mirror: false});
		var values = Animation.samplers.easeOutCubic(1, 0);
		var anim = Animation.animate(driver, values);
		this.glow.material.opacity = anim;
		driver.start();
		// return this.id;
	}
}
