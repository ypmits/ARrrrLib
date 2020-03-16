import Locale from 'Locale';

export default class LanguageManager {
	constructor() {
		// Opzetten van de talen:
		const usedLanguages = ["en", "id", "vi", "fr"];
		const localeInfo = Locale.fromDevice;
		const localeAsArray = localeInfo.split('_');
		this.language = localeAsArray[0];
		if(!usedLanguages.includes(this.language)) this.language = "en";

		// In SparkAR zitten dan meerdere objecten voor meerdere talen. Het
		// ophalen van zo'n dynamisch object doe je dan bijvoorbeeld zo:
		this.getInternalPicture("text_share_M", "text_share_"+this.language);
	}

	getLanguage = ()=> {
		return this.language;
	}

	setLanguage = language => {
		this.language = language;
	}

	/**
	 * 
	 * @param materialString The material that will be transformed, this can be on the stage already
	 * @param textureString The string for the texture that we'll need to retreive to set as the new diffuse-texture of the earlier found material
	 */
	getInternalPicture(materialString, textureString) {
		var texture = Textures.get(textureString);
		var material = Materials.get(materialString);
		material.diffuse = texture;
	}
}