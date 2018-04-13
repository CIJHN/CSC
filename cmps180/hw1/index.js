const VSHADER_SOURCE =
    `attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}
`;

const FSHADER_SOURCE =
    `void main () {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
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

    // // Get the storage location of a_Position
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return;
    }

    // Create a buffer object
    const vbo = gl.createBuffer();
    if (!vbo) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    document.onmousemove = mousemove;
    document.onmousedown = click;
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    let drawing = true;
    const tempPoint = { x: 0, y: 0 };
    const points = []; // The array for the position of a mouse press

    function toGLPos(ev) {
        let x = ev.clientX; // x coordinate of a mouse pointer
        let y = ev.clientY; // y coordinate of a mouse pointer
        const rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        return { x, y };
    }
    function mousemove(ev) {
        const { x, y } = toGLPos(ev);
        tempPoint.x = x;
        tempPoint.y = y;
    }

    function click(ev) {
        if (ev.button === 2) {
            drawing = !drawing;
            if (!drawing) {
                console.log('You have finished drawing')
                let s = ''
                for (let i = 0; i < points.length; i += 2) {
                    s += `(${points[i]}, ${points[i + 1]}) `
                }
                console.log(`your polyline ${s}`);
            } else {
                console.log('Now start drawing again');
            }
            event.preventDefault();
            return false;
        }
        if (!drawing) return;
        const side = ev.button === 0 ? 'left' : 'right';
        const { x, y } = toGLPos(ev);
        console.log(`x:${x} y:${y} ${side} click`);
        points.push(x);
        points.push(y);
    }

    setInterval(render, 10);

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const len = points.length;

        const pointSize = sizer.value ? Number.parseFloat(sizer.value) : 10;
        for (let i = 0; i < len; i += 2) {
            // Pass the position of a point to a_Position variable
            gl.vertexAttrib3f(a_Position, points[i], points[i + 1], 0.0);
            gl.vertexAttrib1f(a_PointSize, pointSize, 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }

        if (points.length === 0) return;
        const passing = [...points];
        if (drawing) passing.push(tempPoint.x, tempPoint.y);

        const vertices = new Float32Array(passing);

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
        gl.disableVertexAttribArray(a_Position);
    }
}
