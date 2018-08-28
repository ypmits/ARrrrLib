export default class {
	constructor(signal) {
		this.signal = signal;
		console.log("new SignalBinder: "+this.signal);
	}
	
	bind(bindingSignal)
	{
		this.signal = bindingSignal;
	}

	bindClamped(minSignal, maxSignal, multiplierSignal)
	{
		console.log("bindClamped:"+this.signal);
		this.signal = Reactive.sub(minSignal, maxSignal.mul(multiplierSignal));
	}

	unbind()
	{
		this.signal = null;
	}
}