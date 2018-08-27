import TouchGestures from 'TouchGestures';
import Animation from 'Animation';
import console from '../Console';

export default class
{
	constructor(element, id, updateFunc)
	{
		this.backgroundMaterial = element.material;
		this.id = id;
		this.nb = this;
		TouchGestures.onTap(element).subscribe(updateFunc.bind(this.nb));
	}

	show()
	{
		console.log("Show");
		var driver = Animation.timeDriver({durationMilliseconds:.5, loopCount: 0, mirror: false});
		var values = Animation.samplers.easeInOutCubic(0, 1);
		this.anim = Animation.animate(driver, values);
		this.backgroundMaterial.opacity = this.anim;
		console.log(this.backgroundMaterial.opacity);
		driver.start();
	}

	hide()
	{

	}
}
