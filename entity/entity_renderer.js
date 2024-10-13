class EntityRenderer {
	
	constructor(shader, entities) {
		this.shader = new EntityShader();
		this.entities = [];
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
			this.shader.loadMeshColour(new Vector4(entity.meshcolour.x, entity.meshcolour.y, entity.meshcolour.z, entity.model.textured ? -1.0 : entity.meshcolour.w));
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