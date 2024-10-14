var spectator;
var framerate;
var canvas;
var gl;

var celestials = [];

class Application {
	
	constructor(renderer, previous) {
		let application = this;
		canvas = document.getElementById("window");
		window.onerror = function(msg, url, line) {
			console.error("["+line+"]: "+msg);
			window.requestAnimationFrame((time)=>application.tick(time));
		}
		window.requestAnimationFrame((time)=>this.tick(time));
	}
	
	init() {
		spectator = new Spectator();
		this.renderer = new Renderer();
		
		celestials.push(new Celestial(new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0), 3.5E15, 1000.0, new SimplexNoise(Maths.randomInt(999999999), 10.0, 1, new Vector3(0.1, 0.1, 0.1))));
	}
	
	tick(time) {
		if(!gl) {
			this.initializeWebGLCapabilities();
		} else {
			gl.viewport(0, 0, canvas.width, canvas.height);
			this.renderer.render(time/1000.0);
			spectator.tick();
		}
		if(this.previous != null) {
    		framerate = 1000.0 / (time - this.previous);
	    	this.previous = time;
	    }
    	this.previous = time;
    	canvas.width = window.innerWidth*0.75;
    	canvas.height = canvas.width*(480.0/854.0);
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