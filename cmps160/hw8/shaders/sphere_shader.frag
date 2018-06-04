#ifdef GL_ES
precision mediump float;
#endif

uniform samplerCube u_cubeTex;

varying vec3 v_pos;

// varying highp vec2 v_TextureCoord;

void main() {
  gl_FragColor = textureCube(u_cubeTex, v_pos);
  
  // gl_FragColor = vec4(1.0,0.4,0.4,1.0);
  // gl_FragColor = texture2D(uSampler, v_TextureCoord);
}
