/*-----------------------------------------------------------------------------------*/
// Sphere
/*-----------------------------------------------------------------------------------*/

function sphere(subdivNum) {
    var spherePoints = [],
      sphereNormals = [],
      sphereData = {};
  
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
  
    function triangle(a, b, c) {
      spherePoints.push([a[0], a[1], a[2], 1]);
      spherePoints.push([b[0], b[1], b[2], 1]);
      spherePoints.push([c[0], c[1], c[2], 1]);
  
      sphereNormals.push([a[0], a[1], a[2]]);
      sphereNormals.push([b[0], b[1], b[2]]);
      sphereNormals.push([c[0], c[1], c[2]]);
    }
  
    function divideTriangle(a, b, c, count) {
      if (count > 0) {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);
  
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
  
        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
      } else {
        triangle(a, b, c);
      }
    }
  
    function tetrahedron(a, b, c, d, n) {
      divideTriangle(a, b, c, n);
      divideTriangle(d, c, b, n);
      divideTriangle(a, d, b, n);
      divideTriangle(a, c, d, n);
    }
  
    // Primitive (geometric shape) initialization
    tetrahedron(va, vb, vc, vd, subdivNum);
  
    // Functions for local transformation
    function translate(x, y, z) {
      for (var j = 0; j < spherePoints.length; j++) {
        spherePoints[j][0] += x;
        spherePoints[j][1] += y;
        spherePoints[j][2] += z;
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
  
      for (var i = 0; i < spherePoints.length; i++) {
        var u = [0, 0, 0];
        var v = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
          for (var k = 0; k < 3; k++) {
            u[j] += mat[j][k] * spherePoints[i][k];
            v[j] += mat[j][k] * sphereNormals[i][k];
          }
        }
  
        for (var j = 0; j < 3; j++) {
          spherePoints[i][j] = u[j];
          sphereNormals[i][j] = v[j];
        }
      }
    }
  
    function scale(sx, sy, sz) {
      for (var i = 0; i < spherePoints.length; i++) {
        spherePoints[i][0] *= sx;
        spherePoints[i][1] *= sy;
        spherePoints[i][2] *= sz;
        sphereNormals[i][0] /= sx;
        sphereNormals[i][1] /= sy;
        sphereNormals[i][2] /= sz;
      }
    }
  
    sphereData.Point = spherePoints;
    sphereData.Normal = sphereNormals;
    sphereData.Translate = translate;
    sphereData.Rotate = rotate;
    sphereData.Scale = scale;
    return sphereData;
  }


//Draw the third shape (sphere)
function drawSphere() {
    // Increment the rotation value if the animation is enabled
    if (sphereFlag) {
      sphereTheta[sphereAxis] += 1;
    }
  
    // Pass the model view matrix from JavaScript to the GPU for use in shader
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(sphereTheta[X_AXIS], [1, 0, 0])
    );
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(sphereTheta[Y_AXIS], [0, 1, 0])
    );
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(sphereTheta[Z_AXIS], [0, 0, 1])
    );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
    // Pass the normal matrix from JavaScript to the GPU for use in shader
    nMatrix = normalMatrix(modelViewMatrix);
    gl.uniformMatrix3fv(normalMatrixLoc, false, nMatrix);

    const offset = cylinderV + teapotV + cubeV;
  
    gl.drawArrays(gl.TRIANGLES, offset, sphereV);
  }