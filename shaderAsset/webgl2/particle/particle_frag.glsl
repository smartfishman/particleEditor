precision mediump float;
uniform sampler2D u_image;
uniform sampler2D u_font;
varying vec2 v_texcoord;
varying float fontEnable;

void main(){
    gl_FragColor = texture2D(u_image,v_texcoord).rgba;
    if(fontEnable == 1.0){
        gl_FragColor = texture2D(u_font,v_texcoord).rgba;
    }
}