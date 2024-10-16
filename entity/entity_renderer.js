class EntityRenderer {
	
	constructor(shader, entities, delta) {
		this.shader = new EntityShader();
		this.entities = [];
		this.delta = 0.5;
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