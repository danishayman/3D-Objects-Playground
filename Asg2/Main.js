/*-----------------------------------------------------------------------------------*/
// WebGL Utilities
/*-----------------------------------------------------------------------------------*/

// Execute the init() function when the web page has fully loaded
window.onload = function init() {
  // Primitive (geometric shape) initialization
  // Shape 1 = Cylinder, Shape 2 = Cube
  cylinderObj = cylinder(72, 3, true);
  cylinderObj.Rotate(45, [1, 1, 0]);
  cylinderObj.Scale(1.2, 1.2, 1.2);
  concatData(cylinderObj.Point, cylinderObj.Normal);

  cubeObj = cube();
  cubeObj.Rotate(45, [1, 1, 0]);
  cubeObj.Scale(1, 1, 1);
  concatData(cubeObj.Point, cubeObj.Normal);

  sphereObj = sphere(3);
  sphereObj.Rotate(45, [1, 1, 0]);
  sphereObj.Scale(0.75, 0.75, 0.75);
  concatData(sphereObj.Point, sphereObj.Normal);

  cylinderV = cylinderObj.Point.length;
  cubeV = cubeObj.Point.length;
  sphereV = sphereObj.Point.length;
  totalV = pointsArray.length;

  // WebGL setups
  getUIElement();
  configWebGL();
  render();
};

// Retrieve all elements from HTML and store in the corresponding variables
function getUIElement() {
  canvas = document.getElementById("gl-canvas");

  cylinderX = document.getElementById("cylinder-x");
  cylinderY = document.getElementById("cylinder-y");
  cylinderZ = document.getElementById("cylinder-z");
  cylinderBtn = document.getElementById("cylinder-btn");

  cubeX = document.getElementById("cube-x");
  cubeY = document.getElementById("cube-y");
  cubeZ = document.getElementById("cube-z");
  cubeBtn = document.getElementById("cube-btn");

  sphereX = document.getElementById("sphere-x");
  sphereY = document.getElementById("sphere-y");
  sphereZ = document.getElementById("sphere-z");
  sphereBtn = document.getElementById("sphere-btn");

  cylinderX.onchange = function () {
    if (cylinderX.checked) cylinderAxis = X_AXIS;
  };

  cylinderY.onchange = function () {
    if (cylinderY.checked) cylinderAxis = Y_AXIS;
  };

  cylinderZ.onchange = function () {
    if (cylinderZ.checked) cylinderAxis = Z_AXIS;
  };

  cylinderBtn.onclick = function () {
    cylinderFlag = !cylinderFlag;
  };

  cubeX.onchange = function () {
    if (cubeX.checked) cubeAxis = X_AXIS;
  };

  cubeY.onchange = function () {
    if (cubeY.checked) cubeAxis = Y_AXIS;
  };

  cubeZ.onchange = function () {
    if (cubeZ.checked) cubeAxis = Z_AXIS;
  };

  cubeBtn.onclick = function () {
    cubeFlag = !cubeFlag;
  };

  sphereX.onchange = function () {
    if (sphereX.checked) sphereAxis = X_AXIS;
  };

  sphereY.onchange = function () {
    if (sphereY.checked) sphereAxis = Y_AXIS;
  };

  sphereZ.onchange = function () {
    if (sphereZ.checked) sphereAxis = Z_AXIS;
  };

  sphereBtn.onclick = function () {
    sphereFlag = !sphereFlag;
  };
}



// Render the graphics for viewing
function render() {
  // Cancel the animation frame before performing any graphic rendering
  if (cylinderFlag || cubeFlag || sphereFlag) {
    cylinderFlag = false;
    cubeFlag = false;
    sphereFlag = false;
    window.cancelAnimationFrame(animFrame);
  }

  // Clear the color buffer and the depth buffer before rendering a new frame
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass the projection matrix from JavaScript to the GPU for use in shader
  // ortho(left, right, bottom, top, near, far)
  projectionMatrix = ortho(-4, 4, -2.25, 2.25, -5, 5);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  // Compute the ambient, diffuse, and specular values
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);

  animUpdate();
}

// Update the animation frame
function animUpdate() {
  // Clear the color buffer and the depth buffer before rendering a new frame
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawCylinder();
  drawCube();
  drawSphere();

  // Schedule the next frame for a looped animation (60fps)
  animFrame = window.requestAnimationFrame(animUpdate);
}

// Draw the first shape (cylinder)
function drawCylinder() {
  // Increment the rotation value if the animation is enabled
  if (cylinderFlag) {
    cylinderTheta[cylinderAxis] += 1;
  }

  // Pass the model view matrix from JavaScript to the GPU for use in shader
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(-1.5, 0, 0));
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

  // Draw the primitive from index 0 to the last index of shape 1
  gl.drawArrays(gl.TRIANGLES, 0, cylinderV);
}

// Draw the second shape (cube)
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

  // Draw the primitive from the last index of shape 1 to the last index of shape 2
  gl.drawArrays(gl.TRIANGLES, cylinderV, cubeV);
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

  // Draw starting from after cylinder and cube vertices
  const startIndex = cylinderV + cubeV;
  const count = totalV - startIndex; // Calculate how many vertices remain to draw
  gl.drawArrays(gl.TRIANGLES, startIndex, count);
}
/*-----------------------------------------------------------------------------------*/
