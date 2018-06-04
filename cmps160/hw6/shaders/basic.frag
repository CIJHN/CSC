precision mediump float;
precision mediump int;

uniform int u_Lighting;
uniform float u_HighLight;

uniform vec3 u_LightColor;
uniform int u_Glossiness;
uniform vec3 u_AmbientColor; 
uniform vec3 u_DiffuseColor;
uniform vec3 u_SpecularColor;

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_LightDirection;
varying vec3 v_ViewDirection;
varying float v_Depth;

void main () {
    if (u_Lighting == 0) {
        gl_FragColor = v_Color;
    } else {
        int glossiness = u_Glossiness;
        vec3 normal = v_Normal;
        vec3 lightDirection = v_LightDirection;
        vec3 view = - v_ViewDirection;
        
        vec3 reflection = 2.0 * max(dot(lightDirection, normal), 0.0) * normal - lightDirection;

        vec3 ambientColor = u_AmbientColor;
        vec3 diffuseColor = max(dot(lightDirection, normal), 0.0) * u_DiffuseColor;
        vec3 specularColor = pow(max(dot(reflection, view), 0.0), float(glossiness)) * u_SpecularColor;

        vec4 col = vec4(ambientColor + diffuseColor + specularColor, v_Color.a);
        if (u_HighLight != 0.0) {
            gl_FragColor = vec4(col.rgb + u_HighLight, v_Color.a);
        } else {
            gl_FragColor = col;
        }
    } 
}
