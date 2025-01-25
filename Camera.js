/*-----------------------------------------------------------------------------------*/
// Camera Controls
/*-----------------------------------------------------------------------------------*/

var camera = {
    eye: vec3(0, 0, 5),    // Initial eye position (matches HTML slider defaults)
    at: vec3(0, 0, 0),     // Look-at point
    up: vec3(0, 1, 0),     // Up vector
    viewMatrix: mat4()     // View matrix storage
};

// Update view matrix using lookAt
function updateCameraView() {
    camera.viewMatrix = lookAt(camera.eye, camera.at, camera.up);
}

// Connect HTML sliders to camera parameters
function setupCameraControls() {
    const eyeX = document.getElementById('eye-x');
    const eyeY = document.getElementById('eye-y');
    const eyeZ = document.getElementById('eye-z');
    const atX = document.getElementById('at-x');
    const atY = document.getElementById('at-y');
    const atZ = document.getElementById('at-z');

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

    // Add event listeners
    eyeX.addEventListener('input', () => {
        camera.eye[0] = parseFloat(eyeX.value);
        updateCameraView();
    });
    eyeY.addEventListener('input', () => {
        camera.eye[1] = parseFloat(eyeY.value);
        updateCameraView();
    });
    eyeZ.addEventListener('input', () => {
        camera.eye[2] = parseFloat(eyeZ.value);
        updateCameraView();
    });
    atX.addEventListener('input', () => {
        camera.at[0] = parseFloat(atX.value);
        updateCameraView();
    });
    atY.addEventListener('input', () => {
        camera.at[1] = parseFloat(atY.value);
        updateCameraView();
    });
    atZ.addEventListener('input', () => {
        camera.at[2] = parseFloat(atZ.value);
        updateCameraView();
    });

    updateCameraView();
}