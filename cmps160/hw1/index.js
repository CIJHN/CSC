const VSHADER_SOURCE =
    `attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec3 a_Color;
varying vec3 v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
}
`;

const FSHADER_SOURCE =
    `
    precision mediump float;
    varying vec3 v_Color;
    void main () {
    gl_FragColor = vec4(v_Color, 1.0);
}
`;

/**
 * Global var for render tick per second
 */
const TPS = 60;


let mode = 'draw';

/**
 * Current drawing polyline
 * @type {Polyline}
 */
let polyline = [];

/**
 * All polylines
 * @type {Polyline[]}
 */
const polylines = [polyline];

function shiftAll(direction) {
    let xOff = 0;
    let yOff = 0;
    switch (direction) {
        case 'up':
            yOff = 0.01;
            break;
        case 'down':
            yOff = -0.01;
            break;
        case 'right':
            xOff = 0.01;
            break;
        case 'left':
            xOff = -0.01;
            break;
    }
    for (const polyline of polylines) {
        for (const p of polyline) {
            p.x += xOff;
            p.y += yOff;
        }
    }
}

/**
 * Flat the polyline to drawable array
 * 
 * @param {Polyline} line
 * @return {{color: Float32Array, size: Float32Array, pos: Float32Array}}
 */
function flatPolyline(line) {
    const color = new Float32Array(line.length * 3);
    const size = new Float32Array(line.length);
    const pos = new Float32Array(line.length * 2);
    for (let i = 0; i < line.length; i++) {
        const p = line[i];
        color[i * 3] = p.r;
        color[i * 3 + 1] = p.g;
        color[i * 3 + 2] = p.b;
        size[i] = p.size;
        pos[i * 2] = p.x;
        pos[i * 2 + 1] = p.y;
    }
    return { color, size, pos };
}

let selected = 0;
function selectNext() {
    let next = selected + 1;
    if (next === polylines.length)
        next = polylines.length - 1;
    /**
     * not really want to select a empty.....
     */
    if ((next === (polylines.length - 1)) && polyline.length === 0)
        return;
    selected = next;
}
function selectPrev() {
    selected = selected - 1;
    if (selected < 0) {
        selected = 0;
    }
}
function deleteSelect() {
    if (polylines[selected] === polyline) {
        polyline = [];
        polylines.push(polyline);
    }
    polylines.splice(selected, 1);
    switchMode();
}
function switchMode() {
    const modeBtn = document.getElementById('mode');
    const all = document.getElementsByClassName('selectBtn');

    if (mode === 'draw') {
        mode = 'delete';
        modeBtn.textContent = "Cancel Delete"
        for (let i = 0; i < all.length; ++i) {
            all.item(i).disabled = false;
        }
        selected = 0;
    } else {
        mode = 'draw';
        modeBtn.textContent = "Start Delete"
        for (let i = 0; i < all.length; ++i) {
            all.item(i).disabled = true;
        }
    }
}

function main() {
    /**************************
     * general polyline section
     **************************/

    const colorInput = document.getElementById('color');
    const sizeInput = document.getElementById('sizer');

    /**
     * Caculate the point at x and y
     * 
     * @param {number} x
     * @param {number} y
     * @return {Point}
     */
    function point(x, y) {
        const rgbHex = colorInput.value;
        /**
         * reference
         * https://stackoverflow.com/questions/36697749/html-get-color-in-rgb
         */
        const colorArr = colorInput.value.match(/[A-Za-z0-9]{2}/g)
            .map(function (v) { return parseInt(v, 16) / 256.0 });
        const size = Number.parseInt(sizeInput.value);
        return {
            r: colorArr[0],
            g: colorArr[1],
            b: colorArr[2],
            size,
            x,
            y,
        };
    }
    /**
     * Flush current line and begin record new line
     */
    function beginPolyline() {
        if (polyline.length === 0) return;
        console.log('You have finished drawing')
        let s = ''
        for (let i = 0; i < polyline.length; i += 2) {
            s += `(${polyline[i].x}, ${polyline[i].y}) `
        }
        console.log(`your polyline ${s}`);
        polyline = [];
        polylines.push(polyline);
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
    const a_PointSize = attr('a_PointSize');
    const a_Color = attr('a_Color');

    // Create a buffer object
    const b_Pos = gl.createBuffer();
    const b_Color = gl.createBuffer();
    const b_Size = gl.createBuffer();
    if (!b_Pos || !b_Color || !b_Size) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    /********************
     * controller section
     ********************/

    const tempPoint = { x: 0, y: 0 };
    canvas.onmousemove = function (ev) {
        const { x, y } = glPos(ev);
        tempPoint.x = x;
        tempPoint.y = y;
    };
    canvas.onmousedown = function (ev) {
        const { x, y } = glPos(ev);
        console.log(`x:${x} y:${y} ${ev.button === 0 ? 'left' : 'right'} click`);
        if (mode === 'delete') return;
        polyline.push(point(x, y));
        if (ev.button === 2) {
            beginPolyline();
            return false;
        }
    };

    /**
     * start render loop
     */
    setInterval(render, 1000 / TPS);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    gl.enableVertexAttribArray(a_PointSize);

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        const renderLine = (line) => {
            if (line.length === 0) return;
            const pass = [...line];
            if (line === polyline) // if it's current drawing polyline
                pass.push(point(tempPoint.x, tempPoint.y)); // add temp point to draw
            const { color, pos, size } = flatPolyline(pass);

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Size);
            gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Color);
            gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, b_Pos);
            gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

            /*
             * notice that here we draw the point by line array
             * but draw the line by pass array,
             * since we want point to be draw only at the clicked pos.
             */
            gl.drawArrays(gl.POINTS, 0, line.length);
            if (line.length >= 1) {
                gl.drawArrays(gl.LINE_STRIP, 0, pass.length);
            }
        }
        if (mode === 'draw') {
            polylines.forEach(renderLine);
        } else {
            renderLine(polylines[selected]);
        }
    }
}
