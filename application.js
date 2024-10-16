var spectator;
var framerate;
var canvas;
var gl;

var fullscreen = false;

var generators = [];
var celestials = new Map();

class Application {
	
	constructor(previous, renderer) {
		let application = this;
		canvas = document.getElementById("window");
		
		canvas.width = window.innerWidth*0.75;
    	canvas.height = window.innerHeight*0.75;
		
		window.addEventListener("keydown", e => {
			if(e.keyCode == 32 && e.target == document.body) {
				e.preventDefault();
			}
			if(e.which == 13) {
				if(fullscreen) {
					canvas.width = window.innerWidth*0.75;
			    	canvas.height = window.innerHeight*0.75;
					fullscreen = false;
				} else {
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;
					fullscreen = true;
				}
			}
		});
		
		window.onerror = function(msg, url, line) {
			console.error("["+line+"]: "+msg);
			window.requestAnimationFrame((time)=>application.tick(time));
		}
		window.requestAnimationFrame((time)=>this.tick(time));
	}
	
	init() {
		this.initWorldGen();
		Models.loadModels();
		
		spectator = new Spectator();
		this.renderer = new Renderer();
		
		celestials.set(0, new Celestial(0, new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0), 3.5E15, 1000.0, new SimplexNoise(Maths.randomInt(999999999), 8.0, 2, new Vector3(0.034, 0.034, 0.034))));
	}
	
	initWorldGen() {
		let cores = Math.floor(navigator.hardwareConcurrency*0.7);
		for(let i = 0; i < cores; i++) {
			let generator = new Worker("generator/chunk_generator.js");
			generator.postMessage([0, cornerIndexAFromEdge, cornerIndexBFromEdge, triangulation]);
			generator.onmessage = function(event) {
				if(event.data[0] == 2) {
					celestials.get(event.data[1]).chunks.get(event.data[2]+":"+event.data[3]+":"+event.data[4]).initialize(event.data[5], event.data[6]);
				}
			};
			generators.push(generator);
		}
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