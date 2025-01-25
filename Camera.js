/*-----------------------------------------------------------------------------------*/
// Camera Controls
/*-----------------------------------------------------------------------------------*/

function Camera() {
    this.eye = vec3(0, 0, 5);    // Initial camera position (matches HTML defaults)
    this.at = vec3(0, 0, 0);     // Looking at origin
    this.up = vec3(0, 1, 0);     // Up vector

    // Get view matrix using lookAt()
    this.getViewMatrix = function() {
        return lookAt(this.eye, this.at, this.up);
    };

    // Update camera parameters from HTML controls
    this.updateFromControls = function() {
        this.eye = vec3(
            parseFloat(document.getElementById('eye-x').value),
            parseFloat(document.getElementById('eye-y').value),
            parseFloat(document.getElementById('eye-z').value)
        );
        
        this.at = vec3(
            parseFloat(document.getElementById('at-x').value),
            parseFloat(document.getElementById('at-y').value),
            parseFloat(document.getElementById('at-z').value)
        );
    };
}

// Global camera instance
var camera = new Camera();