attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec4 a_Color;

uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
    vec3 diffuse = u_LightColor * a_Color.rgb * max(dot(u_LightDirection, normalize(a_Normal.xyz)), 0.0);
    v_Color = vec4(diffuse, a_Color.a);
}