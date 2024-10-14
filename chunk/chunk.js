var chunk_size = 16;

class Chunk {
	
	constructor(x, y, z, celestial, vertices_list, indices_list, vertices, indices, model, generated) {
		this.celestial = celestial;
		this.vertices_list = [];
		this.indices_list = [];
		this.generated = false;
		this.x = x;
		this.y = y;
		this.z = z;
		
		this.generate();
	}
	
	initialize() {
		this.model = Model.createChunkModel(this.vertices, this.indices);
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
		this.vertices = [];
		this.indices = [];
		for(let i = 0; i < this.indices_list.length; i++) {
			if(i < this.vertices_list.length) {
				this.vertices[i*3+0] = this.vertices_list[i].x;
				this.vertices[i*3+1] = this.vertices_list[i].y;
				this.vertices[i*3+2] = this.vertices_list[i].z;
			}
			this.indices[i] = this.indices_list[i];
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
				
				if(!this.vertices_list.some(v => v.equals(va))) {
					this.vertices_list.push(va);
				}
				this.indices_list.push(this.vertices_list.findIndex(v => v.equals(va)));
				
				if(!this.vertices_list.some(v => v.equals(vb))) {
					this.vertices_list.push(vb);
				}
				this.indices_list.push(this.vertices_list.findIndex(v => v.equals(vb)));
				
				if(!this.vertices_list.some(v => v.equals(vc))) {
					this.vertices_list.push(vc);
				}
				this.indices_list.push(this.vertices_list.findIndex(v => v.equals(vc)));
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
		let start = new Vector3(spectator.position.x, spectator.position.y, spectator.position.z).sub(this.celestial.origin).add(next);
		let end = new Vector3(start.x, start.y, start.z).add(0.0, 1.8, 0.0);
		return Collision.detectCollision(start, end, 1.0, this.vertices, this.indices);
	}
	
	getLevel(px, py, pz) {
		let value = new Vector3(px, py, pz).length() - this.celestial.radius;
		value += this.celestial.noise.generate(new Vector3(px, py, pz));
		return value;
	}
}