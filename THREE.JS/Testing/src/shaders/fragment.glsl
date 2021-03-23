uniform float time;
uniform float progress; 
uniform sampler2D landscape;
uniform vec4 resolution; 
varying vec2 vUv;
varying vec3 vNormal; 
float PI = 3.1415926535897952;
varying vec3 eyeVector;


void main (){
    //vec2(0.5, -0.5)*
    vec2 uv =gl_FragCoord.xy/vec2(1000.);
    vec3 X = dFdx(vNormal);
    vec3 Y = dFdy(vNormal);
    vec3 normal=normalize(cross(X, Y));

    float diffuse = dot(vNormal, vec3(1.));
    vec4 t = texture2D(landscape, uv);
    

    gl_FragColor = t;
    gl_FragColor = vec4(eyeVector, 1.);
    //gl_FragColor = vec4(diffuse);

}