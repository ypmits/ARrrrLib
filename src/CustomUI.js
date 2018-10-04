export default {

	UIToWorldSpace(worldObject, UIObject, canvas, onlyDefaultPosition) {		
		if(onlyDefaultPosition) {
				worldObject.transform.x = UIObject.bounds.x.sub(canvas.width.lastValue/2).add(UIObject.bounds.width.div(2));
				worldObject.transform.y = UIObject.bounds.y.sub(canvas.height.lastValue/2).add(UIObject.bounds.height.div(2)).mul(-1);
			} else {
				worldObject.transform.x = UIObject.transform.x.add(UIObject.bounds.x.sub(canvas.width.lastValue/2).add(UIObject.bounds.width.div(2)));
				worldObject.transform.y = UIObject.transform.y.sub(UIObject.bounds.y.sub(canvas.height.lastValue/2).add(UIObject.bounds.height.div(2)));
			}
		}
}