precision mediump float;
precision mediump int;

uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform mat4 u_ModelMatrix;

uniform vec3 u_CameraPosition;

uniform int u_Lighting; 
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientColor; 
uniform vec3 u_DiffuseColor;
uniform vec3 u_SpecularColor;
uniform int u_Glossiness;

attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_ViewDirection;
varying vec3 v_LightDirection;
varying float v_Depth;

void main() {
    vec4 worldPos = u_ModelMatrix * a_Position;
    gl_Position = u_ProjMatrix * u_ViewMatrix * worldPos;

    if (u_Lighting == 0) { // zero means no lighting, draw line
        v_Color = vec4(1, 0, 0, 1);
    } else {  
        v_Color = a_Color;
        vec4 normal = u_ModelMatrix * vec4(a_Normal, 0);
        v_Normal = normalize(normal).xyz;
        v_LightDirection = normalize(u_LightPosition - worldPos.xyz);
        v_ViewDirection = normalize(u_CameraPosition - worldPos.xyz);
    } 
}