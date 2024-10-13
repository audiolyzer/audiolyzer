#version 300 es
precision mediump float;

in float visibility;

in vec3 toLightVector;
in vec3 pass_position;

uniform vec3 skycolour;

out vec4 colour;

void main(void){

	vec3 unitNormal = normalize(cross(dFdx(pass_position), dFdy(pass_position)));
	vec3 unitLightVector = normalize(toLightVector);
	float nDotl = dot(unitNormal, unitLightVector);
	float brightness = max(nDotl, 0.15);
	vec3 diffuse = brightness * vec3(1.0, 1.0, 1.0);

	colour = vec4(0.0, 1.0, 0.0, 1.0) * vec4(diffuse, 1.0);
	colour = mix(colour, vec4(skycolour, 1.0), visibility);
}
