var chunk_size = 16;

var seed = 0;
var octaves = 1;
var amplitude = 1.0;
var frequency_x = 0.1;
var frequency_y = 0.1;
var frequency_z = 0.1;

class Chunk {
	
	constructor(px, py, pz, x, y, z, model, vertices, indices, vertices_array, indices_array, generated) {
		this.generated = false;
		this.vertices = [];
		this.indices = [];
		this.x = px;
		this.y = py;
		this.z = pz;
		
		this.generate();
	}
	
	initialize() {
		this.model = Model.createChunkModel(this.vertices_array, this.indices_array);
	}
	
	generate() {
		this.generated = false;
		for(let px = this.x*chunk_size; px < this.x*chunk_size+chunk_size; px++) {
			for(let py = this.y*chunk_size; py < this.y*chunk_size+chunk_size; py++) {
				for(let pz = this.z*chunk_size; pz < this.z*chunk_size+chunk_size; pz++) {
					this.process(px, py, pz);
				}
			}
		}
		this.vertices_array = [];
		this.indices_array = [];
		for(let i = 0; i < this.indices.length; i++) {
			if(i < this.vertices.length) {
				this.vertices_array[i*3+0] = this.vertices[i].x;
				this.vertices_array[i*3+1] = this.vertices[i].y;
				this.vertices_array[i*3+2] = this.vertices[i].z;
			}
			this.indices_array[i] = this.indices[i];
		}
		this.generated = true;
	}
	
	process(px, py, pz) {
		let corners = [
			new Vector3(px+0, py+0, pz+0),
			new Vector3(px+1, py+0, pz+0),
			new Vector3(px+1, py+0, pz+1),
			new Vector3(px+0, py+0, pz+1),
			new Vector3(px+0, py+1, pz+0),
			new Vector3(px+1, py+1, pz+0),
			new Vector3(px+1, py+1, pz+1),
			new Vector3(px+0, py+1, pz+1)
		];
		let values = [];
		let index = 0;
		
		for(let i = 0; i < 8; i++) {
			let border = false;
			let level = 0.0;
			
			let corner = new Vector3(corners[i]).sub(new Vector3(this.x*chunk_size, this.y*chunk_size, this.z*chunk_size));
			let pos = new Vector3(corner.x-1, corner.y-1, corner.z-1);
			let grid = new Vector3(this.x, this.y, this.z);
			
			if(corner.x == 0) {
				grid.x--;
				pos.x = chunk_size-1;
				border = true;
			}
			if(corner.y == 0) {
				grid.y--;
				pos.y = chunk_size-1;
				border = true;
			}
			if(corner.z == 0) {
				grid.z--;
				pos.z = chunk_size-1;
				border = true;
			}
			if(corner.x == chunk_size+1) {
				grid.x++;
				pos.x = 0;
				border = true;
			}
			if(corner.y == chunk_size+1) {
				grid.y++;
				pos.y = 0;
				border = true;
			}
			if(corner.z == chunk_size+1) {
				grid.z++;
				pos.z = 0;
				border = true;
			}
			
			level = this.getLevel(corners[i].x-1, corners[i].y-1, corners[i].z-1);
			values[i] = level;
			
			if(level < 0.0) {
				index |= (1 << i);
			}
		}
		let chunkedges = triangulation[index];
		
		for(let i = 0; i < 16; i += 3) {
			if(chunkedges[i] == -1) {
				break;
			} else {
				let a0 = cornerIndexAFromEdge[chunkedges[i+0]];
				let a1 = cornerIndexBFromEdge[chunkedges[i+0]];
				
				let b0 = cornerIndexAFromEdge[chunkedges[i+1]];
				let b1 = cornerIndexBFromEdge[chunkedges[i+1]];
				
				let c0 = cornerIndexAFromEdge[chunkedges[i+2]];
				let c1 = cornerIndexBFromEdge[chunkedges[i+2]];
				
				let va = this.processVertex(corners[a0], corners[a1], values[a0], values[a1], px, py, pz);
				let vb = this.processVertex(corners[b0], corners[b1], values[b0], values[b1], px, py, pz);
				let vc = this.processVertex(corners[c0], corners[c1], values[c0], values[c1], px, py, pz);
				
				if(!this.vertices.some(v => v.equals(va))) {
					this.vertices.push(va);
				}
				this.indices.push(this.vertices.findIndex(v => v.equals(va)));
				
				if(!this.vertices.some(v => v.equals(vb))) {
					this.vertices.push(vb);
				}
				this.indices.push(this.vertices.findIndex(v => v.equals(vb)));
				
				if(!this.vertices.some(v => v.equals(vc))) {
					this.vertices.push(vc);
				}
				this.indices.push(this.vertices.findIndex(v => v.equals(vc)));
			}
		}
	}
	
	processVertex(edge0, edge1, value0, value1, px, py, pz) {
		edge0 = new Vector3(edge0.x, edge0.y, edge0.z).sub(new Vector3(px, py, pz));
		edge1 = new Vector3(edge1.x, edge1.y, edge1.z).sub(new Vector3(px, py, pz));
		
		let t = (0.0 - value0) / (value1 - value0);
		return new Vector3(edge1.x, edge1.y, edge1.z).sub(new Vector3(edge0.x, edge0.y, edge0.z)).multiplyScalar(t).add(new Vector3(edge0.x, edge0.y, edge0.z)).add(new Vector3(px, py, pz));
	}
	
	collision(next) {
		let start = new Vector3(spectator.position.x, spectator.position.y, spectator.position.z).add(next);
		let end = new Vector3(start.x, start.y, start.z).add(0.0, 1.8, 0.0);
		return Collision.detectCollision(start, end, 1.0, this.vertices_array, this.indices_array);
	}
	
	getLevel(px, py, pz) {
		let value = py;
		value += SimplexNoise.noise3D(new Vector3(px, py, pz), seed, amplitude, octaves, new Vector3(frequency_x, frequency_y, frequency_z));
		return value;
	}
}