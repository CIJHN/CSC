
v_shaders = {}
f_shaders = {}

// called when page is loaded
function main() {
    // retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    v_shaders["cube"] = "";
    f_shaders["cube"] = "";
    v_shaders["sphere"] = "";
    f_shaders["sphere"] = "";
    v_shaders["triang"] = "";
    f_shaders["triang"] = "";

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function (shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function (shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
    });

    loadFile("shaders/skycube_shader.vert", function (shader_src) {
        setShader(gl, canvas, "skycube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/skycube_shader.frag", function (shader_src) {
        setShader(gl, canvas, "skycube", gl.FRAGMENT_SHADER, shader_src);
    });

    loadFile("shaders/pyramid_shader.vert", function (shader_src) {
        setShader(gl, canvas, "pyramid", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/pyramid_shader.frag", function (shader_src) {
        setShader(gl, canvas, "pyramid", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/sphere_shader.vert", function (shader_src) {
        setShader(gl, canvas, "sphere", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/sphere_shader.frag", function (shader_src) {
        setShader(gl, canvas, "sphere", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/triang_shader.vert", function (shader_src) {
        setShader(gl, canvas, "triang", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/triang_shader.frag", function (shader_src) {
        setShader(gl, canvas, "triang", gl.FRAGMENT_SHADER, shader_src);
    });
}

// set appropriate shader and start if both are loaded
function setShader(gl, canvas, name, shader, shader_src) {
    if (shader == gl.VERTEX_SHADER)
        v_shaders[name] = shader_src;

    if (shader == gl.FRAGMENT_SHADER)
        f_shaders[name] = shader_src;

    vShadersLoaded = 0;
    for (var shader in v_shaders) {
        if (v_shaders.hasOwnProperty(shader) && v_shaders[shader] != "") {
            vShadersLoaded += 1;
        }
    }

    fShadersLoaded = 0;
    for (var shader in f_shaders) {
        if (f_shaders.hasOwnProperty(shader) && f_shaders[shader] != "") {
            fShadersLoaded += 1;
        }
    }

    if (vShadersLoaded == Object.keys(v_shaders).length &&
        fShadersLoaded == Object.keys(f_shaders).length) {
        start(gl, canvas);
    }
}

function start(gl, canvas) {

    // Create camera
    var camera = new PerspectiveCamera(60, 1, 1, 100);

    setupCamera(camera, canvas);

    // Create scene
    var scene = new Scene(gl, camera);


    // Create a cube
    var cube = new CubeGeometry(1);
    cube.setVertexShader(v_shaders["cube"]);
    cube.setFragmentShader(f_shaders["cube"]);
    cube.setRotation(new Vector3([1, 45, 45]));
    cube.setPosition(new Vector3([5.0, 3, -3]));
    cube.setScale(new Vector3([0.75, 0.75, 0.75]));
    cube.addAttribute('a_Color', [
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
    ])
    scene.addGeometry(cube);


    var skybox = new CubeGeometry(1);
    skybox.setVertexShader(v_shaders["skycube"]);
    skybox.setFragmentShader(f_shaders["skycube"]);
    skybox.setPosition(new Vector3([0.0, 0.0, 0.0]));
    skybox.setScale(new Vector3([22.75, 22.75, 22.75]));
    scene.addGeometry(skybox);

    var triang = new Geometry();
    triang.vertices = [-1, -1, 0.0, 0.0, 1.0, 0.0, 1, -1, 0.0];
    triang.indices = [0, 1, 2];
    var uvs = [0.0, 0.0, 0.0, 0.5, 1.0, 0.0];
    triang.addAttribute("a_uv", uvs);
    triang.setPosition(new Vector3([5.0, 0, -3]))

    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    // scene.addGeometry(triang);

    const flat = new Geometry();
    flat.setPosition(new Vector3([5.0, 0, -3]))
    flat.vertices = [
        0, 0, 0,
        0.5, 0.0, 0,
        0.5, 1.0, 0,
        0.0, 1.0, 0,

        0.5, 0.0, 0,
        1.0, 0.0, 0,
        1.0, 1.0, 0,
        0.5, 1.0, 0,
    ];
    /**
     * 3---2 7---6
     * |         |
     * 0---1 4---5
     */
    flat.indices = [
        0, 3, 2,
        0, 2, 1,

        4, 7, 6,
        4, 6, 5];
    flat.setRotation(new Vector3([0, -40, 0]));
    flat.addAttribute('a_uv', [
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
    ])

    flat.setVertexShader(v_shaders["triang"]);
    flat.setFragmentShader(f_shaders["triang"]);
    scene.addGeometry(flat);


    const pyramid = new Geometry();
    pyramid.v_shader = v_shaders['pyramid'];
    pyramid.f_shader = f_shaders['pyramid'];

    pyramid.vertices = [
        0, 0, 0,
        1, 0, 0,
        0.5, 0.5, 0.5,

        1, 0, 0,
        1, 0, 1,
        0.5, 0.5, 0.5,

        1, 0, 1,
        0, 0, 1,
        0.5, 0.5, 0.5,

        0, 0, 1,
        0, 0, 0,
        0.5, 0.5, 0.5,

        0, 0, 0,
        0, 0, 1, // bottom
        1, 0, 1,

        0, 0, 0,
        1, 0, 1,
        1, 0, 0,
    ]

    pyramid.indices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
    ]
    pyramid.setPosition(new Vector3([-3, 0.0, -3.0]));

    // scene.addGeometry(pyramid);


    // Create a Sphere
    var sphere = new SphereGeometry(1, 32, 8);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([-3, 0.0, 0.0]));
    scene.addGeometry(sphere);

    var tex2 = new Texture2D(gl, 'img/beach/posz.jpg', function (tex) {
        triang.addUniform("u_tex", "t2", tex);
    });

    var tex = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function (tex) {
        skybox.addUniform("u_cubeTex", "t3", tex);
        cube.addUniform("u_cubeTex", "t3", tex);
        sphere.addUniform("u_cubeTex", "t3", tex)
    });

    document.getElementById('addSide').onclick = addSide;
    function addSide() {
        const off = flat.vertices.length - 12;
        flat.vertices.push(
            flat.vertices[off] + 0.5, 0.0, 0.0,
            flat.vertices[off + 3] + 0.5, 0.0, 0.0,
            flat.vertices[off + 6] + 0.5, 1.0, 0.0,
            flat.vertices[off + 9] + 0.5, 1.0, 0.0)
        flat.attributes['a_uv'].push(
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0)
        const iOff = flat.indices.length - 12;
        for (let i = 0; i < 12; ++i) {
            flat.indices.push(flat.indices[iOff + i] + 4);
        }
    }

    document.getElementById('switchTexture').onclick = switchTexture;
    let current = 'beach'
    function switchTexture() {
        current = current === 'beach' ? 'minecraft' : 'beach';
        var tex = new Texture3D(gl, [
            `img/${current}/negx.png`,
            `img/${current}/posx.png`,
            `img/${current}/negy.png`,
            `img/${current}/posy.png`,
            `img/${current}/negz.png`,
            `img/${current}/posz.png`
        ], function (tex) {
            skybox.addUniform("u_cubeTex", "t3", tex);
            cube.addUniform("u_cubeTex", "t3", tex);
            sphere.addUniform("u_cubeTex", "t3", tex)
        });
    }

    new Texture2D(gl, 'img/beach/negx.jpg', function (tex) {
        flat.addUniform("u_tex", "t2", tex);
    })

    // setInterval(() => {
    //     camera.update();
    //     scene.draw();
    // }, 10000 / 24)
    function renderLoop(time) {
        scene.draw();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop)
}
