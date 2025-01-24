
/*-----------------------------------------------------------------------------------*/
// WebGL Utilities
/*-----------------------------------------------------------------------------------*/

// Execute the init() function when the web page has fully loaded
window.onload = function init() {
  // Primitive (geometric shape) initialization
  // Shape 1 = Cylinder, Shape 2 = Cube
  cylinderObj = cylinder(200, 3, true);
  cylinderObj.Rotate(45, [1, 1, 0]);
  cylinderObj.Scale(1.2, 1.2, 1.2);
  cylinderObj.Translate(-1, 0, 0);
  concatData(cylinderObj.Point, cylinderObj.Normal);


  teapotObj = teapot(10); // The number controls tessellation detail
  teapotObj.rotate(45, [1, 1, 0]);
  teapotObj.scale(0.4, 0.4, 0.4); // Teapot needs different scaling
  teapotObj.translate(0, -0.26, 0);
  concatData(teapotObj.TriangleVertices, teapotObj.Normals);


  cubeObj = cube();
  cubeObj.Rotate(45, [1, 1, 0]);
  cubeObj.Scale(1, 1, 1);
  cubeObj.Translate(1, 0, 0);
  concatData(cubeObj.Point, cubeObj.Normal);

  // Add light source sphere to buffer
  lightSphereObj = sphere(4); // Create simpler sphere
  concatData(lightSphereObj.Point, lightSphereObj.Normal);

  lightSphereV = lightSphereObj.Point.length;
  cylinderV = cylinderObj.Point.length;
  cubeV = cubeObj.Point.length;
  teapotV = teapotObj.TriangleVertices.length;
  totalV = pointsArray.length;

  // WebGL setups
  getUIElement();
  configWebGL();
  render();
  // Initialize light controls
  initLightControls();
    
  // Initial updates
  updateLightProducts();
  updateLightSource();
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

  teapotX = document.getElementById("teapot-x");
  teapotY = document.getElementById("teapot-y");
  teapotZ = document.getElementById("teapot-z");
  teapotBtn = document.getElementById("teapot-btn");

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

  teapotX.onchange = function () {
    if (teapotX.checked) teapotAxis = X_AXIS;
  };

  teapotY.onchange = function () {
    if (teapotY.checked) teapotAxis = Y_AXIS;
  };

  teapotZ.onchange = function () {
    if (teapotZ.checked) teapotAxis = Z_AXIS;
  };

  teapotBtn.onclick = function () {
    teapotFlag = !teapotFlag;
    teapotRotating = teapotFlag;
  };
}



// Render the graphics for viewing
function render() {
  // Cancel the animation frame before performing any graphic rendering
  if (cylinderFlag || cubeFlag || teapotFlag) {
    cylinderFlag = false;
    cubeFlag = false;
    teapotFlag = false;
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
  drawTeapot();
  drawCube();
  drawLightSource();



  // Schedule the next frame for a looped animation (60fps)
  animFrame = window.requestAnimationFrame(animUpdate);
}