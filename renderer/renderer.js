var skycolour;

var projection;
var view;

class Renderer {
	constructor() {
		skycolour = new Vector3(66.0/255.0, 133.0/255.0, 244.0/255.0);
	}
	
	prepare() {
		gl.cullFace(gl.BACK);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
	    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	    gl.clearColor(skycolour.x, skycolour.y, skycolour.z, 1.0);
	    
	    projection = Maths.createProjectionMatrix(70.0, 0.1, render_distance);
	    view = Maths.createViewMatrix(new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0));
	}
	
	render(time) {
		this.prepare();
	}
}