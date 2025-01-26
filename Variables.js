/*-----------------------------------------------------------------------------------*/
// Variable Declaration
/*-----------------------------------------------------------------------------------*/

// Common variables
var canvas, gl, program;
var pBuffer, nBuffer, vPosition, vNormal;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var modelViewMatrix, projectionMatrix, nMatrix;
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

var cylinderX,
  cylinderY,
  cylinderZ,
  cylinderAxis = X_AXIS,
  cylinderBtn;

var cubeX,
  cubeY,
  cubeZ,
  cubeAxis = X_AXIS,
  cubeBtn;

var sphereX,
  sphereY,
  sphereZ,
  sphereAxis = X_AXIS,
  sphereBtn;

var cylinderObj,
  cubeObj,
  sphereObj,
  cylinderFlag = false,
  cubeFlag = false,
  sphereFlag = false;
teapotFlag = false;

var cylinderTheta = [0, 0, 0],
  cubeTheta = [0, 0, 0],
  sphereTheta = [0, 0, 0],
  teapotTheta = [0, 0, 0];
animFrame = 0;

var pointsArray = [],
  normalsArray = [],
  cylinderV,
  cubeV,
  sphereV,
  totalV;

var lightSphereObj;
var lightSphereV;
var teapotRotating = false;
var currentTeapotAngle = 0;
var teapotAxis = X_AXIS;
var ambientProductLoc, diffuseProductLoc, specularProductLoc, shininessLoc;
let texCoordsArray = [];
var uTextureLoc, uUseTextureLoc;
