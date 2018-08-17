const Scene = require('Scene');

/**
 * An animatable is a wrapper that can animate a certain type of object.
 * The animations and the API is different per object-type
 * 
 * - objectType Canvas:    It can animate objects which contain basic 3D-transforms.
 * - objectType Rectangle: It can animate objects which contain basic 2D-transforms.
 * - It can animate objects which are png-sequences
 */
var Animatable = function(obj, type)
{
	this.obj = obj;
	this.type = type;
	this.ease;

	// animation stuff:
	this.driver;
	this.values;
	this.anim;
}



/**
 * type can be:
 * - position
 * - opacity
 * 
 * usage:
 * var animatable = new Animatible();
 * animatable.init("position", "inOutCubic", {x:0,y:0,z:0}, {x:0,y:0,z:0}, 1000, Inifity, false, function(){})
 */
Animatable.prototype.init = function(obj, type, ease, from, to, duration = 1000, loopCount = 0, mirror = false, funcEndCallback = undefined)
{
	this.ease = ease;
	this.from = from;
	this.to = to;
	this.repeating = repeating;
	this.mirror = mirror;
	this.funcEndCallback = funcEndCallback;
	this.endCallbackSubscription = undefined;

	// prepare code:
	var driver = Animation.timeDriver({durationMilliseconds:duration, loopCount: loopCount, mirror: mirror});
	if(funcEndCallback != undefined)
	{
		this.endCallbackSubscription = driver.onCompleted().subscribe(function(){
			funcEndCallback();
			this.endCallbackSubscription.unsubscribe();
		}.bind(tmmmhis));
	}
	var values;
	switch(ease)
	{
		case "easeIn":
			values = Animation.samplers.easeInCubic(from, to);
			break;

		case "easeOut":
			values = Animation.samplers.easeOutCubic(from, to);
			break;

		case "easeInOut":
			values = Animation.samplers.easeInOutCubic(from, to);
			break;
	}
	this.anim = Animation.animate(driver, values);
	switch (type) {
		case "position":
			this.obj.transform.x = this.anim;
			break;
		
		case "opacity":
			this.obj.transform.x = this.anim;
			break;
	}
}
Animatable.prototype.start = function()
{
	this.driver.start();
}
Animatable.prototype.stop = function()
{
	this.driver.stop();
}
Animatable.prototype.reverse = function()
{
	this.driver.reverse();	
}
Animatable.prototype.destroy = function()
{
	this.stop();
}





/** TEST */
var animatable = new Animatible("");
animatable.init("position", "inOutCubic", {x:0,y:0,z:0}, {x:0,y:0,z:0}, 1000, Inifity, false, function(){})