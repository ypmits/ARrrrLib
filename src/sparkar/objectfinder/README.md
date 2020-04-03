# ObjectFinder
### Introduction
Use **ObjectFinder** to replace the *Scene.root.find()* method.
ObjectFinder is updated to ***v85*** and implements the new async-behaviours.
ObjectFinder gives you better debug-information when an object is not found.
```javascript
// ObjectFinder to look for 1 object:
ObjectFinder.find("IcoSphereHolder").then(element => {
	log("[ObjectFinder test:find] Found the element: "+element);
});

// ObjectFinder to look for 1 object only inside another object:
ObjectFinder.find("IcoSphereHolder", "othersphereHolder").then(element => {
	log("[ObjectFinder test:find] Found the element: "+element);
});

// ObjectFinder to look for multiple objects:
ObjectFinder.findAll("IcoSphere", null, true).then( elements => {
	log(`[ObjectFinder test:findAll] Found ${elements.length}:`);
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		log("    - sphere:"+element);
	}
});
```