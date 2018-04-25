declare namespace WebGLUtils {
    function setupWebGL(canvas: Element, opt_attribs: WebGLContextAttributes, opt_onError: (err) => void): WebGLRenderingContext;
}

declare function getWebGLContext(canvas: HTMLCanvasElement, opt_debug?: boolean): WebGLRenderingContext;

declare function loadFile(file_name: string, load_handle: (content: string) => void): void;

interface Matrix4 {
    elements: Float32Array;

    setIdentity(): void;
    set(src: Matrix4): this;
    concat(other: Matrix4): this;
    multiply(other: Matrix4): this;
    multiplyVector3(other: Vector3): this;
    multiplyVector4(other: Vector4): this;
    setInverseOf(other: Matrix4): this;
    invert(): this;
    transpose(): this;
    setScale(x: number, y: number, z: number): this;
    scale(x: number, y: number, z: number): this;
    setTranslate(x: number, y: number, z: number): this;
    /**
     * Multiply the orthographic projection matrix from the right.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @return this
     */
    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    translate(x: number, y: number, z: number): this;
    setRotate(angle: number, x: number, y: number, z: number): this;
    rotate(angle: number, x: number, y: number, z: number): this;
}

declare var Matrix4: {
    new(other?: Matrix4): Matrix4;
};

interface Vector3 {
    elements: Float32Array;
    normalize(): this;
}

declare var Vector3: {
    new(other?: Vector3 | number[]): Vector3;
}

interface Vector4 {
    elements: Float32Array;
}

declare var Vector4: {
    new(other?: Vector4 | number[]): Vector4;
}

declare interface SORObject {
    objName: string;
    vertices: number[];
    indexes: number[];
}

declare function setupIOSOR(elementName: string): void;
declare function saveFile(sor: SORObject): void;
declare function readFile(): SORObject;

declare var SOR: {
    new(objName?: string, vertices?: number[], indexes?: number[]): SORObject;
};
