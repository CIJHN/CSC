#ifdef GL_ES
precision mediump float;
#endif

uniform samplerCube u_cubeTex;

varying vec3 v_pos;
varying vec4 v_color;

void main() {
    gl_FragColor = (0.3 * v_color) + (0.7 * textureCube(u_cubeTex, v_pos));
}
