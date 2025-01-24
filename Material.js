// Material properties for different objects



var materialAmbient = vec4(0.5, 0.5, 1.0, 1.0);
var materialDiffuse = vec4(0.0, 0.9, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);




var cylinderMaterial = {
    ambient: vec4(0.5, 0.5, 1.0, 1.0),
    diffuse: vec4(0.0, 0.9, 1.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 0.2,
    diffuseCoef: 0.6,
    specularCoef: 0.3,
    shininess: 60
};

var cubeMaterial = {
    ambient: vec4(1.0, 0.5, 0.5, 1.0),
    diffuse: vec4(0.9, 0.0, 0.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 0.2,
    diffuseCoef: 0.6,
    specularCoef: 0.3,
    shininess: 60
};

var teapotMaterial = {
    ambient: vec4(0.5, 1.0, 0.5, 1.0),
    diffuse: vec4(0.0, 1.0, 0.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 0.2,
    diffuseCoef: 0.6,
    specularCoef: 0.3,
    shininess: 60
};

function initMaterialControls() {
    const objectSelect = document.getElementById('object-select');
    const materialAmbientPicker = document.getElementById('material-ambient');
    const materialDiffusePicker = document.getElementById('material-diffuse');
    const materialSpecularPicker = document.getElementById('material-specular');
    const ambientCoef = document.getElementById('ambient-coef');
    const diffuseCoef = document.getElementById('diffuse-coef');
    const specularCoef = document.getElementById('specular-coef');
    const shininessSlider = document.getElementById('shininess');

    // Initial material color setup
    updateMaterialColorPickers();

    objectSelect.addEventListener('change', updateMaterialColorPickers);

    // Color picker event listeners
    materialAmbientPicker.addEventListener('input', updateMaterialColors);
    materialDiffusePicker.addEventListener('input', updateMaterialColors);
    materialSpecularPicker.addEventListener('input', updateMaterialColors);

    // Coefficient and shininess sliders
    ambientCoef.addEventListener('input', updateMaterialCoefficients);
    diffuseCoef.addEventListener('input', updateMaterialCoefficients);
    specularCoef.addEventListener('input', updateMaterialCoefficients);
    shininessSlider.addEventListener('input', updateMaterialCoefficients);
}

function updateMaterialColorPickers() {
    const objectSelect = document.getElementById('object-select');
    const materialAmbientPicker = document.getElementById('material-ambient');
    const materialDiffusePicker = document.getElementById('material-diffuse');
    const materialSpecularPicker = document.getElementById('material-specular');
    const shininessSlider = document.getElementById('shininess');

    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder':
            currentMaterial = cylinderMaterial;
            break;
        case 'cube':
            currentMaterial = cubeMaterial;
            break;
        case 'teapot':
            currentMaterial = teapotMaterial;
            break;
    }

    // Update color pickers
    materialAmbientPicker.value = rgbToHex(currentMaterial.ambient);
    materialDiffusePicker.value = rgbToHex(currentMaterial.diffuse);
    materialSpecularPicker.value = rgbToHex(currentMaterial.specular);
    shininessSlider.value = currentMaterial.shininess;
}

function updateMaterialColors() {
    const objectSelect = document.getElementById('object-select');
    const materialAmbientPicker = document.getElementById('material-ambient');
    const materialDiffusePicker = document.getElementById('material-diffuse');
    const materialSpecularPicker = document.getElementById('material-specular');

    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder':
            currentMaterial = cylinderMaterial;
            break;
        case 'cube':
            currentMaterial = cubeMaterial;
            break;
        case 'teapot':
            currentMaterial = teapotMaterial;
            break;
    }

    // Convert hex to vec4
    currentMaterial.ambient = hexToRGB(materialAmbientPicker.value);
    currentMaterial.diffuse = hexToRGB(materialDiffusePicker.value);
    currentMaterial.specular = hexToRGB(materialSpecularPicker.value);

}

function updateMaterialCoefficients() {
    const objectSelect = document.getElementById('object-select');
    const ambientCoef = document.getElementById('ambient-coef');
    const diffuseCoef = document.getElementById('diffuse-coef');
    const specularCoef = document.getElementById('specular-coef');
    const shininessSlider = document.getElementById('shininess');

    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder':
            currentMaterial = cylinderMaterial;
            break;
        case 'cube':
            currentMaterial = cubeMaterial;
            break;
        case 'teapot':
            currentMaterial = teapotMaterial;
            break;
    }

    // Update shininess
    currentMaterial.shininess = parseFloat(shininessSlider.value);

    // Update coefficient displays
    document.getElementById('ambient-coef-value').textContent = ambientCoef.value;
    document.getElementById('diffuse-coef-value').textContent = diffuseCoef.value;
    document.getElementById('specular-coef-value').textContent = specularCoef.value;
    document.getElementById('shininess-value').textContent = shininessSlider.value;

}

// Utility function to convert RGB vec4 to hex
function rgbToHex(vec) {
    const r = Math.round(vec[0] * 255);
    const g = Math.round(vec[1] * 255);
    const b = Math.round(vec[2] * 255);
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}


function setMaterialUniforms(material) {
    // Compute products using CURRENT light values
    const ambientProduct = mult(lightAmbient, material.ambient);
    const diffuseProduct = mult(lightDiffuse, material.diffuse);
    const specularProduct = mult(lightSpecular, material.specular);
  
    gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
    gl.uniform4fv(specularProductLoc, flatten(specularProduct));
    gl.uniform1f(shininessLoc, material.shininess);
  }