# ObjectFinder
### Introduction
Use **ObjectFinder** to replace the *Scene.root.find()* method.   
ObjectFinder gives you better debug-information when an object is not found.
```javascript
var otherObject = ObjectFinder.find("objectNameToFind"); // Find a object in the Scene.root
var object = ObjectFinder.find("childObjectNameToFind", otherObject); // Use a SceneObject to indicate the parent object (recommended)
var object = ObjectFinder.find("childObjectToFind", "objectToFind"); // Use a string to indicate the parent object
```