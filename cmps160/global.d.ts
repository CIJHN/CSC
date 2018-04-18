namespace WebGLUtils {
    function setupWebGL(canvas: Element, opt_attribs: WebGLContextCreationAttirbutes, opt_onError: (err) => void): WebGLRenderingContext;
}

declare function getWebGLContext(canvas: HTMLCanvasElement, opt_debug: boolean): WebGLRenderingContext;

declare function loadFile(file_name: string, load_handle: (content: string) => void);

declare interface SORObject {
    objName: string;
    vertices: number[];
    indexes: number[];
};

declare function setupIOSOR(elementName: string): void;
declare function saveFile(sor: SORObject): void;
declare function readFile(): SORObject;

declare var SOR: {
    new(objName?: string, vertices?: number[], indexes?: number[]): SORObject;
};
