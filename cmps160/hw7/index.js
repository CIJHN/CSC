/**
 * Global var for render tick per second
 */
const TPS = 24;

class Component {
    constructor() {
        this.translation = { x: 0, y: 0, z: 0 }
        this.scale = { x: 0, y: 0, z: 0 }
        this.rotationX = { angle: 0, x: 1, y: 0, z: 0 }
        this.rotationY = { angle: 0, x: 0, y: 1, z: 0 }
        this.rotationZ = { angle: 0, x: 0, y: 0, z: 1 }
    }
}
class Camera extends Component {
    constructor() {
        super()
        this.perspective = {
            fovy: 90, aspect: 1, near: 1, far: 100,
        }
        this.ortho = {
            left: -1, right: 1, top: 1, bottom: -1, near: -2, far: 2,
        }
        this.projection = 'perspective'
        this.lookAt = {
            eyeX: 0, eyeY: 0, eyeZ: 1.5,
            centerX: 0, centerY: 0, centerZ: 0,
            upX: 0, upY: 1, upZ: 0,
        }
    }
}
class Light extends Component {
    constructor() {
        super()
        this.ambientColor = '#000033'
        this.diffuseColor = '#FFFFFF'
        this.specularColor = '#FFFFFF'
        this.glossiness = 10
    }
}

/**
 * Current drawing polyline
 * @type {Polyline}
 */
let polyline = [];
let modelId = 254;

/**
 * Flat the polyline to drawable array
 * 
 * @param {Polyline} line
 * @return Float32Array
 */
function flatPolyline(line) {
    const pos = new Float32Array(line.length * 4);
    for (let i = 0; i < line.length; i++) {
        const p = line[i];
        pos[i * 4] = p.elements[0];
        pos[i * 4 + 1] = p.elements[1];
        pos[i * 4 + 2] = p.elements[2];
        pos[i * 4 + 3] = p.elements[3];
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
 * @param {Vector4[]} polyline 
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
            arr.push(t.elements[3])
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
        id: id,
        vertices: new Float32Array(vertices),
        indexes: new Uint16Array(indexes),
        normals: new Float32Array(normals),
        colors: new Float32Array(colors),
    }
}


function main() {
    // Promise.all([ldfile('shaders/basic.vert'), ldfile('shaders/basic.frag')])
    //     .then(setup);

    setup([
        `
        precision mediump float;
precision mediump int;

uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform mat4 u_ModelMatrix;

uniform int u_Lighting; 
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientColor; 
uniform vec3 u_DiffuseColor;
uniform vec3 u_SpecularColor;
uniform int u_Glossiness;

attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

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
}`,`
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
}

function setup([VSHADER_SOURCE, FSHADER_SOURCE]) {
    const renderTask = [];

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

    const a_Position = attr('a_Position');
    const a_Normal = attr('a_Normal');
    const a_Color = attr('a_Color');

    const u_CameraPosition = uni('u_CameraPosition');

    const u_LightPosition = uni('u_LightPosition');
    const u_DiffuseColor = uni('u_DiffuseColor');
    const u_SpecularColor = uni('u_SpecularColor');
    const u_AmbientColor = uni('u_AmbientColor');
    const u_Glossiness = uni('u_Glossiness');
    const u_HighLight = uni('u_HighLight');

    const u_ModelMatrix = uni('u_ModelMatrix');
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
    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b_Norm);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b_Color);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

    gl.disableVertexAttribArray(a_Normal);
    gl.disableVertexAttribArray(a_Color);


    /********************
     * controller section
     ********************/

    const app = new Vue({
        el: '#app',
        data: {
            camera: {
                rotZ: 0,
                translateZ: 0,
                perspective: {
                    fovy: 90, aspect: 1, near: 1, far: 100,
                },
                ortho: {
                    left: -1, right: 1, top: 1, bottom: -1, near: -2, far: 2,
                },
                projection: 'perspective',
                lookAt: {
                    eyeX: 0, eyeY: 0, eyeZ: 1.5,
                    centerX: 0, centerY: 0, centerZ: 0,
                }
            },
            light: new Light(),
            components: [],
            width: 0,
            face: 0,
            selectingId: 255,
            hoveringId: 255,
            shaking: false,
        },
        computed: {
            projection() {
                if (this.camera.projection === 'ortho') {
                    return new Matrix4().setOrtho(this.camera.ortho.left, this.camera.ortho.right, this.camera.ortho.bottom, this.camera.ortho.top, this.camera.ortho.near, this.camera.ortho.far)
                } else {
                    return new Matrix4().setPerspective(this.camera.perspective.fovy, this.camera.perspective.aspect, this.camera.perspective.near, this.camera.perspective.far)
                }
            },
            view() {
                const nums = flatMatrix(new Matrix4().setTranslate(0, 1, 0).rotate(this.camera.rotZ, 0, 0, 1))
                return new Matrix4().setLookAt(this.camera.lookAt.eyeX, this.camera.lookAt.eyeY, this.camera.lookAt.eyeZ + this.camera.translateZ,
                    this.camera.lookAt.centerX, this.camera.lookAt.centerY, this.camera.lookAt.centerZ + this.camera.translateZ,
                    nums[0], nums[1], nums[2])
            },
            glossiness() { return Number.parseInt(this.light.glossiness) },
            ambientColor() { return hashToRGB(this.light.ambientColor) },
            diffuseColor() { return hashToRGB(this.light.diffuseColor) },
            specularColor() { return hashToRGB(this.light.specularColor) },
            lightPosition() { return [this.light.translation.x, this.light.translation.y, this.light.translation.z] },
            cameraPosition() { return [this.camera.lookAt.centerX, this.camera.lookAt.centerY, this.camera.lookAt.centerZ] },

            selectingComponent() {
                for (const c of this.components)
                    if (c.id === this.selectingId)
                        return c;
                return undefined
            }
        },
        watch: {
            projection() { this.updateProjection() },
            view() { this.updateView() },
            glossiness() { this.updateGlossiness() },
            ambientColor() { this.updateAmbientColor() },
            diffuseColor() { this.updateDiffuseColor() },
            specularColor() { this.updateSpecularColor() },
            lightPosition() { this.updateLightPosition() },
            cameraPosition() { this.updateCameraPosition() },
        },
        mounted() {
            this.camera.lookAt.eyeZ = 2
            this.camera.perspective.near = 1
            this.camera.perspective.far = 100

            this.camera.ortho.near = 1
            this.camera.ortho.far = 100

            this.light.translation.z = 5
            this.light.translation.y = 5
            this.light.translation.x = 5
            this.light.glossiness = 10
            this.light.specularColor = '#ffffff'
            this.light.ambientColor = '#000033'

            this.face = 12
            this.width = 0.2

            this.updateProjection()
            this.updateView()
            this.updateAmbientColor()
            this.updateDiffuseColor()
            this.updateSpecularColor()
            this.updateGlossiness()
            this.updateLightPosition()
            this.updateCameraPosition()
        },
        methods: {
            updateGlossiness() { gl.uniform1i(u_Glossiness, this.glossiness) },
            updateAmbientColor() { gl.uniform3fv(u_AmbientColor, this.ambientColor) },
            updateDiffuseColor() { gl.uniform3fv(u_DiffuseColor, this.diffuseColor) },
            updateSpecularColor() { gl.uniform3fv(u_SpecularColor, this.specularColor) },
            updateLightPosition() { gl.uniform3fv(u_LightPosition, this.lightPosition) },
            updateCameraPosition() { gl.uniform3fv(u_CameraPosition, this.cameraPosition) },
            updateProjection() { gl.uniformMatrix4fv(u_ProjMatrix, false, this.projection.elements) },
            updateView() { gl.uniformMatrix4fv(u_ViewMatrix, false, this.view.elements) },
            addComponent(c) {
                const com = new Component()
                com.id = c.id
                com.data = Object.freeze(c)
                this.components.push(com)
            },
            reset() {
                this.components = [];
            },
            pan(x, y) {
                this.camera.lookAt.eyeX -= x;
                this.camera.lookAt.centerX -= x;
                this.camera.lookAt.eyeY -= y;
                this.camera.lookAt.centerY -= y;
            },
            shake() {
                if (this.shaking) return;
                this.shaking = true
                let angle = 0
                let interval = setInterval(() => {
                    this.camera.rotZ += 8 * Math.sin(angle++)
                }, 10)
                setTimeout(() => {
                    clearInterval(interval)
                }, 1000)
                this.shaking = false
            },
        },
    })


    /**
     * Convert mouse event to openGL coord position
     * 
     * @param {MouseEvent} ev 
     */
    const glPos = (ev) => {
        let x = ev.clientX; // x coordinate of a mouse pointer
        let y = ev.clientY; // y coordinate of a mouse pointer
        const rect = ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)
        const nums = new Matrix4(app.view).invert()
            .concat(new Matrix4(app.projection).invert())
            .multiplyVector4(new Vector4([x, y, 0, 1]))
        return {
            x: nums.elements[0],
            y: nums.elements[1],
            z: nums.elements[2],
            w: nums.elements[3],
        };
    }

    const toActualSpace = (x, y) => {
        const nums = flatMatrix(new Matrix4()
            .concat(app.view)
            .concat(app.projection)
            .translate(x, y, 0)
        )
        return { x: nums[0], y: nums[1], z: nums[2] };
    }
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
                pass.push(new Vector4([tempPoint.x, tempPoint.y, tempPoint.z, tempPoint.w])); // add temp point to draw
            const pos = flatPolyline(pass);

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
            gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

            gl.drawArrays(gl.LINE_STRIP, 0, pass.length);
        }
        const renderComponent =
            (com) => {
                if (com.data.indexes.length === 0) return
                gl.enableVertexAttribArray(a_Color);
                gl.enableVertexAttribArray(a_Normal);

                gl.uniform1i(u_Lighting, 1);
                if (app.selectingId === com.id) {
                    gl.uniform1f(u_HighLight, 0.2);
                } else if (app.hoveringId === com.id) {
                    gl.uniform1f(u_HighLight, 0.05);
                } else {
                    gl.uniform1f(u_HighLight, 0.0);
                }

                gl.uniformMatrix4fv(u_ModelMatrix, false,
                    new Matrix4()
                        .translate(com.translation.x, com.translation.y, com.translation.z)
                        .rotate(com.rotationZ.angle, 0, 0, 1)
                        .rotate(com.rotationY.angle, 0, 1, 0)
                        .rotate(com.rotationX.angle, 1, 0, 0)
                        .elements);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
                gl.bufferData(gl.ARRAY_BUFFER, com.data.vertices, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Norm);
                gl.bufferData(gl.ARRAY_BUFFER, com.data.normals, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, b_Color);
                gl.bufferData(gl.ARRAY_BUFFER, com.data.colors, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib_Pos);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, com.data.indexes, gl.STATIC_DRAW);

                gl.drawElements(gl.TRIANGLES, com.data.indexes.length, gl.UNSIGNED_SHORT, 0);

                gl.disableVertexAttribArray(a_Normal);
                gl.disableVertexAttribArray(a_Color);
            }
        renderLine(polyline);

        app.components.forEach(renderComponent);
        while (renderTask.length !== 0) {
            renderTask.pop()();
        }
    }

    let drag = false;
    let dragRight = false;
    let dragMiddle = false;
    let dragStart = {};
    let dragEnd = {};
    let paning = false

    const tempPoint = { x: 0, y: 0, z: 0, w: 0 };

    canvas.onmousewheel = function (ev) {
        const obj = app.selectingComponent;
        if (obj) {
            const delta = ev.deltaY > 0 ? 0.1 : -0.1;
            obj.scale.x += delta;
            obj.scale.y += delta;
            obj.scale.z += delta;
            ev.preventDefault();
            return false;
        }
    }

    canvas.onmousemove = function (ev) {
        const { x, y, z, w } = glPos(ev);
        dragEnd = { x, y };

        tempPoint.x = x;
        tempPoint.y = y;
        tempPoint.z = z;
        tempPoint.w = w;

        if (ev.ctrlKey) {
            if (paning) {
                const x = dragEnd.x - dragStart.x;
                const y = dragEnd.y - dragStart.y;
                app.pan(x, y);
            }
        } else {
            if (drag) {
                const x = dragEnd.x - dragStart.x;
                const y = dragEnd.y - dragStart.y;

                const obj = app.selectingComponent;
                if (obj) {
                    obj.translation.x += x;
                    obj.translation.y += y;
                };
            }

            if (dragRight) {
                let x = dragEnd.x - dragStart.x;
                let y = dragEnd.y - dragStart.y;

                x *= 100;
                y *= 100;

                if (x !== 0 && y !== 0) {
                    const obj = app.selectingComponent;
                    if (obj) {
                        obj.rotationX.angle += (y > 0 ? 10 : -10);
                        obj.rotationY.angle += (x > 0 ? 10 : -10);
                    }
                }
            }

            if (dragMiddle) {
                let x = dragEnd.x - dragStart.x;
                let y = dragEnd.y - dragStart.y;

                if (y !== 0) {
                    const obj = app.selectingComponent;
                    if (obj) {
                        obj.translation.z += y;
                    }
                }

                if (x !== 0) {
                    const obj = app.selectingComponent;
                    if (obj) {
                        obj.rotationZ.angle += (x > 0 ? 10 : -10);
                    }
                }
            }
        }

        dragStart = dragEnd;

        const rect = ev.target.getBoundingClientRect();
        const x_in_canvas = ev.clientX - rect.left, y_in_canvas = rect.bottom - ev.clientY;
        renderTask.push(() => {
            const pixels = new Uint8Array(4);
            gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            app.hoveringId = pixels[3];
        })

        return false;
    };
    canvas.onmouseup = function (ev) {
        drag = false;
        dragRight = false;
        dragMiddle = false;
        paning = false;
    }
    canvas.onmousedown = function (ev) {
        const { x, y, z, w } = glPos(ev);

        if (ev.ctrlKey) {
            if (ev.button === 0) {
                paning = true
                dragStart = { x, y };
            }
            return;
        }

        const rect = ev.target.getBoundingClientRect();
        const x_in_canvas = ev.clientX - rect.left, y_in_canvas = rect.bottom - ev.clientY;
        renderTask.push(() => {
            const pixels = new Uint8Array(4);
            gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            console.log(`r: ${pixels[0]}, g: ${pixels[1]}, b: ${pixels[2]}, a: ${pixels[3]}`);

            const selecting = app.selectingId !== 255;
            app.selectingId = pixels[3];

            if (pixels[3] !== 255) {
                if (ev.button === 0) drag = true;
                if (ev.button === 1) dragMiddle = true;
                if (ev.button === 2) dragRight = true;
                dragStart = { x, y };
            }
            if (pixels[3] !== 255 || selecting) {
                return;
            }
            polyline.push(new Vector4([x, y, z, w]));

            if (ev.button === 2) {
                if (polyline.length <= 1) return;
                const model = bakeCylinders(polyline, app.face, app.width);
                polyline = [];
                app.addComponent(model)
                return;
            }
        })
        return false;
    };
}
