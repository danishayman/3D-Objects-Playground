/*-----------------------------------------------------------------------------------*/
// Camera Controls
/*-----------------------------------------------------------------------------------*/

var camera = {
  eye: vec3(0, 0, 5), // Initial eye position (matches HTML slider defaults)
  at: vec3(0, 0, 0), // Look-at point
  up: vec3(0, 1, 0), // Up vector
  viewMatrix: mat4(), // View matrix storage
};

// Update view matrix using lookAt
function updateCameraView() {
  camera.viewMatrix = lookAt(camera.eye, camera.at, camera.up);
}

// Connect HTML sliders to camera parameters
function setupCameraControls() {
  const eyeX = document.getElementById("eye-x");
  const eyeY = document.getElementById("eye-y");
  const eyeZ = document.getElementById("eye-z");
  const atX = document.getElementById("at-x");
  const atY = document.getElementById("at-y");
  const atZ = document.getElementById("at-z");
  const upX = document.getElementById("up-x");
  const upY = document.getElementById("up-y");
  const upZ = document.getElementById("up-z");

  // Initialize camera from slider values
  camera.eye = vec3(
    parseFloat(eyeX.value),
    parseFloat(eyeY.value),
    parseFloat(eyeZ.value)
  );
  camera.at = vec3(
    parseFloat(atX.value),
    parseFloat(atY.value),
    parseFloat(atZ.value)
  );
  camera.up = vec3(
    parseFloat(upX.value),
    parseFloat(upY.value),
    parseFloat(upZ.value)
  );

  // Add event listeners
  // Eye position controls
  eyeX.addEventListener("input", () => {
    camera.eye[0] = parseFloat(eyeX.value);
    updateCameraView();
  });
  eyeY.addEventListener("input", () => {
    camera.eye[1] = parseFloat(eyeY.value);
    updateCameraView();
  });
  eyeZ.addEventListener("input", () => {
    camera.eye[2] = parseFloat(eyeZ.value);
    updateCameraView();
  });

  // At position controls
  atX.addEventListener("input", () => {
    camera.at[0] = parseFloat(atX.value);
    updateCameraView();
  });
  atY.addEventListener("input", () => {
    camera.at[1] = parseFloat(atY.value);
    updateCameraView();
  });
  atZ.addEventListener("input", () => {
    camera.at[2] = parseFloat(atZ.value);
    updateCameraView();
  });

  // Up vector controls
  upX.addEventListener("input", () => {
    camera.up[0] = parseFloat(upX.value);
    updateCameraView();
  });
  upY.addEventListener("input", () => {
    camera.up[1] = parseFloat(upY.value);
    updateCameraView();
  });
  upZ.addEventListener("input", () => {
    camera.up[2] = parseFloat(upZ.value);
    updateCameraView();
  });

  updateCameraView();
}

// Camera control value updaters
function setupCameraControlListeners() {
  // Eye position controls
  document.getElementById("eye-x").addEventListener("input", function () {
    document.getElementById("eye-x-value").textContent = this.value;
  });
  document.getElementById("eye-y").addEventListener("input", function () {
    document.getElementById("eye-y-value").textContent = this.value;
  });
  document.getElementById("eye-z").addEventListener("input", function () {
    document.getElementById("eye-z-value").textContent = this.value;
  });

  // Look-at position controls
  document.getElementById("at-x").addEventListener("input", function () {
    document.getElementById("at-x-value").textContent = this.value;
  });
  document.getElementById("at-y").addEventListener("input", function () {
    document.getElementById("at-y-value").textContent = this.value;
  });
  document.getElementById("at-z").addEventListener("input", function () {
    document.getElementById("at-z-value").textContent = this.value;
  });

  // Up vector controls
  document.getElementById("up-x").addEventListener("input", function () {
    document.getElementById("up-x-value").textContent = this.value;
  });
  document.getElementById("up-y").addEventListener("input", function () {
    document.getElementById("up-y-value").textContent = this.value;
  });
  document.getElementById("up-z").addEventListener("input", function () {
    document.getElementById("up-z-value").textContent = this.value;
  });
}
