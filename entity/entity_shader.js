class EntityShader extends Shader {
	
	constructor(transformation, projection, view, renderdistance, meshcolour, skycolour) {
		super('entity/entity_vsh.glsl', 'entity/entity_fsh.glsl');
	}
	
	bindAttributes() {
		super.bindAttribute(0, 'position');
		super.bindAttribute(1, 'normal');
		super.bindAttribute(2, 'uvs');
	}
	
	getAllUniformLocations() {
		this.transformation = super.getUniformLocation('transformation');
		this.projection = super.getUniformLocation('projection');
		this.view = super.getUniformLocation('view');
		
		this.renderdistance = super.getUniformLocation('renderdistance');
		this.meshcolour = super.getUniformLocation('meshcolour');
		this.skycolour = super.getUniformLocation('skycolour');
	}
	
	loadAtmosphere(distance, colour) {
		super.loadFloat(this.renderdistance, distance);
		super.loadVector3f(this.skycolour, colour);
	}
	
	loadMeshColour(colour) {
		super.loadVector4f(this.meshcolour, colour);
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