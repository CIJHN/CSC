/**
 * 
 * @param {Float32Array} vertices 
 */
function calculateNormals(vertices) {
    const normals = new Float32Array(vertices.length);
    for (let i = 0; i < vertices.length; i += 12) {
        const norm = cross(new Vector3([
            vertices[i + 3] - vertices[i],
            vertices[i + 4] - vertices[i + 1],
            vertices[i + 5] - vertices[i + 2]]),
            new Vector3([
                vertices[i + 6] - vertices[i],
                vertices[i + 7] - vertices[i + 1],
                vertices[i + 8] - vertices[i + 2]
            ])).normalize();
        normals[i + 0] = normals[i + 3] = normals[i + 6] = normals[i + 9] = norm.elements[0];
        normals[i + 1] = normals[i + 4] = normals[i + 7] = normals[i + 10] = norm.elements[1];
        normals[i + 2] = normals[i + 5] = normals[i + 8] = normals[i + 11] = norm.elements[2];
    }
    return normals;
}
