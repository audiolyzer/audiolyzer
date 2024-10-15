#version 300 es
precision highp float;

in float visibility;

in vec3 surfaceNormal;
in vec3 toLightVector;
in vec2 out_uvs;

uniform sampler2D tex;
uniform vec3 skycolour;

out vec4 colour;

void main() {
	vec3 unitNormal = normalize(surfaceNormal);
	vec3 unitLightVector = normalize(toLightVector);
	float nDotl = dot(unitNormal, unitLightVector);
	float brightness = max(nDotl, 0.15);
	vec3 diffuse = brightness * vec3(1.0, 1.0, 1.0);

	colour = texture(tex, out_uvs) * vec4(diffuse, 1.0);
	colour = mix(colour, vec4(skycolour, 1.0), visibility);
}
