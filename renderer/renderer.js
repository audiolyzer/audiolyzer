var skycolour;
var projection;
var view;

var render_distance = 128.0;

class Renderer {
	
	constructor(chunk_renderer, entity_renderer) {
		skycolour = new Vector3(66.0/255.0, 133.0/255.0, 244.0/255.0);
		this.chunk_renderer = new ChunkRenderer();
		this.entity_renderer = new EntityRenderer();
	}
	
	prepare() {
		gl.cullFace(gl.BACK);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
	    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	    gl.clearColor(skycolour.x, skycolour.y, skycolour.z, 1.0);
	    
	    const fov = Maths.toDegrees(2.0 * Math.atan(Math.tan(Maths.toRadians(70.0) / 2.0) * canvas.width / canvas.height));
	    projection = Maths.createProjectionMatrix(fov, 0.1, render_distance);
	    view = Maths.createViewMatrix(spectator.getEyePosition(), spectator.rotation);
	}
	
	render(time) {
		this.prepare();
		this.chunk_renderer.render();
		this.entity_renderer.render();
	}
}