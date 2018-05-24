const Cylinder = {
    model: new Model([VertexFormat.POSITION, VertexFormat.NORMAL]),
    lights: [{ color: rgba(1, 1, 1, 1), direction: xyz(0, -10, 0) }],
    _color: undefined,
    radius: 0.1,
    faces: 12,
    gl: undefined,
    buffer: undefined,
    indexBuffer: undefined,

    load(sor) {
        this.model.load(new Float32Array(sor.vertices), new Uint16Array(sor.indexes));
    },
    getModelContent() {
        return this.model.content;
    },
    reset() {
        this.model.reset();
    },

    set color(color) {
        this._color = color;
        this.gl.uniform4f(this.u_Color, color.r, color.g, color.b, color.a);
        
    },
    get color() {
        return this._color;
    },

    updateLight(gl) {
        let light = this.lights[0];
        gl.uniform3fv(this.u_LightDirection, [light.direction.x, light.direction.y, light.direction.z]);
        gl.uniform3fv(this.u_LightColor, [light.color.r, light.color.g, light.color.b]);

        // light = this.lights[1];
        // gl.uniform3fv(this.u_LightDirection_1, [light.direction.x, light.direction.y, light.direction.z]);
        // gl.uniform3fv(this.u_LightColor_1, [light.color.r, light.color.g, light.color.b])
    },

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {number} program 
     */
    init(gl, program) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        this.a_Position = gl.getAttribLocation(program, 'a_Position');
        this.a_Normal = gl.getAttribLocation(program, 'a_Normal');

        gl.enableVertexAttribArray(this.a_Position);
        gl.enableVertexAttribArray(this.a_Normal);

        this.u_Color = gl.getUniformLocation(program, 'u_Color');
        this.u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');
        this.u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
        this.u_LightDirection_1 = gl.getUniformLocation(program, 'u_LightDirection_1');
        this.u_LightColor_1 = gl.getUniformLocation(program, 'u_LightColor_1');
        this.u_Lighting = gl.getUniformLocation(program, 'u_Lighting');

        console.log(this)

        this.color = { r: 0, g: 1, b: 0, a: 1 };

        this.updateLight(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.model.bindGL(gl, {
            [VertexFormat.POSITION.name]: this.a_Position,
            [VertexFormat.NORMAL.name]: this.a_Normal,
        })
    },
    render(gl) {
        const content = this.model.content;
        
        if (content.indexes.length === 0) return;
        gl.uniform1i(this.u_Lighting, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, content.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, content.indexes, gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLES, content.indexes.length, gl.UNSIGNED_SHORT, 0);
    },
    /**
     * 
     * @param {Vec3[]} vertices 
     */
    bake(vertices) {
        const position = [];
        const indexes = [];
        const normals = [];
        const colors = [];

        const green = rgba(0, 1, 0);

        let index = 0;
        const rotAngle = 360.0 / this.faces;
        const zero = new Vector3();

        for (let i = 0; i < vertices.length - 1; ++i) {
            const from = vertices[i];
            const to = vertices[i + 1];

            const rot = new Matrix4();
            rot.setTranslate(0, 0, this.radius);

            const fmat = (m, t) => {
                const arr = flatMatrix(m);
                arr[0] += t.x;
                arr[1] += t.y;
                arr[2] += t.z;
                return xyz(arr[0], arr[1], arr[2]);
            }

            const rotX = to.x - from.x;
            const rotY = to.y - from.y;
            const rotZ = to.z - from.z;

            for (let i = 0; i < this.faces; ++i) {
                const lastUpper = fmat(rot, from);
                const lastLower = fmat(rot, to);
                position.push(lastUpper, lastLower); // current surface left edge
                rot.rotate(rotAngle, rotX, rotY, rotZ);

                const flatUpper = fmat(rot, from);
                const flatLower = fmat(rot, to);
                position.push(flatUpper, flatLower); // current surface right edge

                indexes.push(index, index + 1, index + 2); // current surface first triangle
                indexes.push(index + 2, index + 1, index + 3); // current surface sec triagnle

                const vecLeft = lastLower.sub(lastUpper);
                const vecDown = flatLower.sub(lastUpper);
                const norm = vecLeft.cross(vecDown);
                normals.push(norm, norm, norm, norm); // current 4 normal
                colors.push(green, green, green, green);

                index += 4;
            }
        }

        this.model.concat({
            position,
            normal: normals,
            color: colors,
        }, indexes);
    },

};

(function (self) {
})(Cylinder);

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
