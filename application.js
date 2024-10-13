var framerate;
var canvas;
var gl;

var render_distance = 1000.0;

class Application {
	constructor(renderer, previous) {
		let application = this;
		canvas = document.getElementById("window");
		window.onerror = function(msg, url, line) {
			alert("["+line+"]: "+msg);
			window.requestAnimationFrame((time)=>application.tick(time));
		}
		window.requestAnimationFrame((time)=>this.tick(time));
	}
	
	init() {
		this.renderer = new Renderer();
	}
	
	tick(time) {
		if(!gl) {
			this.initializeWebGLCapabilities();
		} else {
			gl.viewport(0, 0, canvas.width, canvas.height);
			this.renderer.render(time/1000.0);
		}
		if(this.previous != null) {
    		framerate = 1000.0 / (time - this.previous);
	    	this.previous = time;
	    }
    	this.previous = time;
		window.requestAnimationFrame((time)=>this.tick(time));
	}
	
	initializeWebGLCapabilities() {
		gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
	    if(gl) {
	        console.log("WebGL has been initialized");
	        gl.viewport(0, 0, canvas.width, canvas.height);
	        this.init();
	    }
	}
}