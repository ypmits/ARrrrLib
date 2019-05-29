# Math2
### Introduction
A number of extra math utilities that come in quite handy with Spark AR.   
Unlike the standard library you use it like 'Math2'.
```javascript
// To use 'console.log' everywhere put the following code on top of your script:
import console from 'Diagnostics';
```

#### Converts degrees to radians and back:
```javascript
console.log( Math2.deg2rad( 45 ) ); // Outputs 0.7853981633974483
console.log( Math2.rad2deg( 0.7853981633974483 ) ); // Outputs 45
```
#### Returns a random number between two given numbers:
```javascript
console.log( Math2.getRandom( -1, 1) ); // Outputs a number between -1 and 1
```
#### Shuffles an array and returns the result:
```javascript
var a = [0,1,2,3,4];
console.log( a ); // [0,1,2,3,4] wordt dan bijv. [0,2,1,3,4] of [2,0,4,1,3]
```