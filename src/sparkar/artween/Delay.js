const Scene = require('Scene');
import ARTween from './ARTween';
import Ease from './Ease';

export default class Delay {
	constructor(delay, completeFunction) {
		var t = new ARTween(Scene.root,[{alpha:1, duration:delay, ease:Ease.Linear()}], true).onComplete(()=>{completeFunction();});
	}
}