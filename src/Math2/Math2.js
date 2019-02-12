import Math2 from './Math2';

/**
 * Some math utilities
 */
export default {
	/**
	 * Converts degrees to radian values.
	 * @param {number} degrees The number of degrees.
	 * @return {number} The corresponding number of radian units.
	 */
	deg2rad: (degrees) =>
	{
		return (degrees * Math.PI) / 180.0;
	},

	/**
	 * Converts radian values to degrees.
	 * @param {number} radians The number of radians.
	 * @return {number} The corresponding number of degrees.
	 */
	rad2deg: (radians) =>
	{
		return (180.0 * radians) / Math.PI;
	},

	/**
	 * Returns a random number between 'min' and 'max'
	 * @param {number} min the minimum number
	 * @param {number} max the maximum number
	 * @return {number} The calculated random number between 'min' and 'max'
	 */
	getRandom: (min, max) =>
	{
		return Math.floor(Math.random() * (max - min) + min);
	},

	/**
	 * Shuffles an array and returns it back.
	 * Usage-example:
	 * var a = [0,1,2,3,4];
	 * a = arrayShuffle(a);
	 * @param {array} The array to shuffle
	 * @return {array} The same array is returned.
	 */
	arrayShuffle: (array) =>
	{
		for (var i = array.length-1;i > 0;i--)
		{
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	},





	/**
	 * Tests all the functions
	 */
	test: () =>
	{
		var s = "\n>>-------->\nMATH2-TEST:\n-----------\nmath2.rad2deg(1): "+Math2.rad2deg(1)+"\n";
		s += "math2.deg2rad(360): "+Math2.deg2rad(360)+"\n";
		s += "math2.getRandom(360): "+Math2.getRandom(0, 360)+"\n";
		s += "math2.arrayShuffle([1,2,3,4,5,6,7,8,9,0]): ["+Math2.arrayShuffle([1,2,3,4,5,6,7,8,9,0])+"]";  // Shuffles the 'arr'-array
		s += "\n<----<<\n";
		return s;
	}
}