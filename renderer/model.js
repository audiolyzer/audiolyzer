class Model {
	
	static createEntityModel(vertices, normals, uvs, indices, texture) {
		let id = gl.createVertexArray();
		gl.bindVertexArray(id);
		
		Model.createArrayBuffer(vertices, 3, 0);
		
		Model.createArrayBuffer(normals, 3, 1);
		Model.createArrayBuffer(uvs, 2, 2);
		
		Model.createElementArrayBuffer(indices);
		
		let count = indices.length;
		gl.bindVertexArray(null);
		return new Vector3(id, count, Model.loadTexture(texture));
	}
	
	static createChunkModel(vertices, indices) {
		let id = gl.createVertexArray();
		gl.bindVertexArray(id);
		
		Model.createArrayBuffer(vertices, 3, 0);
		
		Model.createElementArrayBuffer(indices);
		
		let count = indices.length;
		gl.bindVertexArray(null);
		return new Vector2(id, count);
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
	
	static createArrayBuffer(data, dimensions, attrib) {
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.vertexAttribPointer(attrib, dimensions, gl.FLOAT, gl.FALSE, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}
	
	static createElementArrayBuffer(data) {
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		return vbo;
	}
}