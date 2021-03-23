varying vec2 vUv;
uniform float time;
varying vec3 vPosition;
uniform vec2 pixels; 
varying vec3 vNormal;
float PI = 3.14159;
varying vec3 eyeVector;

void main(){
    vUv=uv;

    //vec4 mvPosition = modelViewMatrix * vec4(position, 1);
    //gl_PointSize = 50. * (1. / - mvPosition.z);

    //gl_PointSize = size * 10;
    vNormal = normalize(normalMatrix * normal);

    vec3 newPosition = position;
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}