// Shading.js
function computeFlatNormals(vertices) {
  const normals = [];
  for (let i = 0; i < vertices.length; i += 3) {
    const v0 = vertices[i];
    const v1 = vertices[i + 1];
    const v2 = vertices[i + 2];

    const p0 = vec3(v0[0], v0[1], v0[2]);
    const p1 = vec3(v1[0], v1[1], v1[2]);
    const p2 = vec3(v2[0], v2[1], v2[2]);

    const edge1 = subtract(p1, p0);
    const edge2 = subtract(p2, p0);
    let normal = cross(edge1, edge2);
    normal = normalize(normal);

    // Assign the same normal to all three vertices of the triangle
    normals.push(normal, normal, normal);
  }
  return normals;
}

let isFlatShading = false;
let originalCylinderNormals = [];
let originalTeapotNormals = [];
let originalCubeNormals = [];

function initShading() {
  originalCylinderNormals = [...cylinderObj.Normal];
  originalTeapotNormals = [...teapotObj.Normals];
  originalCubeNormals = [...cubeObj.Normal];
}

function toggleShadingMode(mode) {
  isFlatShading = mode === "flat";

  if (isFlatShading) {
    cylinderObj.Normal = computeFlatNormals(cylinderObj.Point);
    teapotObj.Normals = computeFlatNormals(teapotObj.TriangleVertices);
    // Cube uses face normals by default, no change needed
  } else {
    cylinderObj.Normal = originalCylinderNormals;
    teapotObj.Normals = originalTeapotNormals;
    cubeObj.Normal = originalCubeNormals;
  }

  rebuildBuffers();
}

function rebuildBuffers() {
  pointsArray = [];
  normalsArray = [];
  texCoordsArray = [];

  concatData(cylinderObj.Point, cylinderObj.Normal);
  concatData(teapotObj.TriangleVertices, teapotObj.Normals);
  concatData(cubeObj.Point, cubeObj.Normal, cubeObj.TexCoord);

  // Update WebGL buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
}
