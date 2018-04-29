attribute vec3 a_Position;
attribute vec3 a_Normal;

uniform int u_Lighting; 

uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;

uniform vec3 u_LightDirection_1;
uniform vec3 u_LightColor_1;

uniform vec4 u_Color;

varying vec4 v_Color;

void main() {
    gl_Position = vec4(a_Position, 1);
    
    if (u_Lighting == 1) {
        vec3 color_a = max(dot(normalize(u_LightDirection), normalize(a_Normal)), 0.0) * u_LightColor;
        // vec3 color_b = max(dot(normalize(u_LightDirection_1), normalize(a_Normal)), 0.0) * u_LightColor_1;
        
        vec3 diffuseColor = (color_a) * u_Color.rgb;

        v_Color = vec4(diffuseColor, u_Color.a);
    } else {
        v_Color = u_Color;
    }
}