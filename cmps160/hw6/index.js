/**
 * Global var for render tick per second
 */
const TPS = 24;


/**
 * Current drawing polyline
 * @type {Polyline}
 */
let polyline = [];
const cylinders = [];// { vertices: new Float32Array(0), indexes: new Uint16Array(0), normals: new Float32Array(0), colors: new Float32Array(0), id: 0 };
let projectionType = 'perspective';
const perspective = {
    fovy: 90, aspect: 1, near: 1, far: 100
};
const otho = {
    left: -1, right: 1, top: 1, bottom: -1, near: -2, far: 2,
}
const lookAt = {
    eyeX: 0, eyeY: 0, eyeZ: 1.5,
    centerX: 0, centerY: 0, centerZ: 0,
    upX: 0, upY: 1, upZ: 0,
}
let selectedObj = 255;
let hoveredObj = 255;
let lightPosition = [1, 1, 1];
const uiHandlers = [];
let modelId = 254;

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


    let index = 0;
    const rotAngle = 360.0 / faces;
    const zero = new Vector3();

    const id = modelId--;
    const amb = new Vector4([0, 255 / 255, 0, id / 255.0]);

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

            let norm = new Vector3(fmat(rot, zero)).normalize();
            normals.push(...norm.elements, ...norm.elements); // first 2 normal

            rot.rotate(-rotAngle, rotX, rotY, 0);

            const flatUpper = fmat(rot, from);
            const flatLower = fmat(rot, to);
            vertices.push(...flatUpper, ...flatLower); // current surface right edge

            indexes.push(index, index + 1, index + 2); // current surface first triangle
            indexes.push(index + 2, index + 3, index + 1); // current surface sec triagnle

            norm = new Vector3(fmat(rot, zero)).normalize();

            normals.push(...norm.elements, ...norm.elements); // second 2 normal

            const c = amb;
            colors.push(...c.elements, ...c.elements, ...c.elements, ...c.elements);

            index += 4;
        }
    }
    return {
        translation: new Matrix4().setTranslate(0, 0, 0),
        rotation: new Matrix4(),
        vertices: new Float32Array(vertices),
        indexes: new Uint16Array(indexes),
        normals: new Float32Array(normals),
        colors: new Float32Array(colors),
        id,
    }
}

function getSelectedObject() {
    for (const c of cylinders) {
        if (c.id === selectedObj) return c;
    }
    return undefined;
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
    setup([
        `
        precision mediump float;
        precision mediump int;
        
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_ProjMatrix;
        uniform mat4 u_ModelMatrix;
        
        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        attribute vec4 a_Color;
        
        uniform int u_Lighting; 
        
        // dot light
        uniform vec3 u_LightPosition;
        
        // ambient light
        uniform vec3 u_AmbientColor; 
        uniform vec3 u_DiffuseColor;
        uniform vec3 u_SpecularColor;
        uniform int u_Glossiness;
        
        uniform vec3 u_ViewDirection;
        
        varying vec4 v_Color;
        varying vec3 v_Normal;
        varying vec3 v_LightDirection;
        varying float v_Depth;
        
        void main() {
            vec4 worldPos = u_ModelMatrix * a_Position;
            gl_Position = u_ProjMatrix * u_ViewMatrix * worldPos;
        
            if (u_Lighting == 0) { // zero means no lighting, draw line
                v_Color = vec4(1, 0, 0, 1);
            } else {  
                v_Color = a_Color;
                vec4 normal = u_ModelMatrix * vec4(a_Normal, 0);
                v_Normal = normalize(normal).xyz;
                v_LightDirection = normalize(u_LightPosition - worldPos.xyz);
            } 
        }
        `,
        `
        precision mediump float;
        precision mediump int;
        
        uniform int u_Lighting;
        uniform float u_HighLight;
        
        uniform vec3 u_LightColor;
        uniform int u_Glossiness;
        uniform vec3 u_ViewDirection;
        uniform vec3 u_AmbientColor; 
        uniform vec3 u_DiffuseColor;
        uniform vec3 u_SpecularColor;
        
        varying vec4 v_Color;
        varying vec3 v_Normal;
        varying vec3 v_LightDirection;
        varying float v_Depth;
        
        void main () {
            if (u_Lighting == 0) {
                gl_FragColor = v_Color;
            } else {
                int glossiness = u_Glossiness;
                vec3 normal = v_Normal;
                vec3 lightDirection = v_LightDirection;
                vec3 view = u_ViewDirection;
                
                vec3 reflection = 2.0 * max(dot(lightDirection, normal), 0.0) * normal - lightDirection;
        
                vec3 ambientColor = u_AmbientColor;
                vec3 diffuseColor = max(dot(lightDirection, normal), 0.0) * u_DiffuseColor;
                vec3 specularColor = pow(max(dot(reflection, view), 0.0), float(glossiness)) * u_SpecularColor;
        
                vec4 col = vec4(ambientColor + diffuseColor + specularColor, v_Color.a);
                if (u_HighLight != 0.0) {
                    gl_FragColor = vec4(col.rgb + u_HighLight, v_Color.a);
                } else {
                    gl_FragColor = col;
                }
            } 
        }
        `
    ])
    // Promise.all([ldfile('shaders/basic.vert'), ldfile('shaders/basic.frag')])
    //     .then(setup);
}

function setup([VSHADER_SOURCE, FSHADER_SOURCE]) {
    const renderTask = [];
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

        const faces = Number.parseInt(document.getElementById('face').value);
        const radius = Number.parseFloat(document.getElementById('width').value);

        cylinders.push(bakeCylinders(polyline, faces, radius))
        // concatModel(cylinders, bakeCylinders(polyline, faces, radius));

        polyline = [];
    }

    /******************
     * GL init section  
     ******************/

    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);
    let shader = 1;
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

    const u_LightPosition = uni('u_LightPosition');
    const u_DiffuseColor = uni('u_DiffuseColor');
    const u_SpecularColor = uni('u_SpecularColor');
    const u_AmbientColor = uni('u_AmbientColor');
    const u_Glossiness = uni('u_Glossiness');
    const u_ViewDirection = uni('u_ViewDirection');
    const u_HighLight = uni('u_HighLight');
    const u_ModelMatrix = uni('u_ModelMatrix');

    gl.uniform3fv(u_ViewDirection, [0, 0, -1]);
    gl.uniform3fv(u_LightPosition, lightPosition);
    gl.uniform3fv(u_DiffuseColor, [1, 1, 1]);

    const u_ViewMatrix = uni('u_ViewMatrix');
    const u_ProjMatrix = uni('u_ProjMatrix');

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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1i(u_Lighting, 0);
        
        const renderLine = (line) => {
            if (line.length < 1) return;
            const pass = [...line];
            if (line === polyline) // if it's current drawing polyline
                pass.push(point(tempPoint.x, tempPoint.y)); // add temp point to draw

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
            gl.bufferData(gl.ARRAY_BUFFER, flatPolyline(pass), gl.DYNAMIC_DRAW);

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
                if (selectedObj === cy.id) {
                    gl.uniform1f(u_HighLight, 0.2);
                } else if (hoveredObj === cy.id) {
                    gl.uniform1f(u_HighLight, 0.05);
                } else {
                    gl.uniform1f(u_HighLight, 0.0);
                }
                gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().concat(cy.translation).concat(cy.rotation).elements);

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
        cylinders.forEach(renderCylinder);
        while (renderTask.length !== 0) {
            renderTask.pop()();
        }
    }

    /********************
     * controller section
     ********************/

    const colorInput = document.getElementById('color');

    const spc = document.getElementById('specular_color');
    spc.onchange = function () {
        gl.uniform3fv(u_SpecularColor, hashToRGB(this.value));
    };
    spc.onchange();

    const amb = document.getElementById('ambient_color');
    amb.onchange = function () {
        gl.uniform3fv(u_AmbientColor, hashToRGB(this.value));
    }
    amb.onchange();

    const glos = document.getElementById('glossiness');
    glos.onchange = function () {
        gl.uniform1i(u_Glossiness, this.value);
    }
    glos.onchange();

    document.getElementById('reset_canvas').onclick = function () {
        while (cylinders.length !== 0) cylinders.pop();
    };
    document.getElementById('shiftLight').onclick = function () {
        lightPosition[0] += 0.1;
        gl.uniform3fv(u_LightPosition, lightPosition);
    }
    document.getElementById('rotateLight').onclick = function () {
        const m = new Matrix4();
        m.setTranslate(lightPosition[0], lightPosition[1], lightPosition[2]);
        m.rotate(10, 0, 1, 0);
        lightPosition = flatMatrix(m);
        gl.uniform3fv(u_LightPosition, lightPosition);
    }
    let rotCmer;
    document.getElementById('rotateCamera').onclick = function () {
        if (this.checked) {
            if (rotCmer) clearInterval(rotCmer);
            rotCmer = setInterval(() => {
                const m = new Matrix4();
                m.setTranslate(lookAt.eyeX, lookAt.eyeY, lookAt.eyeZ);
                m.rotate(10, 0, 1, 0);
                const [x, y, z] = flatMatrix(m);
                lookAt.eyeX = x;
                lookAt.eyeY = y;
                lookAt.eyeZ = z;
                updateLookAt();
            }, 100);
        } else {
            clearInterval(rotCmer);
        }
    }
    let inv;
    document.getElementById('animateLight').onchange = function () {
        if (this.checked) {
            if (inv) clearInterval(inv);
            inv = setInterval(() => {
                const m = new Matrix4();
                m.setTranslate(lightPosition[0], lightPosition[1], lightPosition[2]);
                m.rotate(10, 0, 1, 0);
                lightPosition = flatMatrix(m);
                gl.uniform3fv(u_LightPosition, lightPosition);
            }, 100);
        } else {
            clearInterval(inv);
        }
    }

    function updatePerspective() {
        if (projectionType !== 'perspective') return;
        const projMat =  new Matrix4().setPerspective(perspective.fovy, perspective.aspect, perspective.near, perspective.far);
        console.log('update proj')
        console.log(projMat.elements)
        gl.uniformMatrix4fv(u_ProjMatrix, false,
            projMat.elements);
    }
    function updateOtho() {
        if (projectionType !== 'otho') return;
        const projMat = new Matrix4().setOrtho(otho.left, otho.right, otho.bottom, otho.top, otho.near, otho.far);
        console.log('update proj')
        console.log(projMat.elements)
        gl.uniformMatrix4fv(u_ProjMatrix, false,
            projMat.elements);
    }
    function updateLookAt() {
        const viewMat = new Matrix4().setLookAt(lookAt.eyeX, lookAt.eyeY, lookAt.eyeZ,
            lookAt.centerX, lookAt.centerY, lookAt.centerZ,
            lookAt.upX, lookAt.upY, lookAt.upZ);
        console.log('update view')
        console.log(viewMat.elements)
        gl.uniformMatrix4fv(u_ViewMatrix, false,
            viewMat.elements);
    }

    updateLookAt();

    const projElem = document.getElementById('projection');

    const fovElem = document.getElementById('fov');
    fovElem.onchange = function () {
        perspective.fovy = Number.parseInt(this.value);
        updatePerspective();
    }
    fovElem.onchange();

    const nearZElem = document.getElementById('nearZ');
    nearZElem.onchange = function () {
        perspective.near = Number.parseInt(this.value);
        updatePerspective();
    }
    nearZElem.onchange();

    const farZElem = document.getElementById('farZ');
    farZElem.onchange = function () {
        perspective.far = Number.parseInt(this.value);
        updatePerspective();
    }
    farZElem.onchange();

    const onearZElem = document.getElementById('onearZ');
    onearZElem.onchange = function () {
        otho.near = Number.parseFloat(this.value);
        updateOtho();
    }
    onearZElem.onchange();

    const ofarZElem = document.getElementById('ofarZ');
    ofarZElem.onchange = function () {
        otho.far = Number.parseFloat(this.value);
        updateOtho();
    }
    ofarZElem.onchange();

    projElem.onchange = function () {
        projectionType = this.value;
        if (this.value === 'perspective') {
            updatePerspective();
        } else {
            updateOtho();
        }
    }
    projElem.onchange();

    let drag = false;
    let dragRight = false;
    let dragMiddle = false;
    let dragStart = {};
    let dragEnd = {};

    const tempPoint = { x: 0, y: 0 };

    canvas.onmousewheel = function (ev) {
        const obj = getSelectedObject();
        if (obj) {
            const scale = ev.deltaY > 0 ? 1.1 : 0.9;
            obj.translation.scale(scale, scale, scale);
            ev.preventDefault();
            return false;
        }
    }

    canvas.onmousemove = function (ev) {
        const { x, y } = glPos(ev);
        tempPoint.x = x;
        tempPoint.y = y;

        dragEnd = { x, y };

        if (drag) {
            const x = dragEnd.x - dragStart.x;
            const y = dragEnd.y - dragStart.y;

            const obj = getSelectedObject();
            if (obj) obj.translation.translate(x, y, 0);
        }

        if (dragRight) {
            let x = dragEnd.x - dragStart.x;
            let y = dragEnd.y - dragStart.y;
            x *= 100;
            y *= 100;

            if (x !== 0 && y !== 0) {
                const dir = new Vector3([x, y, 0]).normalize();
                const obj = getSelectedObject();
                if (obj) obj.rotation.rotate(10, dir.elements[1], dir.elements[0], 0);
            }
        }

        if (dragMiddle) {
            let x = dragEnd.x - dragStart.x;
            let y = dragEnd.y - dragStart.y;

            if (y !== 0) {
                const obj = getSelectedObject();
                if (obj) obj.translation.translate(0, 0, y);
            }

            if (x !== 0) {
                const obj = getSelectedObject();
                if (obj) obj.rotation.rotate(x * 80, 0, 0, 1);
            }
        }
        dragStart = dragEnd;


        const rect = ev.target.getBoundingClientRect();
        const x_in_canvas = ev.clientX - rect.left, y_in_canvas = rect.bottom - ev.clientY;
        renderTask.push(() => {
            const pixels = new Uint8Array(4);
            gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            hoveredObj = pixels[3];
        })

        return false;
    };
    canvas.onmouseup = function (ev) {
        drag = false;
        dragRight = false;
        dragMiddle = false;
    }
    canvas.onmousedown = function (ev) {
        const { x, y } = glPos(ev);
        // console.log(ev)
        ev.preventDefault()


        const rect = ev.target.getBoundingClientRect();
        const x_in_canvas = ev.clientX - rect.left, y_in_canvas = rect.bottom - ev.clientY;
        renderTask.push(() => {
            const pixels = new Uint8Array(4);
            gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            console.log(`r: ${pixels[0]}, g: ${pixels[1]}, b: ${pixels[2]}, a: ${pixels[3]}`);

            const selecting = selectedObj !== 255;
            selectedObj = pixels[3];

            if (pixels[3] !== 255) {
                if (ev.button === 0) drag = true;
                if (ev.button === 1) dragMiddle = true;
                if (ev.button === 2) dragRight = true;
                dragStart = { x, y };
            }
            if (pixels[3] !== 255 || selecting) {

                return;
            }
            polyline.push(point(x, y));
            if (ev.button === 2) {
                flush();
                return;
            }
        })
        return false;
    };
}
