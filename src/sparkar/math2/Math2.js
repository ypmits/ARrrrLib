/**
 * Some math utilities
 */
export default class Math2 {
	static deg2rad (degrees)
	{
		return (degrees * Math.PI) / 180.0;
	}
	static rad2deg (radians)
	{
		return (180.0 * radians) / Math.PI;
	}
	static getRandom (min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
	static arrayShuffle (array)
	{
		for (var i = array.length-1;i > 0;i--)
		{
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
}