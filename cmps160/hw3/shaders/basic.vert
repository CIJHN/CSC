attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

uniform int u_Lighting; 

uniform int u_Lighting_1;
uniform vec3 u_LightDirection_1;
uniform vec3 u_LightColor_1;

uniform int u_Lighting_2;
uniform vec3 u_LightDirection_2;
uniform vec3 u_LightColor_2;

uniform vec4 u_Color; // ambi color

varying vec4 v_Color; 

void main() {
    gl_Position = a_Position;
    
    if (u_Lighting == 1) {
        vec3 diffuseColor = vec3(0, 0, 0);
        if (u_Lighting_1 == 1) {
            vec3 c = max(dot(normalize(u_LightDirection_1), normalize(a_Normal)), 0.0) * u_LightColor_1;
            diffuseColor = diffuseColor + c;
        }
        if (u_Lighting_2 == 1) {
            vec3 c = max(dot(normalize(u_LightDirection_2), normalize(a_Normal)), 0.0) * u_LightColor_2;
            diffuseColor = diffuseColor + c;
        }

        v_Color = vec4(diffuseColor * a_Color.rgb, a_Color.a);
    } else {
        v_Color = a_Color;
    }
}