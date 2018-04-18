attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec3 a_Color;
varying vec3 v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
}