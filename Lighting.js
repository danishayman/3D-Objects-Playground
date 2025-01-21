

// Variables for lighting control
var ambientProduct, diffuseProduct, specularProduct;
var ambient = 0.5,
  diffuse = 0.5,
  specular = 0.5,
  shininess = 60;
var lightPos = vec4(3.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(ambient, ambient, ambient, 1.0);
var lightDiffuse = vec4(diffuse, diffuse, diffuse, 1.0);
var lightSpecular = vec4(specular, specular, specular, 1.0);

var materialAmbient = vec4(0.5, 0.5, 1.0, 1.0);
var materialDiffuse = vec4(0.0, 0.9, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var lightSourceSelect, lightToggle, lightTypeSelect;
var ambientColorPicker, diffuseColorPicker, specularColorPicker;
var lightXSlider, lightYSlider, lightZSlider;
var lightXValue, lightYValue, lightZValue;
var spotlightCutoff, spotlightDirX, spotlightDirY, spotlightDirZ;

function initLightControls() {
    // Get all control elements
    lightSourceSelect = document.getElementById("light-source");
    lightToggle = document.getElementById("light-toggle");
    lightTypeSelect = document.getElementById("point-light-type");
    
    // Color pickers
    ambientColorPicker = document.getElementById("ambient-color");
    diffuseColorPicker = document.getElementById("diffuse-color");
    specularColorPicker = document.getElementById("specular-color");
    
    // Position sliders and values
    lightXSlider = document.getElementById("light-x");
    lightYSlider = document.getElementById("light-y");
    lightZSlider = document.getElementById("light-z");
    lightXValue = document.getElementById("light-x-value");
    lightYValue = document.getElementById("light-y-value");
    lightZValue = document.getElementById("light-z-value");
    
    // Add event listeners for light source changes
    lightSourceSelect.addEventListener("change", updateLightSource);
    lightToggle.addEventListener("change", toggleLight);
    lightTypeSelect.addEventListener("change", updateLightType);
    
    // Add event listeners for color changes
    ambientColorPicker.addEventListener("input", updateLightColors);
    diffuseColorPicker.addEventListener("input", updateLightColors);
    specularColorPicker.addEventListener("input", updateLightColors);
    
    // Add event listeners for position changes
    lightXSlider.addEventListener("input", updateLightPosition);
    lightYSlider.addEventListener("input", updateLightPosition);
    lightZSlider.addEventListener("input", updateLightPosition);
}

function updateLightSource() {
    // Show/hide relevant controls based on light source
    const isSpotlight = lightSourceSelect.value === "spot";
    document.querySelector(".spotlight-direction").style.display = isSpotlight ? "block" : "none";
    document.querySelector(".spotlight-control").style.display = isSpotlight ? "block" : "none";
    gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    
}

function toggleLight(event) {
    if (!event.target.checked) {
        // Store current values before turning off
        lightAmbient = vec4(0.0, 0.0, 0.0, 1.0);
        lightDiffuse = vec4(0.0, 0.0, 0.0, 1.0);
        lightSpecular = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        // Restore values from color pickers
        updateLightColors();
    }
    
    // Update products
    updateLightProducts();
}

function updateLightType() {
    // Update w component of lightPos (0.0 for directional, 1.0 for positional)
    lightPos[3] = lightTypeSelect.value === "directional" ? 0.0 : 1.0;
    gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    
}

function hexToRGB(hex) {
    const r = parseInt(hex.substr(1,2), 16) / 255;
    const g = parseInt(hex.substr(3,2), 16) / 255;
    const b = parseInt(hex.substr(5,2), 16) / 255;
    return vec4(r, g, b, 1.0);
}

function updateLightColors() {
    if (lightToggle.checked) {
        lightAmbient = hexToRGB(ambientColorPicker.value);
        lightDiffuse = hexToRGB(diffuseColorPicker.value);
        lightSpecular = hexToRGB(specularColorPicker.value);
        updateLightProducts();
    }
}

function updateLightPosition() {
    const x = parseFloat(lightXSlider.value);
    const y = parseFloat(lightYSlider.value);
    const z = parseFloat(lightZSlider.value);
    
    lightPos = vec4(x, y, z, lightPos[3]);
    
    
    // Update value displays
    lightXValue.textContent = x.toFixed(1);
    lightYValue.textContent = y.toFixed(1);
    lightZValue.textContent = z.toFixed(1);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
}

function updateLightProducts() {
    // Calculate lighting products
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    // Send to shader
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
}


// Add a function to draw the light sphere
function drawLightSource() {
    // Don't draw if light is off

    // Save current material properties
    const savedAmbient = materialAmbient;
    const savedDiffuse = materialDiffuse;
    const savedSpecular = materialSpecular;

    // Make the light sphere emit light (bright white)
    materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
    materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    // Update material products
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));

    // Create model view matrix for light sphere
    let lightModelView = mat4();
    // Position the light sphere at light position
    lightModelView = mult(lightModelView, translate(lightPos[0], lightPos[1], lightPos[2]));

    // Send matrices to shader
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(lightModelView));
    nMatrix = normalMatrix(lightModelView, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    // Draw the light sphere
    gl.drawArrays(gl.TRIANGLES, totalV, lightSphereV);

    // Restore original material properties
    materialAmbient = savedAmbient;
    materialDiffuse = savedDiffuse;
    materialSpecular = savedSpecular;

    // Restore material products
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
}