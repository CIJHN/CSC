/**
 * Global var for render tick per second
 */
const TPS = 10;

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

function main() {
    Promise.all([ldfile('shaders/basic.vert'), ldfile('shaders/basic.frag')])
        .then(setup);
}

function setup([VSHADER_SOURCE, FSHADER_SOURCE]) {

    /******************
     * GL init section  
     ******************/

    /**
    * @type {GLDriver[]}
    */
    const drivers = [Polyline, /* Cylinder */];

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

    drivers.forEach(driver => driver.init(gl, gl.program))

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    /**
     * start render loop
     */
    setInterval(render, 1000 / TPS);

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        drivers.forEach(driver => driver.render(gl));
    }

    /********************
     * controller section
     ********************/

    /**
     * Flush current line and begin record new line
     */
    function flush() {
        if (Polyline.lines.length <= 1) return;

        console.log('You have finished drawing');
        let s = ''
        for (let i = 0; i < Polyline.lines.length; i += 2) {
            s += `(${Polyline.lines[i].x}, ${Polyline.lines[i].y}) `
        }
        console.log(`your polyline ${s}`);

        Cylinder.bake(Polyline.lines);
        Polyline.reset();
    }


    const colorInput = document.getElementById('color');
    setupIOSOR("fileinput");

    document.getElementById('extra_sor').onclick = function () {
        const sor = readFile();      // get SOR from file
        if (sor) Cylinder.load(sor);
    }
    document.getElementById('save_canvas').onclick = function () {
        const sor = new SOR();
        sor.objName = "model";
        const content = Cylinder.getModelContent();
        sor.vertices = content.vertices;
        sor.indexes = content.indexes;
        saveFile(sor);
    };
    document.getElementById('reset_canvas').onclick = function () {
        Cylinder.reset();
    };

    document.getElementById('face').onchange = function () {
        Cylinder.faces = this.value;
    }
    document.getElementById('width').onchange = function () {
        Cylinder.radius = this.value;
    }
    canvas.onmousemove = function (ev) {
        const { x, y } = glPosition(canvas, ev);
        Polyline.tempPoint.x = x;
        Polyline.tempPoint.y = y;
    };
    canvas.onmousedown = function (ev) {
        const { x, y } = glPosition(canvas, ev);
        console.log(`x:${x} y:${y} ${ev.button === 0 ? 'left' : 'right'} click`);
        Polyline.add(new Vec3(x, y, 0));
        if (ev.button === 2) {
            flush();
            return false;
        }
    };
}
