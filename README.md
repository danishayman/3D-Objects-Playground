# 3D Graphics Rendering Engine 🎮

![alt text](image.png)
This project implements a WebGL-based 3D graphics rendering engine with support for multiple geometric shapes, dynamic lighting, material properties, and camera controls. ✨

## 🚀 Try It Yourself

Experience the 3D Graphics Rendering Engine in action: [Live Demo](https://danishayman.github.io/WebGL-Objects/)

## ✨ Features

### 🎨 Geometric Shapes
- Cylinder with customizable dimensions and caps
- Utah Teapot with adjustable tessellation
- Cube with texturable surfaces
- Light source visualization using a sphere

### 🔄 Animation Controls
- Independent rotation controls for each shape
- Axis selection (X, Y, Z) for rotation
- Toggle animation for each object
- Smooth animation rendering at 60fps

### 💡 Lighting System
- Configurable light types:
  - Point light
  - Directional light
  - Spotlight with adjustable parameters
- Light source properties:
  - Ambient, diffuse, and specular components
  - Adjustable color and intensity
  - Positional control in 3D space
- Spotlight features:
  - Adjustable cutoff angle
  - Configurable direction
  - Intensity control

### 🎯 Material Properties
- Per-object material settings:
  - Ambient, diffuse, and specular colors
  - Reflection coefficients
  - Shininess control
- Real-time material updates
- Independent material settings for each object

### 📷 Camera System
- Interactive camera controls:
  - Adjustable eye position (camera location)
  - Look-at point configuration
  - Up vector manipulation
- Camera reset functionality
- Perspective projection
- Safety checks to prevent invalid camera configurations

### 🎭 Shading Options
- Smooth shading
- Flat shading
- Dynamic normal calculation
- Per-vertex lighting

## 🛠️ Technical Implementation

### 🔧 Core Technologies
- WebGL for 3D rendering
- JavaScript for application logic
- HTML5 for structure
- CSS3 for styling and layout

### 📁 Project Structure
```
project-root/
│
├── Common/                  # Common utilities
│   ├── webgl-utils.js
│   ├── initShaders.js
│   └── MV.js
│
├── Geometry/               # 3D object definitions
│   ├── Cube.js
│   ├── Cylinder.js
│   ├── Sphere.js
│   └── Teapot.js
│
├── images/                # Image assets
│   └── favicon.png
│
├── Camera.js              # Camera control implementation
├── ConfigureWebGL.js      # WebGL configuration
├── Lighting.js            # Lighting system
├── Main.js               # Main application logic
├── Material.js           # Material management
├── Shading.js           # Shading implementations
├── Variables.js         # Global variables
├── index.html           # Main HTML file
├── style.css           # Styling definitions
└── README.md           # Project documentation
```

### 🎯 Architecture
- Modular code organization with separate files for:
  - Geometric primitives (Cube.js, Cylinder.js, Teapot.js)
  - Camera controls (Camera.js)
  - Lighting system (Lighting.js)
  - Material management (Material.js)
  - Shading implementations (Shading.js)
  - WebGL configuration (ConfigureWebGL.js)

### ⚡ Shaders
- Vertex shader with support for:
  - Model-view and projection transformations
  - Normal transformation
  - Lighting calculations
  - Texture coordinates
- Fragment shader with:
  - Texture sampling
  - Color blending
  - Final color output

## 🚀 Setup and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/danishayman/CPC354-Asg2.git
   ```

2. Set up a local web server. You can use Python's built-in server:
   ```bash
   python -m http.server
   ```
   Or any other local development server.

3. Open the application in a WebGL-compatible browser:
   ```
   http://localhost:8000
   ```

4. Use the control panel on the right to:
   - Toggle object animations
   - Adjust lighting parameters
   - Modify material properties
   - Control camera position
   - Change shading modes

## 🌐 Browser Compatibility

The application requires a browser with WebGL support. Tested and compatible with:
- Google Chrome (recommended) 🎯
- Mozilla Firefox 🦊
- Safari 🧭
- Microsoft Edge 🌐

## ⚡ Performance Considerations

- The application uses efficient buffer management for vertex data
- Implements proper cleanup and resource management
- Optimized matrix calculations for transformations
- Balanced tessellation for the teapot model
