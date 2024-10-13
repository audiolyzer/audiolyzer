#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 uvs;

uniform mat4 transformation;
uniform mat4 projection;
uniform mat4 view;

uniform float renderdistance;
uniform vec4 meshcolour;

out float visibility;
out vec4 pass_meshcolour;

out vec3 surfaceNormal;
out vec3 toLightVector;
out vec2 out_uvs;


void main() {
	vec4 worldPosition = transformation * vec4(position, 1.0);
	vec4 positionRelativeToCam = view * worldPosition;
	gl_Position = projection * positionRelativeToCam;

	surfaceNormal = (transformation * vec4(normal, 0.0)).xyz;
	toLightVector = vec3(250.0, 1000.0, 500.0) - worldPosition.xyz;
	out_uvs = uvs;

	visibility = clamp(length(positionRelativeToCam) / renderdistance, 0.0, 1.0);
	pass_meshcolour = meshcolour;
}
