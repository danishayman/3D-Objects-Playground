

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
    const spotlightElements = document.querySelectorAll(".spotlight-direction, .spotlight-control");
    spotlightElements.forEach(elem => {
        elem.style.pointerEvents = isSpotlight ? "auto" : "none";
        elem.style.opacity = isSpotlight ? "1" : "0.5";
    });
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
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
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
    // Component-wise multiplication for light and material properties
    ambientProduct = vec4(
        lightAmbient[0] * materialAmbient[0],
        lightAmbient[1] * materialAmbient[1],
        lightAmbient[2] * materialAmbient[2],
        lightAmbient[3] * materialAmbient[3]
    );
    diffuseProduct = vec4(
        lightDiffuse[0] * materialDiffuse[0],
        lightDiffuse[1] * materialDiffuse[1],
        lightDiffuse[2] * materialDiffuse[2],
        lightDiffuse[3] * materialDiffuse[3]
    );
    specularProduct = vec4(
        lightSpecular[0] * materialSpecular[0],
        lightSpecular[1] * materialSpecular[1],
        lightSpecular[2] * materialSpecular[2],
        lightSpecular[3] * materialSpecular[3]
    );

    // Send updated products to the shader
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
}




function drawLightSource() {
    // Only draw if it's a point light (w component is 1.0)
    if (lightPos[3] === 1.0) {
        // Save current modelView matrix
        const currentModelView = modelView;
        
        // Create small sphere at light position
        modelView = mult(modelView, translate(lightPos[0], lightPos[1], lightPos[2]));
        modelView = mult(modelView, scale(0.1, 0.1, 0.1));
        
        // Update modelView matrix in shader
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
        
        // Use bright emissive material for light source
        const lightColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(lightColor));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(lightColor));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(lightColor));
        
        // Draw sphere
        drawSphere();
        
        // Restore original modelView and materials
        modelView = currentModelView;
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
        updateLightProducts();
    }
}



