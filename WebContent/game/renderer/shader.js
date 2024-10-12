class Shader {
	
	constructor(vsh_url, fsh_url, program) {
		var classpath = this;
		loadTextResource(vsh_url, function(vsh) {
			loadTextResource(fsh_url, function(fsh) {
				classpath.construct(vsh, fsh);
			});
		});
	}
	
	construct(vsh, fsh) {
		if(this.constructor == Shader) {
			throw new Error("Abstract classes can't be instantiated.");
		}
		var vertex = gl.createShader(gl.VERTEX_SHADER);
		var fragment = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(vertex, vsh);
		gl.shaderSource(fragment, fsh);
		gl.compileShader(vertex);
		if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
			alert("Could not compile vertex shader! " + gl.getShaderInfoLog(vertex));
			return;
		}
		gl.compileShader(fragment);
		if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
			alert("Could not compile fragment shader! " + gl.getShaderInfoLog(fragment));
			return;
		}
		this.program = gl.createProgram();
		gl.attachShader(this.program, vertex);
		gl.attachShader(this.program, fragment);
		this.bindAttributes();
		gl.linkProgram(this.program);
		if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			alert("Could not link shader program! " + gl.getProgramInfoLog(this.program));
			return;
		}
		gl.validateProgram(this.program);
		if(!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
			alert("Could not validate shader program! " + gl.getProgramInfoLog(this.program));
			return;
		}
		this.getAllUniformLocations();
	}
	
	bindAttributes() {
		throw new Error("Method 'bindAttributes()' must be implemented.");
	}
	
	bindAttribute(attrib, name) {
		gl.bindAttribLocation(this.program, attrib, name);
	}
	
	getAllUniformLocations() {
		throw new Error("Method 'getAllUniformLocations()' must be implemented.");
	}
	
	getUniformLocation(name) {
		return gl.getUniformLocation(this.program, name);
	}
	
	start() {
		gl.useProgram(this.program);
	}
	
	stop() {
		gl.useProgram(null);
	}
	
	loadFloat(location, value) {
		gl.uniform1f(location, value);
	}
	
	loadVector3f(location, vector) {
		gl.uniform3f(location, vector.x, vector.y, vector.z);
	}
	
	loadVector4f(location, vector) {
		gl.uniform4f(location, vector.x, vector.y, vector.z, vector.w);
	}
	
	loadMatrix4f(location, matrix) {
		gl.uniformMatrix4fv(location, gl.FALSE, matrix.elements);
	}
}