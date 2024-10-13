class EntityRenderer {
	
	constructor(shader, entities, delta) {
		this.shader = new EntityShader();
		this.entities = [];
		this.delta = 0.5;
		
		var classpath = this;
		loadJSONResource('assets/models/chicken.json', function(data) {
			var vertices = data.meshes[0].vertices;
			var normals = data.meshes[0].normals;
			var uvs = data.meshes[0].texturecoords[0];
			var indices = [].concat.apply([], data.meshes[0].faces);
			var model = Model.createEntityModel(vertices, normals, uvs, indices, 'texture_chicken');
			classpath.entities.push(new Entity(model, new Vector3(8.0, 1.0, 8.0), new Vector3(0.0, -45.0, 0.0), new Vector3(0.5, 0.5, 0.5)));
		});
	}
	
	render() {
		if(this.shader.program) {
			this.shader.start();
			
			this.shader.loadAtmosphere(render_distance, skycolour);
		    this.shader.loadProjection(projection);
		    this.shader.loadView(view);
		    
		    if(this.entities[0].rotation.y <= -90.0) {
		    	this.delta = 0.5;
		    }
		    if(this.entities[0].rotation.y >= 0.0) {
		    	this.delta = -0.5;
		    }
		    this.entities[0].rotation.y += this.delta;
		    for(var i = 0; i < this.entities.length; i++) {
		    	this.draw(this.entities[i]);
		    }
		    
			this.shader.stop();
		}
	}
	
	draw(entity) {
		if(entity.model) {
			this.shader.loadTransformation(Maths.createTransformationMatrix(entity.position, entity.rotation, entity.scale));
			
			gl.bindVertexArray(entity.model.x);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);
			gl.enableVertexAttribArray(2);
			
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, entity.model.z);
		    
		    gl.drawElements(gl.TRIANGLES, entity.model.y, gl.UNSIGNED_SHORT, 0);
		    
		    gl.disableVertexAttribArray(2);
		    gl.disableVertexAttribArray(1);
		    gl.disableVertexAttribArray(0);
		    gl.bindVertexArray(null);
		}
	}
}