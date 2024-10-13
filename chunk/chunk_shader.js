class ChunkShader extends Shader {
	
	constructor(transformation, projection, view, renderdistance, skycolour) {
		super('chunk/chunk_vsh.glsl', 'chunk/chunk_fsh.glsl');
	}
	
	bindAttributes() {
		super.bindAttribute(0, 'position');
	}
	
	getAllUniformLocations() {
		this.transformation = super.getUniformLocation('transformation');
		this.projection = super.getUniformLocation('projection');
		this.view = super.getUniformLocation('view');
		
		this.renderdistance = super.getUniformLocation('renderdistance');
		this.skycolour = super.getUniformLocation('skycolour');
	}
	
	loadAtmosphere(distance, colour) {
		super.loadFloat(this.renderdistance, distance);
		super.loadVector3f(this.skycolour, colour);
	}
	
	loadTransformation(matrix) {
		super.loadMatrix4f(this.transformation, matrix);
	}
	
	loadProjection(matrix) {
		super.loadMatrix4f(this.projection, matrix);
	}
	
	loadView(matrix) {
		super.loadMatrix4f(this.view, matrix);
	}
}