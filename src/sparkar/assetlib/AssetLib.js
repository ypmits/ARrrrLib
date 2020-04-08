/**
 * Ported from SparkAR-AssetsLoader by Data Sapiens
 * https://github.com/data-sapiens/SparkAR-AssetsLoader
 */

const Scene = require('Scene');
const Diagnostics = require('Diagnostics');
const Materials = require('Materials');
const Textures = require('Textures');


export class AssetLib {

	/**
	 * The AssetLib can be used to retrieve a set of scene objects, materials and textures
	 * ahead of running the application, so that no async operations like findFirst 
	 * need to happen in other parts of the application.
	 * 
	 * @example
	 * import { assetLib } from './AssetLib';
	 * 
	 * const sceneObjectNames = ["sceneObject1, sceneObject2"];
	 * const materialNames = ["material1, material2"];
	 * const textureNames = ["texture1, texture2"]; 
	 * 
	 * assetLib.load(sceneObjectNames, materialNames, textureNames)
	 *    .then(assets => {
     *       // All assets are loaded, 
     *       // start your application logic here.
     * 
     *       // ...
	 * 
	 * 		 // Retrieve your assets right here:
	 * 		 assets.sceneObjects["sceneObject1"];
	 * 		 assets.materials["material"];
	 * 		 assets.textures["texture1"];
     * 
     *       // Or, from anywhere in your application, you 
     *       // can use these methods to retrieve the 
     *       // assets you loaded:
     *       assetLib.getSceneObject("sceneObject1");
     *       assetLib.getMaterial("material1");
     *       assetLib.getTexture("texture1");
     *    });
	 * 
	 * @constructor
	 * @param {boolean} [storeUsedAssetNames=false] storeUsedAssetNames Set this to true to 
	 * automatically generate a list of asset names that are retrieved from the AssetLib in 
	 * a running application. These will be stored in assetLib.usedAssetNames. It can be used 
	 * to aide in migrating a pre v85 app, by generating a list of assets that should be 
	 * preloaded.
	 */
	constructor(storeUsedAssetNames = false) {
		this.storeUsedAssetNames = storeUsedAssetNames;
		this.hasLoaded = false;
		this.assets = { sceneObjects: {}, materials: {}, textures: {} };
		/** @private **/ this.usedAssetNames = { sceneObjects: [], materials: [], textures: [] };
	}

	/**
	 * Load a set of scene objects, materials and textures from the scene
	 * 
	 * @param {string[]} [sceneObjectNames=[]]
	 * @param {string[]} [materialNames=[]]
	 * @param {string[]} [textureNames=[]]
	 * @returns {Promise<{sceneObjects: {}, materials: {}, textures: {}}>} 
	 */
	load(sceneObjectNames = [], materialNames = [], textureNames = []) {
		// @ts-ignore
		return new Promise(resolve => {
			// @ts-ignore
			Promise.all([
				// @ts-ignore				
				Promise.all(sceneObjectNames.map(name => name.indexOf('*') > -1 ? Scene.root.findByPath(name) : Scene.root.findFirst(name))),
				// @ts-ignore
				Promise.all(materialNames.map(name => name.indexOf('*') > -1 ? Materials.findUsingPattern(name) : Materials.findFirst(name))),
				// @ts-ignore
				Promise.all(textureNames.map(name => name.indexOf('*') > -1 ? Textures.findUsingPattern(name) : Textures.findFirst(name))),
			]).then(assets => {
				this.assets.sceneObjects = this.handleLoadedAssetGroup(sceneObjectNames, assets[0]);
				this.assets.materials = this.handleLoadedAssetGroup(materialNames, assets[1]);
				this.assets.textures = this.handleLoadedAssetGroup(textureNames, assets[2]);

				this.hasLoaded = true;

				resolve(this.assets);
			}).catch((error) => {
				Diagnostics.log("Error loading asset: " + error);	
			})
		});
	}

	/**
	 * @private
	 * @param {string[]} names 
	 * @param {any[]} loadedAssets 
	 */
	handleLoadedAssetGroup(names, loadedAssets) {
		const items = {};
	
		names.forEach((name, i) => {
			items[name] = loadedAssets[i];
		});
	
		return items;
	}

	/**
	 * Get a preloaded SceneObject from the library
	 * 
	 * @param {string} sceneObjectName 
	 * @returns {*} The SceneObject
	 */
	getSceneObject(sceneObjectName) {
		if (!this.hasLoaded) Diagnostics.log("[warning] You should call the load method before retrieving an asset");

		if (this.storeUsedAssetNames) this.storeAssetName(sceneObjectName, this.usedAssetNames.sceneObjects);
			
		try {				
			const sceneObject = this.assets.sceneObjects[sceneObjectName];

			if (sceneObject) {
				return sceneObject;
			} else {
				Diagnostics.log(`[error] SceneObject "${sceneObjectName}" was not loaded. Reverting to Scene.root.find method.`);
				return Scene.root.find(sceneObjectName);
			}	
		} catch (e) {
			Diagnostics.log(`[error] could not find "${sceneObjectName}" in the scene`);				
		}
	}

	/**
	 * Get a preloaded material from the library
	 * 
	 * @param {string} materialName 
	 * @returns {*} The material
	 */
	getMaterial(materialName) {		
		if (!this.hasLoaded) Diagnostics.log("[warning] You should call the load method before retrieving an asset");

		if (this.storeUsedAssetNames) this.storeAssetName(materialName, this.usedAssetNames.materials);
		
		const material = this.assets.materials[materialName];
		if (material) {
			return material;
		} else {
			Diagnostics.log(`Material "${materialName}" was not loaded. Reverting to Materials.get method.`);
			return Materials.get(materialName);
		}
	}

	/**
	 * Get a preloaded texture from the library
	 * 
	 * @param {string} textureName 
	 * @returns {*} The texture
	 */
	getTexture(textureName) {
		if (!this.hasLoaded) Diagnostics.log("[warning] You should call the load method before retrieving an asset");

		if (this.storeUsedAssetNames) this.storeAssetName(textureName, this.usedAssetNames.textures);

		const texture = this.assets.textures[textureName];
		if (texture) {
			return texture;
		} else {
			Diagnostics.log(`Texture "${textureName}" was not loaded. Reverting to Textures.get method.`);
			return Textures.get(textureName);
		}
	}

	/**
	 * Store an asset name that was retreived. Can be used to compile a list of all assets that 
	 * should be loaded in a running application.
	 * 
	 * @private
	 * @param {string} name The name of the asset
	 * @param {string[]} list The list to add this asset name to
	 */
	storeAssetName(name, list) {
		if (list.indexOf(name) == -1) {
			list.push(name);
		}
	}

	logUsedAssetNames() {
		Diagnostics.log(this.usedAssetNames);
	}
}

export const assetLib = new AssetLib();