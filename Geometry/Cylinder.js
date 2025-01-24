/*-----------------------------------------------------------------------------------*/
// Cylinder
/*-----------------------------------------------------------------------------------*/
function cylinder(numSlices, numStacks, caps) {
    var cylinderPoints = [],
      cylinderNormals = [],
      cylinderData = {};
  
    var slices = 36;
    if (numSlices) slices = numSlices;
  
    var stacks = 1;
    if (numStacks) stacks = numStacks;
  
    var capsFlag = true;
    if (caps == false) capsFlag = caps;
  
    var top = 0.5;
    var bottom = -0.5;
    var radius = 0.5;
  
    // Primitive (geometric shape) initialization
    for (var j = 0; j < stacks; j++) {
      var stop = bottom + ((j + 1) * (top - bottom)) / stacks;
      var sbottom = bottom + (j * (top - bottom)) / stacks;
      var topPoints = [];
      var bottomPoints = [];
  
      for (var i = 0; i < slices; i++) {
        var theta = (2.0 * i * Math.PI) / slices;
        topPoints.push([
          radius * Math.sin(theta),
          stop,
          radius * Math.cos(theta),
          1.0,
        ]);
        bottomPoints.push([
          radius * Math.sin(theta),
          sbottom,
          radius * Math.cos(theta),
          1.0,
        ]);
      }
  
      topPoints.push([0.0, stop, radius, 1.0]);
      bottomPoints.push([0.0, sbottom, radius, 1.0]);
  
      for (var i = 0; i < slices; i++) {
        var a = topPoints[i];
        var d = topPoints[i + 1];
        var b = bottomPoints[i];
        var c = bottomPoints[i + 1];
        var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        var v = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  
        var normal = [
          u[1] * v[2] - u[2] * v[1],
          u[2] * v[0] - u[0] * v[2],
          u[0] * v[1] - u[1] * v[0],
        ];
  
        var mag = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
        );
        normal = [normal[0] / mag, normal[1] / mag, normal[2] / mag];
        cylinderPoints.push([a[0], a[1], a[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
  
        cylinderPoints.push([b[0], b[1], b[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
  
        cylinderPoints.push([c[0], c[1], c[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
  
        cylinderPoints.push([a[0], a[1], a[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
  
        cylinderPoints.push([c[0], c[1], c[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
  
        cylinderPoints.push([d[0], d[1], d[2], 1.0]);
        cylinderNormals.push([normal[0], normal[1], normal[2]]);
      }
    }
  
    var topPoints = [];
    var bottomPoints = [];
    for (var i = 0; i < slices; i++) {
      var theta = (2.0 * i * Math.PI) / slices;
      topPoints.push([
        radius * Math.sin(theta),
        top,
        radius * Math.cos(theta),
        1.0,
      ]);
      bottomPoints.push([
        radius * Math.sin(theta),
        bottom,
        radius * Math.cos(theta),
        1.0,
      ]);
    }
  
    topPoints.push([0.0, top, radius, 1.0]);
    bottomPoints.push([0.0, bottom, radius, 1.0]);
  
    if (capsFlag) {
      // Top surface
      for (i = 0; i < slices; i++) {
        normal = [0.0, 1.0, 0.0];
        var a = [0.0, top, 0.0, 1.0];
        var b = topPoints[i];
        var c = topPoints[i + 1];
  
        cylinderPoints.push([a[0], a[1], a[2], 1.0]);
        cylinderNormals.push(normal);
  
        cylinderPoints.push([b[0], b[1], b[2], 1.0]);
        cylinderNormals.push(normal);
  
        cylinderPoints.push([c[0], c[1], c[2], 1.0]);
        cylinderNormals.push(normal);
      }
  
      // Bottom surface
      for (i = 0; i < slices; i++) {
        normal = [0.0, -1.0, 0.0];
        var a = [0.0, bottom, 0.0, 1.0];
        var b = bottomPoints[i];
        var c = bottomPoints[i + 1];
  
        cylinderPoints.push([a[0], a[1], a[2], 1.0]);
        cylinderNormals.push(normal);
  
        cylinderPoints.push([b[0], b[1], b[2], 1.0]);
        cylinderNormals.push(normal);
  
        cylinderPoints.push([c[0], c[1], c[2], 1.0]);
        cylinderNormals.push(normal);
      }
    }
  
    // Functions for local transformation
    function translate(x, y, z) {
      for (var j = 0; j < cylinderPoints.length; j++) {
        cylinderPoints[j][0] += x;
        cylinderPoints[j][1] += y;
        cylinderPoints[j][2] += z;
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
  
      for (var i = 0; i < cylinderPoints.length; i++) {
        var u = [0, 0, 0];
        var v = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
          for (var k = 0; k < 3; k++) {
            u[j] += mat[j][k] * cylinderPoints[i][k];
            v[j] += mat[j][k] * cylinderNormals[i][k];
          }
        }
  
        for (var j = 0; j < 3; j++) {
          cylinderPoints[i][j] = u[j];
          cylinderNormals[i][j] = v[j];
        }
      }
    }
  
    function scale(sx, sy, sz) {
      for (var i = 0; i < cylinderPoints.length; i++) {
        cylinderPoints[i][0] *= sx;
        cylinderPoints[i][1] *= sy;
        cylinderPoints[i][2] *= sz;
        cylinderNormals[i][0] /= sx;
        cylinderNormals[i][1] /= sy;
        cylinderNormals[i][2] /= sz;
      }
    }
  
    cylinderData.Point = cylinderPoints;
    cylinderData.Normal = cylinderNormals;
    cylinderData.Translate = translate;
    cylinderData.Rotate = rotate;
    cylinderData.Scale = scale;
    return cylinderData;
  }



// Draw the first shape (cylinder)
function drawCylinder() {

    const material = cylinderMaterial;
    setMaterialUniforms(material);
    
    // Increment the rotation value if the animation is enabled
    if (cylinderFlag) {
      cylinderTheta[cylinderAxis] += 1;
    }
  
    // Pass the model view matrix from JavaScript to the GPU for use in shader
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 0, 0));
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(cylinderTheta[X_AXIS], [1, 0, 0])
    );
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(cylinderTheta[Y_AXIS], [0, 1, 0])
    );
    modelViewMatrix = mult(
      modelViewMatrix,
      rotate(cylinderTheta[Z_AXIS], [0, 0, 1])
    );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
    // Pass the normal matrix from JavaScript to the GPU for use in shader
    nMatrix = normalMatrix(modelViewMatrix);
    gl.uniformMatrix3fv(normalMatrixLoc, false, nMatrix);



    const offset = 0;
    // Draw the primitive from index 0 to the last index of shape 1
    gl.drawArrays(gl.TRIANGLES, offset, cylinderV);
  }
  
  
  