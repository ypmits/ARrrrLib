const Scene = require('Scene');
const Diagnostics = require('Diagnostics');

export default class ObjectFinder {
    // ------------Example------------
    // var object = ObjectFinder.find("objectToFind"); // Find a object in the Scene.root
    // var object = ObjectFinder.find("childObjectToFind",object); // Use a SceneObject to indicate the parent object (recommended)
    // var object = ObjectFinder.find("childObjectToFind","objectToFind"); // Use a string to indicate the parent object
    // --------------End--------------
    static find(object, inside = null) {
        if(object == null) {
            Diagnostics.log("[error] no object name given");
        } else if (typeof object != "string") {
            Diagnostics.log("[error] object type has to be a string");
        } else {
            try {
                if(inside == null) {
                    return Scene.root.find(object);
                } else {
                    if(typeof inside == "string") {
                        return Scene.root.find(inside).find(object);
                    } else {
                        return inside.find(object);
                    }
                }
            } catch(e) {
                if(inside == null) {
                    Diagnostics.log(`[error] could not find "${object}" in the scene`);
                } else {
                    Diagnostics.log(`[error] could not find "${object}" in ${(typeof inside == "string")?inside:inside.name}`);
                }
            }
        }
    }
}