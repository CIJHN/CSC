/**
 * Representing various uniform types, you can guess which uniform it will used by it name...
 * 
 * i, f represent int and float
 * 
 * vN represents the float32 vector in size N
 * 
 * mN represent the float32 matrix in size N 
 * 
 * tN represent the N dimensional gl texture id, it should be in @type {WebGLTexture} 
 */
type UniformType = 'i' | 'f' | 'v2' | 'v3' | 'v4' | 'm2' | 'm3' | 'm4' | 't2' | 't3'

declare class Geometry {
    public vertices: number[]
    public indices: number[]
    public attributes: { [attributeName: string]: any }
    public uniforms: { [uniformName: string]: any }
    /**
     * seems unused...
     * @deprecated
     */
    public texture: any

    /**
     * Add the attribute to geometry
     * 
     * From the source code, it seems the attributes are all vector3f types (float32 array in size 3),
     * therefore I mark a number array here
     * 
     * @param name 
     * @param data 
     */
    addAttribute(name: string, data: number[]): void

    addUniform(name: string, type: UniformType, data: any): void
    addUniform(name: string, type: 'i' | 'f', data: number): void
    addUniform(name: string, type: 'v2' | 'v3' | 'v4' | 'm2' | 'm3' | 'm4' | 't2' | 't3', data: number[]): void
    addUniform(name: string, type: 't2' | 't3', data: WebGLTexture): void

    /**
     * Set the vertex shader for the geometry
     * @param f_shader the vertex shader glsl text
     */
    setVertexShader(v_shader: string): void
    /**
     * Set the fragment shader for the geometry
     * @param f_shader the fragment shader glsl text
     */
    setFragmentShader(f_shader: string): void
    /**
     * Set the position of this geometry
     * @param position The position in vector 3
     */
    setPosition(position: Vector3): void

    /**
     * Set the rotation of this geometry
     * @param rotation The rotation vector
     */
    setRotation(rotation: Vector3): void

    /**
     * Set the scale for the geometry
     * @param scale The scale vector on x,y,z axis
     */
    setScale(scale: Vector3): void
}

declare class CubeGeometry extends Geometry {
    /**
     * Create a Cube with 2 * size width, height and depth
     * 
     * If the size is 1, your cube width, height, depth are all 2
     * 
     * The origin of the model is the center of the cube (not the corner) 
     *  
     * @param size The size of the Cube, default is 1
     */
    constructor(public size?: number)
}

declare class SphereGeometry extends Geometry {
    /**
     * 
     * @param radius The radius of sphere, default is 1
     * @param widthSegments 
     * @param heightSegments 
     */
    constructor(radius?: number, widthSegments?: number, heightSegments?: number)
}


declare class Scene {
    constructor(gl: WebGLRenderingContext, camera: Camera)

    /**
     * Add geometry to the scene
     * @param geometry The geo will be added
     * @return if the geometry add to scene successfully
     */
    addGeometry(geometry: Geometry): boolean

    /**
     * Draw the scene
     */
    draw(): void
}

declare class PerspectiveCamera {
    readonly projectionMatrix: Matrix4
    readonly viewMatrix: Matrix4

    /**
     * Create the perspective projection by fovy and aspect.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     */
    constructor(fov: number, aspect: number, near: number, far: number);

    /**
     * Rotate the camera direction according to it position, and changing the look at center.
     * 
     * This function will update the up vector if necessary
     * 
     * @param angle The angle in degree to rotate
     * @param x The rotation x axis
     * @param y The rotation y axis
     * @param z The rotation z axis
     */
    rotate(angle: number, x: number, y: number, z: number): void

    /**
     * Move the camera toward a direction with a distance
     * 
     * This function will not change the look at direction of the camera 
     * 
     * @param distances the distance to move 
     * @param x the move direction x
     * @param y the move direction y
     * @param z the move direction z
     */
    move(distances: number, x: number, y: number, z: number): void

    /**
     * update the view matrix
     */
    update(): void
}

declare class Texture2D {
    /**
     * Load and create a texture 2d with it texture path and loading callback
     * @param gl The webgl context from canvas
     * @param texture_path The texture resource url
     * @param callback The callback of texture loading
     */
    constructor(gl: WebGLRenderingContext, texture_path: string, callback: (texture: WebGLTexture) => void)

    /**
     * Load and create a texture 2d with it texture path and loading callback
     * @param gl The webgl context from canvas
     * @param texture_path The texture resource url
     * @param callback The callback of texture loading
     */
    load(gl: WebGLRenderingContext, texture_path: string, callback: (texture: WebGLTexture) => void): void
}

declare class Texture3D {
    /**
     * texture path of the texture 3d
     */
    public neg_x: string
    /**
    * texture path of the texture 3d
    */
    public pos_x: string
    /**
    * texture path of the texture 3d
    */
    public neg_y: string
    /**
    * texture path of the texture 3d
    */
    public pub_y: string
    /**
    * texture path of the texture 3d
    */
    public neg_z: string
    /**
    * texture path of the texture 3d
    */
    public pos_z: string
    /**
     * Load and create a texture 3d with it texture path and loading callback
     * @param gl The webgl context from canvas
     * @param texture_paths The array of texture paths
     * @param callback The callback of texture loading
     */
    constructor(gl: WebGLRenderingContext, texture_paths: string[], callback: (texture: WebGLTexture) => void)

    /**
     * Load and create a texture 3d with it texture path and loading callback
     * @param gl The webgl context from canvas
     * @param callback The callback of texture loading
     */
    load(gl, callback): void
}
