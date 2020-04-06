const Scene = require('Scene');
const Diagnostics = require('Diagnostics');

/**
Searches for objects in the sceneview.

ObjectFinder.find(object, inside):

var object = ObjectFinder.find("objectToFind"); // Find a object in the Scene.root
var object = ObjectFinder.find("childObjectToFind",object); // Use a SceneObject to indicate the parent object (recommended)
var object = ObjectFinder.find("childObjectToFind","objectToFind"); // Use a string to indicate the parent object

Returns a promise
*/
export default class ObjectFinder
{
	static find(object, inside = null)
	{
		if (object == null)
		{
			Diagnostics.log("[error] no object name given");
			return null;
		} else if (typeof object != "string")
		{
			Diagnostics.log("[error] object type has to be a string");
			return null;
		} else
		{
			try
			{
				if (inside == null) return Scene.root.findFirst(object);
				else
				{
					if (typeof inside == "string") return Scene.root.findFirst(inside).findFirst(object);
					else return inside.findFirst(object);
				}
			} catch (e) { return ObjectFinder.handleError(e, object, inside); }
		}
	}

	static findAll(objectNames, inside = null, recursive = true)
	{
		if (objectNames == null)
		{
			Diagnostics.log("[error] no objectnames are given");
			return [];
		} else
		{
			try
			{
				if (inside == null) return Scene.root.findAll(objectNames, {recursive:recursive});
				else
				{
					if (typeof inside == "string") return Scene.root.findAll(inside, {recursive:recursive}).findAll(objectNames, {recursive:recursive});
					else return inside.findAll(objectNames, {recursive:recursive});
				}
			} catch (e) { return ObjectFinder.handleError(e, objectNames, inside); }
		}
	}

	static handleError(e, objectNames, inside = null)
	{
		var base = `[error] could not find "${objectNames}" in `;
		var where = (inside == null) ? "the scene" : `${(typeof inside == "string") ? inside : inside.name}`;
		Diagnostics.log(base + where);
		return base + where;
	}
}