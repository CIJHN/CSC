/**
 * Global var for render tick per second
 */
const TPS = 1;


/**
 * Current drawing polyline
 * @type {Polyline}
 */
let polyline = [];

/**
 * @type {SimpleModel}
 */
const cylinders = { vertices: new Float32Array(0), indexes: new Uint16Array(0), normals: new Float32Array(0), colors: new Float32Array(0) };


/**
 * Flat the polyline to drawable array
 * 
 * @param {Polyline} line
 * @return Float32Array
 */
function flatPolyline(line) {
    const pos = new Float32Array(line.length * 3);
    for (let i = 0; i < line.length; i++) {
        const p = line[i];
        pos[i * 3] = p.elements[0];
        pos[i * 3 + 1] = p.elements[1];
        pos[i * 3 + 2] = p.elements[2];
    }
    return pos;
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

let lightDirection = [1, 1, 1];

const color = new Vector4([0, 1, 0, 1]);


/**
 * @param {Polyline} polyline 
 * @param {number} faces 
 * @param {number} radius 
 * @return {SimpleModel}
 */
function bakeCylinders(polyline, faces, radius) {
    const vertices = [];
    const indexes = [];
    const normals = [];
    const colors = [];

    const amb = new Vector4([0, 1, 0, 1]);

    let index = 0;
    const rotAngle = 360.0 / faces;
    const zero = new Vector3();

    for (let i = 0; i < polyline.length - 1; ++i) {
        const from = polyline[i];
        const to = polyline[i + 1];
        let colorOff = 0;

        const rot = new Matrix4();
        rot.setTranslate(0, 0, radius);

        const fmat = (m, t) => {
            const arr = flatMatrix(m);
            arr[0] += t.elements[0];
            arr[1] += t.elements[1];
            arr[2] += t.elements[2];
            return arr;
        }

        const rotX = to.elements[0] - from.elements[0];
        const rotY = to.elements[1] - from.elements[1];
        const rotZ = to.elements[2] - from.elements[2];

        for (let i = 0; i < faces; ++i) {
            const lastUpper = fmat(rot, from);
            const lastLower = fmat(rot, to);
            vertices.push(...lastUpper, ...lastLower); // current surface left edge

            rot.rotate(-rotAngle, rotX, rotY, 0);

            const flatUpper = fmat(rot, from);
            const flatLower = fmat(rot, to);
            vertices.push(...flatUpper, ...flatLower); // current surface right edge

            indexes.push(index, index + 1, index + 2); // current surface first triangle
            indexes.push(index + 2, index + 3, index + 1); // current surface sec triagnle

            const vecLeft = diff(new Vector3(lastLower), new Vector3(lastUpper)).normalize();
            const vecDown = diff(new Vector3(flatUpper), new Vector3(lastUpper)).normalize();
            const norm = cross(vecDown, vecLeft).normalize();

            normals.push(...norm.elements, ...norm.elements, ...norm.elements, ...norm.elements); // current 4 normal

            let c;
            // c = calculateColor(norm, green, lightColor, lightDirection);
            c = amb;
            colors.push(...c.elements, ...c.elements, ...c.elements, ...c.elements);

            index += 4;
        }
    }
    return {
        vertices: new Float32Array(vertices),
        indexes: new Uint16Array(indexes),
        normals: new Float32Array(normals),
        colors: new Float32Array(colors),
    }
}

/**
 * 
 * @param {SimpleModel} dest 
 * @param {SimpleModel} incoming 
 */
function concatModel(dest, incoming) {
    const off = dest.vertices.length / 3;
    const vers = new Float32Array(dest.vertices.length + incoming.vertices.length);
    vers.set(dest.vertices);
    vers.set(incoming.vertices, dest.vertices.length);

    const n = new Float32Array(dest.normals.length + incoming.normals.length);
    n.set(dest.normals);
    n.set(incoming.normals, dest.normals.length);

    const c = new Float32Array(dest.colors.length + incoming.colors.length);
    c.set(dest.colors);
    c.set(incoming.colors, dest.colors.length);

    const ind = new Uint16Array(dest.indexes.length + incoming.indexes.length);
    ind.set(dest.indexes);
    ind.set(incoming.indexes.map(i => i + off), dest.indexes.length);

    dest.vertices = vers;
    dest.indexes = ind;
    dest.normals = n;
    dest.colors = c;
}


/**
 * @param {string} name 
 * @return {Promise<string>}
 */
function ldfile(name) {
    return new Promise((resolve, reject) => {
        loadFile(name, (content) => {
            resolve(content)
        })
    })
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

function main() {
    // Promise.all([ldfile('shaders/basic.vert'), ldfile('shaders/basic.frag')])
    //     .then(setup);
    setup([`attribute vec4 a_Position;
    attribute vec3 a_Normal;
    attribute vec4 a_Color;
    
    uniform int u_Lighting; 
    
    uniform int u_Lighting_1;
    uniform vec3 u_LightDirection_1;
    uniform vec3 u_LightColor_1;
    
    uniform int u_Lighting_2;
    uniform vec3 u_LightDirection_2;
    uniform vec3 u_LightColor_2;
    
    uniform vec4 u_Color; // ambi color
    
    varying vec4 v_Color; 
    
    void main() {
        gl_Position = a_Position;
        
        if (u_Lighting == 1) {
            vec3 diffuseColor = vec3(0, 0, 0);
            if (u_Lighting_1 == 1) {
                vec3 c = max(dot(normalize(u_LightDirection_1), normalize(a_Normal)), 0.0) * u_LightColor_1;
                diffuseColor = diffuseColor + c;
            }
            if (u_Lighting_2 == 1) {
                vec3 c = max(dot(normalize(u_LightDirection_2), normalize(a_Normal)), 0.0) * u_LightColor_2;
                diffuseColor = diffuseColor + c;
            }
    
            v_Color = vec4(diffuseColor * a_Color.rgb, a_Color.a);
        } else {
            v_Color = a_Color;
        }
    }`,`precision mediump float;
    varying vec4 v_Color;
    
    void main () {
        gl_FragColor = v_Color;
    }
    `])
}

function setup([VSHADER_SOURCE, FSHADER_SOURCE]) {
    /**
     * Caculate the point at x and y
     * 
     * @param {number} x
     * @param {number} y
     * @return {Vector3}
     */
    function point(x, y) {
        return new Vector3([
            x,
            y,
            0,
        ]);
    }

    /**
     * Flush current line and begin record new line
     */
    function flush() {
        if (polyline.length <= 1) return;
        console.log('You have finished drawing');
        let s = ''
        for (let i = 0; i < polyline.length; i += 2) {
            s += `(${polyline[i].x}, ${polyline[i].y}) `
        }
        console.log(`your polyline ${s}`);

        const faces = Number.parseInt(document.getElementById('face').value);
        const radius = Number.parseFloat(document.getElementById('width').value);

        console.log(`faces: ${faces}, radius: ${radius}`)

        concatModel(cylinders, bakeCylinders(polyline, faces, radius));

        polyline = [];
    }

    /******************
     * GL init section  
     ******************/

    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    const attr = (loc) => {
        const l = gl.getAttribLocation(gl.program, loc)
        if (l < 0)
            throw new Error(`Fail to get storage location of ${loc}`)
        return l;
    }

    const uni = (loc) => {
        const l = gl.getUniformLocation(gl.program, loc)
        if (l < 0)
            throw new Error(`Fail to get storage location of ${loc}`)
        return l;
    }

    /**
     * Convert mouse event to openGL coord position
     * 
     * @param {MouseEvent} ev 
     */
    const glPos = (ev) => {
        let x = ev.clientX; // x coordinate of a mouse pointer
        let y = ev.clientY; // y coordinate of a mouse pointer
        const rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        return { x, y };
    }

    const a_Position = attr('a_Position');
    const a_Normal = attr('a_Normal');
    const a_Color = attr('a_Color');

    const u_Lighting_1 = uni('u_Lighting_1');
    const u_LightDirection_1 = uni('u_LightDirection_1');
    const u_LightColor_1 = uni('u_LightColor_1');

    const u_Lighting_2 = uni('u_Lighting_2');
    const u_LightDirection_2 = uni('u_LightDirection_2');
    const u_LightColor_2 = uni('u_LightColor_2');

    gl.uniform1i(u_Lighting_1, 1);
    gl.uniform1i(u_Lighting_2, 1);

    gl.uniform3fv(u_LightDirection_1, lightDirection);
    gl.uniform3fv(u_LightColor_1, [1, 1, 1]);

    gl.uniform3fv(u_LightDirection_2, [1, 1, 1]);
    gl.uniform3fv(u_LightColor_2, [1, 0, 0]);

    const u_Lighting = uni('u_Lighting');

    const b_Pos = gl.createBuffer();
    const ib_Pos = gl.createBuffer();
    const b_Norm = gl.createBuffer();
    const b_Color = gl.createBuffer();
    if (!b_Pos) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Normal);
    gl.enableVertexAttribArray(a_Color);

    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b_Norm);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b_Color);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

    gl.disableVertexAttribArray(a_Normal);
    gl.disableVertexAttribArray(a_Color);
    /**
     * start render loop
     */
    setInterval(render, 1000 / TPS);

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const renderLine = (line) => {
            if (line.length < 1) return;
            gl.uniform1i(u_Lighting, 0);
            const pass = [...line];
            if (line === polyline) // if it's current drawing polyline
                pass.push(point(tempPoint.x, tempPoint.y)); // add temp point to draw
            const pos = flatPolyline(pass);

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
            gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

            gl.drawArrays(gl.LINE_STRIP, 0, pass.length);
        }
        const renderCylinder =
            /**
             * @param {SimpleModel} cy
             */
            (cy) => {
                if (cy.indexes.length === 0) return
                gl.enableVertexAttribArray(a_Color);
                gl.enableVertexAttribArray(a_Normal);
                gl.uniform1i(u_Lighting, 1);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
                gl.bufferData(gl.ARRAY_BUFFER, cy.vertices, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Norm);
                gl.bufferData(gl.ARRAY_BUFFER, cy.normals, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Color);
                gl.bufferData(gl.ARRAY_BUFFER, cy.colors, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib_Pos);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cy.indexes, gl.STATIC_DRAW);

                gl.drawElements(gl.TRIANGLES, cy.indexes.length, gl.UNSIGNED_SHORT, 0);
                gl.disableVertexAttribArray(a_Normal);
                gl.disableVertexAttribArray(a_Color);

            }
        renderLine(polyline);
        renderCylinder(cylinders);
    }

    /********************
     * controller section
     ********************/

    const colorInput = document.getElementById('color');
    setupIOSOR("fileinput");

    document.getElementById('shift').onclick = function () {
        for (let i = 0; i < cylinders.vertices.length; i += 3) {
            cylinders.vertices[i] += 0.01;
        }
    }

    document.getElementById('extra_sor').onclick = function () {
        const sor = readFile();      // get SOR from file
        if (sor) {
            cylinders.vertices = new Float32Array(sor.vertices);
            cylinders.indexes = new Uint16Array(sor.indexes);
        }
    }
    document.getElementById('save_canvas').onclick = function () {
        const sor = new SOR();
        sor.objName = "model";
        sor.vertices = cylinders.vertices;
        sor.indexes = cylinders.indexes;
        saveFile(sor);
    };
    document.getElementById('reset_canvas').onclick = function () {
        cylinders.indexes = new Uint16Array(0);
        cylinders.vertices = new Float32Array(0);
    };
    document.getElementById('light_1_toggle').onchange = function () {
        gl.uniform1i(u_Lighting_1, this.checked ? 1 : 0)
    }
    document.getElementById('light_2_toggle').onchange = function () {
        gl.uniform1i(u_Lighting_2, this.checked ? 1 : 0)
    }
    document.getElementById('light_1_color').onchange = function () {
        gl.uniform3fv(u_LightColor_1, hashToRGB(this.value))
    }
    document.getElementById('light_2_color').onchange = function () {
        gl.uniform3fv(u_LightColor_2, hashToRGB(this.value))
    }
    document.getElementById('shiftLight').onclick = function () {
        lightDirection[0] -= 0.1;
        gl.uniform3fv(u_LightDirection_1, lightDirection);
    }
    document.getElementById('rotateLight').onclick = function () {
        const m = new Matrix4();
        m.setTranslate(lightDirection[0], lightDirection[1], lightDirection[2]);
        m.rotate(10, 0, 1, 0);
        lightDirection = flatMatrix(m);
        gl.uniform3fv(u_LightDirection_1, lightDirection);
    }
    let inv;
    document.getElementById('animateLight').onchange = function () {
        if (this.checked) {
            if (inv) clearInterval(inv);
            inv = setInterval(() => {
                const m = new Matrix4();
                m.setTranslate(lightDirection[0], lightDirection[1], lightDirection[2]);
                m.rotate(1, 0, 1, 0);
                lightDirection = flatMatrix(m);
                gl.uniform3fv(u_LightDirection_1, lightDirection);
            }, 10);
        } else {
            clearInterval(inv);
        }
    }

    const tempPoint = { x: 0, y: 0 };
    canvas.onmousemove = function (ev) {
        const { x, y } = glPos(ev);
        tempPoint.x = x;
        tempPoint.y = y;
    };
    canvas.onmousedown = function (ev) {
        const { x, y } = glPos(ev);
        console.log(`x:${x} y:${y} ${ev.button === 0 ? 'left' : 'right'} click`);
        polyline.push(point(x, y));
        if (ev.button === 2) {
            flush();
            return false;
        }
    };
    // colorInput.onchange = () => {
    //     const colors = hashToRGB(colorInput.value)
    //     gl.uniform4f(u_Color, colors[0], colors[1], colors[2], 1);
    // }
    // colorInput.onchange();
}
