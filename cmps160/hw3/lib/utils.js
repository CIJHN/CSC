
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

function ave(a, b) {
    const ae = a.elements;
    const be = b.elements;
    return new Vector3([(ae[0] + be[0]) / 2, (ae[1] + be[1]) / 2, (ae[2] + be[2]) / 2]);
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
    return new Vector3(vec.elements.map(v => v * scale))
}

function mul(a, b) {
    const other = new Vector3();
    for (let i = 0; i < 3; ++i)
        other.elements[i] = a.elements[i] * b.elements[i];
    return other;
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

/**
 * 
 * @param {Matrix4} mat
 * @return {number[]}
 */
function flatMatrix(mat) {
    const e = mat.elements;
    return [
        e[12] * e[0] + e[13] * e[4] + e[14] * e[8],
        e[12] * e[1] + e[13] * e[5] + e[14] * e[9],
        e[12] * e[2] + e[13] * e[6] + e[14] * e[10],
    ]
}

/**
 * Convert mouse event to openGL coord position
 * 
 * @param {MouseEvent} ev 
 */
function glPosition(canvas, ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    const rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    return { x, y };
}

Matrix4.prototype.toString = function () {
    const e = this.elements;
    const str =
        `${e[0].toFixed(2)} ${e[4].toFixed(2)} ${e[8].toFixed(2)} ${e[12].toFixed(2)}
${e[1].toFixed(2)} ${e[5].toFixed(2)} ${e[9].toFixed(2)} ${e[13].toFixed(2)}
${e[2].toFixed(2)} ${e[6].toFixed(2)} ${e[10].toFixed(2)} ${e[14].toFixed(2)}
${e[3].toFixed(2)} ${e[7].toFixed(2)} ${e[11].toFixed(2)} ${e[15].toFixed(2)}
    `
    return str;
}

Vector3.prototype.toString = function () {
    return `(${this.elements[0]},${this.elements[1]},${this.elements[2]})`;
}
Vector4.prototype.toString = function () {
    return `(${this.elements[0]},${this.elements[1]},${this.elements[2]},${this.elements[3]})`;
}