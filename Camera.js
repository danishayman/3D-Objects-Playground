/*-----------------------------------------------------------------------------------*/
// Camera Class and Controls
/*-----------------------------------------------------------------------------------*/

class Camera {
  constructor() {
      // Initialize camera parameters
      this.eye = vec3(0.0, 0.0, 5.0);    // Camera position
      this.at = vec3(0.0, 0.0, 0.0);     // Look-at point
      this.up = vec3(0.0, 1.0, 0.0);     // Up vector
      
      // Calculate and store the view matrix
      this.viewMatrix = lookAt(this.eye, this.at, this.up);
  }

  // Update camera position with safety checks
  setEye(x, y, z) {
      // Ensure minimum distance from look-at point to prevent singularities
      const MIN_DISTANCE = 0.5;
      const lookAtDist = Math.sqrt(
          Math.pow(x - this.at[0], 2) + 
          Math.pow(y - this.at[1], 2) + 
          Math.pow(z - this.at[2], 2)
      );

      if (lookAtDist < MIN_DISTANCE) {
          // Adjust the position to maintain minimum distance
          const scale = MIN_DISTANCE / lookAtDist;
          x = this.at[0] + (x - this.at[0]) * scale;
          y = this.at[1] + (y - this.at[1]) * scale;
          z = this.at[2] + (z - this.at[2]) * scale;
      }

      this.eye = vec3(x, y, z);
      this.updateViewMatrix();
  }

  // Update look-at point with safety checks
  setAt(x, y, z) {
      const MIN_DISTANCE = 0.5;
      const lookAtDist = Math.sqrt(
          Math.pow(this.eye[0] - x, 2) + 
          Math.pow(this.eye[1] - y, 2) + 
          Math.pow(this.eye[2] - z, 2)
      );

      if (lookAtDist < MIN_DISTANCE) {
          // Adjust the look-at point to maintain minimum distance
          const scale = MIN_DISTANCE / lookAtDist;
          x = this.eye[0] + (x - this.eye[0]) * scale;
          y = this.eye[1] + (y - this.eye[1]) * scale;
          z = this.eye[2] + (z - this.eye[2]) * scale;
      }

      this.at = vec3(x, y, z);
      this.updateViewMatrix();
  }

  // Update up vector with normalization
  setUp(x, y, z) {
      // Ensure the up vector is not zero
      if (x === 0 && y === 0 && z === 0) {
          y = 1.0; // Default to positive Y if zero vector
      }
      
      // Normalize the up vector
      const length = Math.sqrt(x * x + y * y + z * z);
      this.up = vec3(x/length, y/length, z/length);
      this.updateViewMatrix();
  }

  // Recalculate view matrix after any changes
  updateViewMatrix() {
      this.viewMatrix = lookAt(this.eye, this.at, this.up);
  }
}

  // Default camera values
  const DEFAULT_CAMERA = {
      eye: vec3(0.0, 0.0, 5.0),
      at: vec3(0.0, 0.0, 0.0),
      up: vec3(0.0, 1.0, 0.0)
  };

  // Initialize camera instance
  let camera = new Camera();

// Set up all camera control UI elements
function setupCameraControls() {
  // Get all UI elements
  const eyeX = document.getElementById('eye-x');
  const eyeY = document.getElementById('eye-y');
  const eyeZ = document.getElementById('eye-z');
  
  const atX = document.getElementById('at-x');
  const atY = document.getElementById('at-y');
  const atZ = document.getElementById('at-z');
  
  const upX = document.getElementById('up-x');
  const upY = document.getElementById('up-y');
  const upZ = document.getElementById('up-z');

  // Update value displays
  document.getElementById('eye-x-value').textContent = eyeX.value;
  document.getElementById('eye-y-value').textContent = eyeY.value;
  document.getElementById('eye-z-value').textContent = eyeZ.value;
  
  document.getElementById('at-x-value').textContent = atX.value;
  document.getElementById('at-y-value').textContent = atY.value;
  document.getElementById('at-z-value').textContent = atZ.value;
  
  document.getElementById('up-x-value').textContent = upX.value;
  document.getElementById('up-y-value').textContent = upY.value;
  document.getElementById('up-z-value').textContent = upZ.value;
}

// Set up event listeners for camera controls
function setupCameraControlListeners() {
  // Eye position controls
  document.getElementById('eye-x').addEventListener('input', function(e) {
      document.getElementById('eye-x-value').textContent = e.target.value;
      camera.setEye(
          parseFloat(e.target.value),
          parseFloat(document.getElementById('eye-y').value),
          parseFloat(document.getElementById('eye-z').value)
      );
  });

  document.getElementById('eye-y').addEventListener('input', function(e) {
      document.getElementById('eye-y-value').textContent = e.target.value;
      camera.setEye(
          parseFloat(document.getElementById('eye-x').value),
          parseFloat(e.target.value),
          parseFloat(document.getElementById('eye-z').value)
      );
  });

  document.getElementById('eye-z').addEventListener('input', function(e) {
      document.getElementById('eye-z-value').textContent = e.target.value;
      camera.setEye(
          parseFloat(document.getElementById('eye-x').value),
          parseFloat(document.getElementById('eye-y').value),
          parseFloat(e.target.value)
      );
  });

  // Look-at point controls
  document.getElementById('at-x').addEventListener('input', function(e) {
      document.getElementById('at-x-value').textContent = e.target.value;
      camera.setAt(
          parseFloat(e.target.value),
          parseFloat(document.getElementById('at-y').value),
          parseFloat(document.getElementById('at-z').value)
      );
  });

  document.getElementById('at-y').addEventListener('input', function(e) {
      document.getElementById('at-y-value').textContent = e.target.value;
      camera.setAt(
          parseFloat(document.getElementById('at-x').value),
          parseFloat(e.target.value),
          parseFloat(document.getElementById('at-z').value)
      );
  });

  document.getElementById('at-z').addEventListener('input', function(e) {
      document.getElementById('at-z-value').textContent = e.target.value;
      camera.setAt(
          parseFloat(document.getElementById('at-x').value),
          parseFloat(document.getElementById('at-y').value),
          parseFloat(e.target.value)
      );
  });

  // Up vector controls
  document.getElementById('up-x').addEventListener('input', function(e) {
      document.getElementById('up-x-value').textContent = e.target.value;
      camera.setUp(
          parseFloat(e.target.value),
          parseFloat(document.getElementById('up-y').value),
          parseFloat(document.getElementById('up-z').value)
      );
  });

  document.getElementById('up-y').addEventListener('input', function(e) {
      document.getElementById('up-y-value').textContent = e.target.value;
      camera.setUp(
          parseFloat(document.getElementById('up-x').value),
          parseFloat(e.target.value),
          parseFloat(document.getElementById('up-z').value)
      );
  });

  document.getElementById('up-z').addEventListener('input', function(e) {
      document.getElementById('up-z-value').textContent = e.target.value;
      camera.setUp(
          parseFloat(document.getElementById('up-x').value),
          parseFloat(document.getElementById('up-y').value),
          parseFloat(e.target.value)
      );
  });
}