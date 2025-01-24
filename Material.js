// Material properties for different objects

let ambientCoef, diffuseCoef, specularCoef, shininessSlider;



var materialAmbient = vec4(0.5, 0.5, 1.0, 1.0);
var materialDiffuse = vec4(0.0, 0.9, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);




var cylinderMaterial = {
    ambient: vec4(0.5, 0.5, 1.0, 1.0),
    diffuse: vec4(0.0, 0.9, 1.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 1.0,
    diffuseCoef: 1.0,
    specularCoef: 1.0,
    shininess: 50,
    texture: 'none'
};

var cubeMaterial = {
    ambient: vec4(1.0, 0.5, 0.5, 1.0),
    diffuse: vec4(0.9, 0.0, 0.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 1.0,
    diffuseCoef: 1.0,
    specularCoef: 1.0,
    shininess: 50,
    texture: 'none'
};

var teapotMaterial = {
    ambient: vec4(0.5, 1.0, 0.5, 1.0),
    diffuse: vec4(0.0, 1.0, 0.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    ambientCoef: 1.0,
    diffuseCoef: 1.0,
    specularCoef: 1.0,
    shininess: 50,
    texture: 'none'
};

function initMaterialControls() {
    const objectSelect = document.getElementById('object-select');
    const materialAmbientPicker = document.getElementById('material-ambient');
    const materialDiffusePicker = document.getElementById('material-diffuse');
    const materialSpecularPicker = document.getElementById('material-specular');
    const textureSelect = document.getElementById('texture-select');
    ambientCoef = document.getElementById('ambient-coef');
    diffuseCoef = document.getElementById('diffuse-coef');
    specularCoef = document.getElementById('specular-coef');
    shininessSlider = document.getElementById('shininess');
    textureSelect.addEventListener('change', updateTexture);

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
    shininessSlider.addEventListener('input', updateShininess);
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


    // Update coefficient sliders
    ambientCoef.value = currentMaterial.ambientCoef;
    diffuseCoef.value = currentMaterial.diffuseCoef;
    specularCoef.value = currentMaterial.specularCoef;
    shininessSlider.value = currentMaterial.shininess;
    
    // Update displayed values
    document.getElementById('ambient-coef-value').textContent = currentMaterial.ambientCoef;
    document.getElementById('diffuse-coef-value').textContent = currentMaterial.diffuseCoef;
    document.getElementById('specular-coef-value').textContent = currentMaterial.specularCoef;
    document.getElementById('shininess-value').textContent = currentMaterial.shininess;
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

    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder': currentMaterial = cylinderMaterial; break;
        case 'cube': currentMaterial = cubeMaterial; break;
        case 'teapot': currentMaterial = teapotMaterial; break;
    }

    // Update coefficients
    currentMaterial.ambientCoef = parseFloat(ambientCoef.value);
    currentMaterial.diffuseCoef = parseFloat(diffuseCoef.value);
    currentMaterial.specularCoef = parseFloat(specularCoef.value);

    // Update displays
    document.getElementById('ambient-coef-value').textContent = ambientCoef.value;
    document.getElementById('diffuse-coef-value').textContent = diffuseCoef.value;
    document.getElementById('specular-coef-value').textContent = specularCoef.value;
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
    // Helper function to scale color by coefficient
    const scaleColor = (color, coef) => {
        return vec4(
            color[0] * coef,
            color[1] * coef,
            color[2] * coef,
            color[3] // Alpha remains unchanged
        );
    };

    // Calculate products with coefficients
    const ambientProduct = mult(lightAmbient, scaleColor(material.ambient, material.ambientCoef));
    const diffuseProduct = mult(lightDiffuse, scaleColor(material.diffuse, material.diffuseCoef));
    const specularProduct = mult(lightSpecular, scaleColor(material.specular, material.specularCoef));

    // Update shader uniforms
    gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
    gl.uniform4fv(specularProductLoc, flatten(specularProduct));
    gl.uniform1f(shininessLoc, material.shininess);
}


function updateShininess() {
    const objectSelect = document.getElementById('object-select');
    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder': currentMaterial = cylinderMaterial; break;
        case 'cube': currentMaterial = cubeMaterial; break;
        case 'teapot': currentMaterial = teapotMaterial; break;
    }
    
    // Use the GLOBAL shininessSlider reference
    currentMaterial.shininess = parseInt(shininessSlider.value);
    document.getElementById('shininess-value').textContent = shininessSlider.value;
}



const textures = {};
function initTextures() {
    const textureList = ['wood', 'metal', 'marble'];
    textureList.forEach(name => {
        textures[name] = gl.createTexture();
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, textures[name]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src = `textures/${name}.jpg`;
    });
}


function updateTexture() {
    const objectSelect = document.getElementById('object-select');
    const textureSelect = document.getElementById('texture-select');
    
    let currentMaterial;
    switch(objectSelect.value) {
        case 'cylinder': currentMaterial = cylinderMaterial; break;
        case 'cube': currentMaterial = cubeMaterial; break;
        case 'teapot': currentMaterial = teapotMaterial; break;
    }
    
    currentMaterial.texture = textureSelect.value;
}