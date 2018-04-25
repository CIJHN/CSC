
function hashToRGB(hash) {
    return hash.match(/[A-Za-z0-9]{2}/g)
        .map(function (v) { return parseInt(v, 16) / 256.0 })
}

/**
 * @param {Vector3} vec 
 */
function length(vec) {
    return Math.sqrt(vec.elements[0] * vec.elements[0] + vec.elements[1] * vec.elements[1] + vec.elements[2] * vec.elements[2])
}

/**
 * 
 * @param {Vector3} a 
 * @param {Vector3} b 
 */
function dot(a, b) {
    return a.elements[0] * b.elements[0] + a.elements[1] * b.elements[1] + a.elements[2] * b.elements[2];
}

/**
 * 
 * @param {Vector3} a 
 * @param {Vector3} b 
 */
function diff(a, b) {
    return new Vector3([a.elements[0] - b.elements[0], a.elements[1] - b.elements[1], a.elements[2] - b.elements[2]])
}


/**
 * 
 * @param {Vector3} a 
 * @param {Vector3} b 
 */
function cross(a, b) {
    const ae = a.elements;
    const be = b.elements;
    return new Vector3([
        ae[1] * be[2] - ae[2] * be[1],
        -(ae[0] * be[2] - ae[2] * be[0]),
        ae[0] * be[1] - ae[1] * be[0]
    ]);
}


/**
 * 
 * @param {Vector3} vec 
 */
function unit(vec) {
    const l = length(vec);
    return new Vector3(vec.elements.map(i => i / l))
}
/**
 * 
 * @param {Vector3} vec 
 * @param {number} scale 
 */
function scale(vec, scale) {
    for (let i = 0; i < 3; i++)
        vec.elements[i] *= scale;
}

/**
 * 
 * @param {Vector3} a 
 * @param {Vector3} b 
 */
function sinTheta(a, b) {
    const temp = cross(a, b);
    const multiplier = length(a) * length(b);
    return sin = length(temp) / multiplier;
}