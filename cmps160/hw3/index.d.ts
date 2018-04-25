type Polyline = Array<Vector3>

interface SimpleModel {
    vertices: Float32Array;
    indexes: Uint16Array;
    color: Uint8Array;
}
