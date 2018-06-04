const FSIZE = (new Float32Array([])).BYTES_PER_ELEMENT; // size of a vertex coordinate (32-bit float)

interface Vec3 {
    x: number
    y: number
    z: number

    readonly length: number;
    add(vec: Vec3): Vec3;
    sub(vec: Vec3): Vec3;
    cross(vec: Vec3): Vec3;
    dot(vec: Vec3): number;
    unit(): Vec3;
}

abstract class Vec3Base implements Vec3 {
    abstract x: number;
    abstract y: number;
    abstract z: number;

    get length() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    add(vec: Vec3): Vec3 {
        return new Vec3(vec.x + this.x, vec.y + this.y, vec.z + this.z);
    }
    sub(vec: Vec3): Vec3 {
        return new Vec3(-vec.x + this.x, -vec.y + this.y, -vec.z + this.z);
    }
    cross(vec: Vec3): Vec3 {
        return new Vec3(this.y * vec.z - this.z * vec.y,
            -this.x * vec.z + this.z * vec.x,
            this.x * vec.y + this.y * vec.x);
    }
    dot(vec: Vec3): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
    unit(): Vec3 {
        return new Vec3(this.x / this.length, this.y / this.length, this.z / this.length);
    }
    scale(scal: number): Vec3 {
        return new Vec3(this.x * scal, this.y * scal, this.z * scal);
    }
}

class Vec3 extends Vec3Base {
    constructor(public x: number, public y: number, public z: number) { super() }
}

class Vec3Proxy extends Vec3Base implements Vec3 {
    constructor(private arr: Float32Array, private offset: number) {
        super();
    }
    get x() { return this.arr[this.offset] }
    set x(_x) { this.arr[this.offset] = _x }
    get y() { return this.arr[this.offset + 1] }
    set y(_x) { this.arr[this.offset + 1] = _x }
    get z() { return this.arr[this.offset + 2] }
    set z(_x) { this.arr[this.offset + 2] = _x }
}

interface Color { r: number, g: number, b: number, a: number }

namespace VertexFormat {
    export const POSITION: VertexFormat<Vec3> = {
        name: 'position',
        length: 3,
        type(gl) { return gl.FLOAT },
        get(arr, offset) { return new Vec3Proxy(arr, offset); },
    }

    export const COLOR: VertexFormat<Color> = {
        name: 'color',
        length: 4,
        type(gl) { return gl.FLOAT },
        get(arr, offset) {
            return {
                get r() { return arr[offset] },
                set r(_x) { arr[offset] = _x },
                get g() { return arr[offset + 1] },
                set g(_x) { arr[offset + 1] = _x },
                get b() { return arr[offset + 2] },
                set b(_x) { arr[offset + 2] = _x },
                get a() { return arr[offset + 3] },
                set a(_x) { arr[offset + 3] = _x },
            }
        },
    }

    export const NORMAL: VertexFormat<Vec3> = {
        name: 'normal',
        length: 3,
        type(gl) { return gl.FLOAT },
        get(arr, offset) { return new Vec3Proxy(arr, offset); },
    }

}
interface VertexFormat<T> {
    readonly name: string;
    readonly length: number,
    type(gl: WebGLRenderingContext): number,
    get(arr: Float32Array, offset: number): T;
}

interface RawModel {
    indexes: Uint16Array;
    vertices: Float32Array;
}

interface GLDriver {
    init(gl: WebGLRenderingContext, program: number): void;
    render(gl: WebGLRenderingContext): void;
}

class Model {
    readonly vertexLength: number;
    private _vertices: Float32Array;
    private _indexes: Uint16Array;
    private _verticesProxy: any[];

    get vertices(): any[] {
        return this._verticesProxy;
    }

    get content() {
        return {
            vertices: this._vertices,
            indexes: this._indexes,
        }
    }

    /**
    * 
    * @param {VertexFormatFrame[]} frames 
    */
    constructor(readonly frames: VertexFormat<any>[]) {
        this.frames = frames;
        this._vertices = new Float32Array(0);
        this._indexes = new Uint16Array(0);
        let perVertex = 0;
        this.frames.forEach(f => perVertex += f.length);
        this.vertexLength = perVertex;
        this._verticesProxy = [];
    }

    build() {
        const nOfVer = this._vertices.length / this.vertexLength;
        const arr = new Array(nOfVer);
        let off = 0;
        for (let i = 0; i < arr.length; i++) {
            const ver: any = {};
            for (let j = 0; j < this.frames.length; ++j) {
                const f = this.frames[j];
                ver[f.name] = f.get(this._vertices, i);
                off += f.length;
            }
            arr[i] = ver;
        }
        this._verticesProxy = arr;
    }
    /**
     * Load model from raw vertices and indexes data
     */
    load(vertices: Float32Array, indexes: Uint16Array) {
        this._vertices = vertices;
        this._indexes = indexes;
        this.build();
        return this;
    }
    /**
     * Bind to GL
     */
    bindGL(gl: WebGLRenderingContext, mapping: { [name: string]: number }) {
        let offset = 0;
        for (const f of this.frames) {
            console.log(`map ${f.name} -> ${mapping[f.name]}, len ${f.length}, ${f.type(gl)}, off ${offset}`);
            gl.vertexAttribPointer(mapping[f.name], f.length, f.type(gl), false, FSIZE * f.length, offset);
            console.log('end')
            offset += f.length * FSIZE;
        }
        return this;
    }

    concat(object: { [key: string]: any[] }, indexes: number[]) {
        const length = object[Object.keys(object)[0]].length;
        const newVertices = new Float32Array(length * this.vertexLength);
        let offset = 0;
        for (let i = 0; i < length; ++i) {
            for (let j = 0; j < this.frames.length; ++j) {
                const f = this.frames[j];
                const typedObject = object[f.name][i];
                const frameObject = f.get(newVertices, offset);
                Object.keys(typedObject).forEach(k => {
                    frameObject[k] = typedObject[k];
                })
                offset += f.length;
            }
        }
        const newIndexes = new Uint16Array(indexes);

        const dest = new Float32Array(this._vertices.length + newVertices.length);
        dest.set(this._vertices);
        dest.set(this._vertices, newVertices.length);

        const off = this.vertices.length;
        const ind = new Uint16Array(this._indexes.length + newIndexes.length);
        ind.set(this._indexes);
        ind.set(newIndexes.map(i => i + off), this._indexes.length);

        this._vertices = dest;
        this._indexes = ind;

        this.build();
    }
    reset() {
        this._indexes = new Uint16Array(0);
        this._vertices = new Float32Array(0);
    }
}

function rgba(r: number, g: number, b: number, a: number = 1): Color { return { r, g, b, a } }
function xyz(x: number, y: number, z: number) { return new Vec3(x, y, z) }
