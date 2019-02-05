export default {

	UIToWorldSpace(worldObject, UIObject, screenWidth, screenHeight, onlyDefaultPosition) {		
		if(onlyDefaultPosition) {
				worldObject.transform.x = UIObject.bounds.x.sub(screenWidth/2).add(UIObject.bounds.width.div(2));
				worldObject.transform.y = UIObject.bounds.y.sub(screenHeight/2).add(UIObject.bounds.height.div(2)).mul(-1);
			} else {
				worldObject.transform.x = UIObject.transform.x.add(UIObject.bounds.x.sub(screenWidth/2).add(UIObject.bounds.width.div(2)));
				worldObject.transform.y = UIObject.transform.y.sub(UIObject.bounds.y.sub(screenHeight/2).add(UIObject.bounds.height.div(2)));
			}
		}
}