class Model {

	constructor(skybox, vertices, normals, uvs, indices, id, texture, count, textured) {
		this.id = gl.createVertexArray();
		gl.bindVertexArray(this.id);
		
		this.createArrayBuffer(vertices, 3, 0);
		
		if(!skybox) {
			this.createArrayBuffer(normals, 3, 1);
			this.createArrayBuffer(uvs, 2, 2);
			
			this.createElementArrayBuffer(indices);
			
			this.count = indices.length;
		} else {
			this.count = vertices.length/3.0;
		}
		gl.bindVertexArray(null);
		this.textured = false;
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
	
	static loadCubeMap(texIds) {
		var id = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		for(let i = 0; i < texIds.length; i++) {
			var image = document.getElementById(texIds[i]);
			image.onLoad = function() {
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
			}
		}
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		return id;
	}
	
	setTexture(texture) {
		this.texture = texture;
		this.textured = true;
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