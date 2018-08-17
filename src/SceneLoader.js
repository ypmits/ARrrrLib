export default class {
	constructor(scope, scenes) {
		this.scope = scope;
		this.currentSceneNum = 0;
		this.scenes = scenes;
	}
		
	/**
	 * Next scene will automatically go the next scene:
	 */
	nextScene()
	{
		this.scope[this.scenes[this.currentSceneNum]]();
		this.currentSceneNum++;
	}

	/**
	 * Opens a scene by name
	 */
	gotoSceneName(sceneName)
	{
		this.currentSceneNum = this.scenes.findIndex(x => x == sceneName);
		this.scope[sceneName]();
	}

	/**
	 */
	gotoSceneNum(sceneNum)
	{
		this.currentSceneNum = sceneNum;
		this.scope[this.scenes[this.currentSceneNum]]();
	}
}