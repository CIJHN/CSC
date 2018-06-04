
const Polyline = {
    lines: [],
    tempPoint: { x: 0, y: 0 },
    /**
     * 
     * @param {Vec3} vec 
     */
    add(vec) {
        if (!vec instanceof Vec3) throw new Error('Require vec as Vec3!');
        this.lines.push(vec);
    },
    reset() {
        this.lines = [];
    },
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    init(gl, program) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.enableVertexAttribArray(a_Position);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        this.u_Lighting = gl.getUniformLocation(gl.program, 'u_Lighting');
    },
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render(gl) {
        const line = this.lines;
        if (line.length < 1) return;
        gl.uniform1i(this.u_Lighting, 0);

        const pass = [...line, new Vec3(this.tempPoint.x, this.tempPoint.y, 0)];
        const pos = new Float32Array(pass.length * 3);
        for (let i = 0; i < pass.length; i++) {
            const p = pass[i];
            pos[i * 3] = p.x;
            pos[i * 3 + 1] = p.y;
            pos[i * 3 + 2] = 0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, pass.length);
    }
};

(function () {
})()