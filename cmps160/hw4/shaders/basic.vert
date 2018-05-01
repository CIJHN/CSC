precision mediump float;
precision mediump int;

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

void main() {
    gl_Position = a_Position;

    if (u_Lighting == 0) { // zero means no lighting, draw line
        v_Color = vec4(1, 0, 0, 1);
    } else if (u_Lighting == 1) { // Gouraud 
        int glossiness = u_Glossiness;
        vec3 normal = normalize(a_Normal);
        vec3 lightDirection = normalize(u_LightPosition - a_Position.xyz);
        vec3 view = u_ViewDirection;
        
        vec3 reflection = 2.0 * max(dot(lightDirection, normal), 0.0) * normal - lightDirection;

        vec3 ambientColor = u_AmbientColor;
        vec3 diffuseColor = max(dot(lightDirection, normal), 0.0) * u_DiffuseColor;
        vec3 specularColor = pow(max(dot(reflection, view), 0.0), float(glossiness)) * u_SpecularColor;

        v_Color = vec4(ambientColor + diffuseColor + specularColor, a_Color.a);
    } else { // Phong
        v_Color = a_Color;
        v_Normal = normalize(a_Normal);
        v_LightDirection = normalize(u_LightPosition - a_Position.xyz);
    }
}