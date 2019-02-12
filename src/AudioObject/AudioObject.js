import Scene from 'Scene';
import Audio from 'Audio';


/**
 * The AudioObject is a container for an audioSource. It keeps the audiosource contained so it can
 * always be called again and it doesn't have to be looked with Scene.root.find(...) or something similar
 * @param {string} audioName The name to find in the scene
 * @param {bool} autoplay If the audio should be played after it's initated
 */
export default class {
	constructor(speakerName, playbackControllerName, autoplay)
	{
		this.speaker = Scene.root.find(speakerName);
		this.controller = Audio.getPlaybackController(playbackControllerName);
		this.speaker.audio = this.controller;
		if(autoplay != undefined && autoplay) this.play();
	}

	pause()
	{
		this.controller.pause();
	}
	
	play()
	{
		this.controller.play();
	}

	/**
	 * 
	 * @param {string} soundName The name of the Asset inside 'Assets
	 */
	playSound(soundName)
	{
		this.controller.audio = Audio.soundName;
		this.speaker.audio = this.controller;
		this.controller.play();
	}
	
	stop()
	{
		this.controller.stopAll();
	}
}