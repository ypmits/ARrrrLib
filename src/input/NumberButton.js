import TouchGestures from 'TouchGestures';

export default class
{
	constructor(element, s, updateFunc)
	{
		this.id = s;
		this.nb = this;
		element.child("text").text = s.toString();
		TouchGestures.onTap(element).subscribe(updateFunc.bind(this.nb));
	}	
}
