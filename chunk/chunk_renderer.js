class ChunkRenderer {
	
	constructor(shader, chunks) {
		this.shader = new ChunkShader();
		this.chunks = [];
		
		this.chunks.push(new Chunk(0, 0, 0));
	}
	
	render() {
		if(this.shader.program) {
			this.shader.start();
			
			this.shader.loadAtmosphere(render_distance, skycolour);
		    this.shader.loadProjection(projection);
		    this.shader.loadView(view);
		    
		    for(var i = 0; i < this.chunks.length; i++) {
		    	this.draw(this.chunks[i]);
		    }
			this.shader.stop();
		}
	}
	
	draw(chunk) {
		if(chunk.model) {
			this.shader.loadTransformation(Maths.createTransformationMatrix(new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0), new Vector3(1.0, 1.0, 1.0)));
			
			gl.bindVertexArray(chunk.model.x);
			gl.enableVertexAttribArray(0);
		    
		    gl.drawElements(gl.TRIANGLES, chunk.model.y, gl.UNSIGNED_SHORT, 0);
		    
		    gl.disableVertexAttribArray(0);
		    gl.bindVertexArray(null);
		} else {
			if(chunk.generated) {
				chunk.initialize();
			}
		}
	}
}