# AssetLib
### Introduction
The AssetLib can be used to retrieve a set of scene objects, materials and textures ahead of running the application, so that no async operations like findFirst need to happen in other parts of the application.

Ported from [SparkAR-AssetsLoader](https://github.com/data-sapiens/SparkAR-AssetsLoader) by [Data Sapiens](https://github.com/data-sapiens)

### Code Example

```javascript
import { assetLib } from './AssetLib';

const sceneObjectNames = ["sceneObject1, sceneObject2"];
const materialNames = ["material1, material2"];
const textureNames = ["texture1, texture2"];

assetLib.load(sceneObjectNames, materialNames, textureNames)
   .then(loadedAssets => {
        // All assets are loaded, 
        // start your application logic here.

        // ...

        // Now from anywhere in your application you 
        // can use these methods to retrieve the 
        // assets you loaded:
        assetLib.getSceneObject("sceneObject1");
        assetLib.getMaterial("material1");
        assetLib.getTexture("texture1");
    });
```

**IMPORTANT!** Make sure you are loading all your assets before you start the rest of your application logic.

### Migrating to v85 and up
The AssetLib can be particulary useful in migrating older applications to Spark AR version 85 and up. If you have a complex application it can be hard to figure out what exactly you need to preload. Simply follow these steps:

```javascript
// Enable storing the names of used assets
assetlib.storeUsedAssetNames = true;
```

Replace these calls everywhere in your application:
```javascript
// Old
Scene.root.find("someSceneObject");
// Replace by
assetLib.getSceneObject("someSceneObject");

// Old
Materials.get("someMaterial");
// Replace by
assetLib.getMaterial("someMaterial");

// Old
Textures.get("someTexture");
// Replace by
assetLib.getTexture("someTexture");
```

Now run your application. It will work as usual, but the AssetLib will store the names of all the assets you are using in your application. Once you're satisfied you've done a full run-through of your application you can print this list to your console. You can, for instance, add a callback to a button and use it to execute this code:

```javascript
assetLib.logUsedAssetNames();
```

Now take this list and use this to preload your assets through the `load()` method and you will have migrated your application.
