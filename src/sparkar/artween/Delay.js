const Time = require('Time');

export default class Delay {
	constructor(delay, completeFunction) {
		Time.setTimeout(completeFunction, delay);
	}
}