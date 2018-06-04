precision mediump float;
precision mediump int;

uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;

attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

uniform int u_Lighting; 

// dot light
uniform vec3 u_LightPosition;

// ambient light
uniform vec3 u_AmbientColor; 
uniform vec3 u_DiffuseColor;
uniform vec3 u_SpecularColor;
uniform int u_Glossiness;

uniform vec3 u_ViewDirection;

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_LightDirection;
varying float v_Depth;

void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;

    if (u_Lighting == 0) { // zero means no lighting, draw line
        v_Color = vec4(1, 0, 0, 1);
    } else {  
        v_Color = a_Color;
        v_Normal = normalize(a_Normal);
        v_LightDirection = normalize(u_LightPosition - a_Position.xyz);
    } 
}