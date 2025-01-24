/*-----------------------------------------------------------------------------------*/
// Cube
/*-----------------------------------------------------------------------------------*/

function cube() {
    var cubePoints = [],
      cubeNormals = [],
      cubeData = {};
  
    var cubeVertices = [
      [-0.5, -0.5, 0.5, 1.0],
      [-0.5, 0.5, 0.5, 1.0],
      [0.5, 0.5, 0.5, 1.0],
      [0.5, -0.5, 0.5, 1.0],
      [-0.5, -0.5, -0.5, 1.0],
      [-0.5, 0.5, -0.5, 1.0],
      [0.5, 0.5, -0.5, 1.0],
      [0.5, -0.5, -0.5, 1.0],
    ];
  
    var cubeFaceNormals = [
      [0, 0, 1],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, -1],
      [-1, 0, 0],
    ];
  
    var cubeQuadElements = [
      1, 0, 3, 3, 2, 1, 2, 3, 7, 7, 6, 2, 3, 0, 4, 4, 7, 3, 6, 5, 1, 1, 2, 6, 4,
      5, 6, 6, 7, 4, 5, 4, 0, 0, 1, 5,
    ];
  
    var cubeNormalElements = [
      0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4,
      4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5,
    ];
  
    // Primitive (geometric shape) initialization
    for (var i = 0; i < cubeQuadElements.length; i++) {
      cubePoints.push(cubeVertices[cubeQuadElements[i]]);
      cubeNormals.push(cubeFaceNormals[cubeNormalElements[i]]);
    }
  
    // Functions for local transformation
    function translate(x, y, z) {
      for (var j = 0; j < cubeVertices.length; j++) {
        cubeVertices[j][0] += x;
        cubeVertices[j][1] += y;
        cubeVertices[j][2] += z;
      }
    }
  
    function rotate(angle, axis) {
      var d = Math.sqrt(
        axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
      );
      var x = axis[0] / d;
      var y = axis[1] / d;
      var z = axis[2] / d;
      var c = Math.cos(radians(angle));
      var s = Math.sin(radians(angle));
      var omc = 1.0 - c;
  
      var mat = [
        [x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s],
        [x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s],
        [x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c],
      ];
  
      for (var i = 0; i < cubeVertices.length; i++) {
        var t = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
          for (var k = 0; k < 3; k++) {
            t[j] += mat[j][k] * cubeVertices[i][k];
          }
        }
  
        for (var m = 0; m < 3; m++) {
          cubeVertices[i][m] = t[m];
        }
      }
    }
  
    function scale(sx, sy, sz) {
      for (i = 0; i < cubeVertices.length; i++) {
        cubeVertices[i][0] *= sx;
        cubeVertices[i][1] *= sy;
        cubeVertices[i][2] *= sz;
      }
  
      for (i = 0; i < cubeFaceNormals.length; i++) {
        cubeFaceNormals[i][0] /= sx;
        cubeFaceNormals[i][1] /= sy;
        cubeFaceNormals[i][2] /= sz;
      }
    }
  
    cubeData.Point = cubePoints;
    cubeData.Normal = cubeNormals;
    cubeData.Translate = translate;
    cubeData.Rotate = rotate;
    cubeData.Scale = scale;
    return cubeData;
  }










function drawCube() {
    // Increment the rotation value if the animation is enabled
    if (cubeFlag) {
      cubeTheta[cubeAxis] += 1;
    }
  
    // Pass the model view matrix from JavaScript to the GPU for use in shader
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(1.5, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(cubeTheta[X_AXIS], [1, 0, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(cubeTheta[Y_AXIS], [0, 1, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(cubeTheta[Z_AXIS], [0, 0, 1]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
    // Pass the normal matrix from JavaScript to the GPU for use in shader
    nMatrix = normalMatrix(modelViewMatrix);
    gl.uniformMatrix3fv(normalMatrixLoc, false, nMatrix);
  
    const offset = cylinderV + teapotV;
  
    // Draw the primitive from the last index of shape 1 to the last index of shape 2
    gl.drawArrays(gl.TRIANGLES, offset, cubeV);
  }