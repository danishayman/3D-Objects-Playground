/*-----------------------------------------------------------------------------------*/
// Torus
/*-----------------------------------------------------------------------------------*/

function Torus(radialSegments = 32, tubularSegments = 24, majorRadius = 1.0, minorRadius = 0.4) {
    var vertices = [];
    var normals = [];
    
    for(let i = 0; i <= radialSegments; i++) {
        const phi = (i % radialSegments) * 2 * Math.PI / radialSegments;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        
        for(let j = 0; j <= tubularSegments; j++) {
            const theta = (j % tubularSegments) * 2 * Math.PI / tubularSegments;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
            
            // Vertex position
            const x = (majorRadius + minorRadius * cosTheta) * cosPhi;
            const y = (majorRadius + minorRadius * cosTheta) * sinPhi;
            const z = minorRadius * sinTheta;
            
            // Normal vector (same as position for a perfect torus)
            const nx = cosPhi * cosTheta;
            const ny = sinPhi * cosTheta;
            const nz = sinTheta;
            
            vertices.push(vec4(x, y, z, 1));
            normals.push(vec4(nx, ny, nz, 0));
        }
    }

    var points = [];
    var finalNormals = [];
    
    // Create triangles
    for(let i = 0; i < radialSegments; i++) {
        for(let j = 0; j < tubularSegments; j++) {
            const a = (tubularSegments + 1) * i + j;
            const b = (tubularSegments + 1) * (i + 1) + j;
            const c = (tubularSegments + 1) * (i + 1) + j + 1;
            const d = (tubularSegments + 1) * i + j + 1;
            
            // First triangle
            points.push(vertices[a]);
            points.push(vertices[b]);
            points.push(vertices[d]);
            finalNormals.push(normals[a], normals[b], normals[d]);
            
            // Second triangle
            points.push(vertices[b]);
            points.push(vertices[c]);
            points.push(vertices[d]);
            finalNormals.push(normals[b], normals[c], normals[d]);
        }
    }

    var torusData = {
        Point: points,
        Normal: finalNormals,
        
        Rotate: function(angle, axis) {
            var rotationMatrix = rotate(angle, axis);
            this.Point = this.Point.map(point => mult(rotationMatrix, point));
            this.Normal = this.Normal.map(normal => mult(rotationMatrix, normal));
        },
        
        Scale: function(sx, sy, sz) {
            var scaleMatrix = scalem(sx, sy, sz);
            this.Point = this.Point.map(point => mult(scaleMatrix, point));
        },
        
        Translate: function(tx, ty, tz) {
            var translationMatrix = translate(tx, ty, tz);
            this.Point = this.Point.map(point => mult(translationMatrix, point));
        }
    };

    return torusData;
}

function drawTorus() {
    // Calculate offset based on previous objects
    const offset = cylinderV + cubeV + teapotV + lightSphereV + dodecahedronV;
    
    // Set model-view matrix
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "modelViewMatrix"),
        false,
        flatten(modelViewMatrix)
    );
    
    // Draw torus vertices
    gl.drawArrays(gl.TRIANGLES, offset, torusV);
}