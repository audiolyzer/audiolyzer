class Model {
	
	constructor(vertices, normals, uvs, indices, texture, id, count) {
		this.id = gl.createVertexArray();
		gl.bindVertexArray(this.id);
		
		this.createArrayBuffer(vertices, 3, 0);
		
		this.createArrayBuffer(normals, 3, 1);
		this.createArrayBuffer(uvs, 2, 2);
		
		this.createElementArrayBuffer(indices);
		
		this.count = indices.length;
		gl.bindVertexArray(null);
		this.texture = texture;
	}
	
	static loadTexture(texId) {
		var id = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, id);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById(texId));
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		return id;
	}
	
	createArrayBuffer(data, dimensions, attrib) {
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.vertexAttribPointer(attrib, dimensions, gl.FLOAT, gl.FALSE, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}
	
	createElementArrayBuffer(data) {
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		return vbo;
	}
}