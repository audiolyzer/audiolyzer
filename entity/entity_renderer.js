class EntityRenderer {
	
	constructor(shader, entities) {
		this.shader = new EntityShader();
		this.entities = [];
		
		var classpath = this;
		loadJSONResource('assets/models/conveyor.json', function(data) {
			var vertices = data.meshes[0].vertices;
			var normals = data.meshes[0].normals;
			var uvs = data.meshes[0].texturecoords[0];
			var indices = [].concat.apply([], data.meshes[0].faces);
			var model = new Model(vertices, normals, uvs, indices, Model.loadTexture('texture_conveyor'));
			classpath.entities.push(new Entity(model, new Vector3(0.0, 0.0, -5.0), new Vector3(0.0, 0.0, 0.0), new Vector3(1.0, 1.0, 1.0)));
		});
	}
	
	render() {
		if(this.shader.program) {
			this.shader.start();
			
			this.shader.loadAtmosphere(render_distance, skycolour);
		    this.shader.loadProjection(projection);
		    this.shader.loadView(view);
		    
		    for(var i = 0; i < this.entities.length; i++) {
		    	this.draw(this.entities[i]);
		    }
		    
			this.shader.stop();
		}
	}
	
	draw(entity) {
		if(entity.model) {
			this.shader.loadTransformation(Maths.createTransformationMatrix(entity.position, entity.rotation, entity.scale));
			
			gl.bindVertexArray(entity.model.id);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);
			gl.enableVertexAttribArray(2);
			
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, entity.model.texture);
		    
		    gl.drawElements(gl.TRIANGLES, entity.model.count, gl.UNSIGNED_SHORT, 0);
		    
		    gl.disableVertexAttribArray(2);
		    gl.disableVertexAttribArray(1);
		    gl.disableVertexAttribArray(0);
		    gl.bindVertexArray(null);
		}
	}
}