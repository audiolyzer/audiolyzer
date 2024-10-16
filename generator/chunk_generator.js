importScripts("../maths/vector3.js", "../generator/simplex_noise.js");

var cornerIndexAFromEdge
var cornerIndexBFromEdge
var triangulation

class ChunkGenerator {

	static generate(celestial, x, y, z, chunk_size, radius, noise) {
		let vertices_list = [];
		let indices_list = [];
		let vertices = [];
		let indices = [];
		
		for(let px = x*chunk_size; px < x*chunk_size+chunk_size; px++) {
			for(let py = y*chunk_size; py < y*chunk_size+chunk_size; py++) {
				for(let pz = z*chunk_size; pz < z*chunk_size+chunk_size; pz++) {
					ChunkGenerator.process(px, py, pz, x, y, z, chunk_size, vertices_list, indices_list, radius, noise);
				}
			}
		}
		
		for(let i = 0; i < indices_list.length; i++) {
			if(i < vertices_list.length) {
				vertices[i*3+0] = vertices_list[i].x;
				vertices[i*3+1] = vertices_list[i].y;
				vertices[i*3+2] = vertices_list[i].z;
			}
			indices[i] = indices_list[i];
		}
		
		return [2, celestial, x, y, z, vertices, indices];
	}
	
	static process(px, py, pz, x, y, z, chunk_size, vertices_list, indices_list, radius, noise) {
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
			
			let corner = new Vector3(corners[i]).sub(new Vector3(x*chunk_size, y*chunk_size, z*chunk_size));
			let pos = new Vector3(corner.x-1, corner.y-1, corner.z-1);
			let grid = new Vector3(x, y, z);
			
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
			
			level = ChunkGenerator.getLevel(corners[i].x-1, corners[i].y-1, corners[i].z-1, radius, noise);
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
				
				let va = ChunkGenerator.processVertex(corners[a0], corners[a1], values[a0], values[a1], px, py, pz);
				let vb = ChunkGenerator.processVertex(corners[b0], corners[b1], values[b0], values[b1], px, py, pz);
				let vc = ChunkGenerator.processVertex(corners[c0], corners[c1], values[c0], values[c1], px, py, pz);
				
				if(!vertices_list.some(v => v.equals(va))) {
					vertices_list.push(va);
				}
				indices_list.push(vertices_list.findIndex(v => v.equals(va)));
				
				if(!vertices_list.some(v => v.equals(vb))) {
					vertices_list.push(vb);
				}
				indices_list.push(vertices_list.findIndex(v => v.equals(vb)));
				
				if(!vertices_list.some(v => v.equals(vc))) {
					vertices_list.push(vc);
				}
				indices_list.push(vertices_list.findIndex(v => v.equals(vc)));
			}
		}
	}
	
	static processVertex(edge0, edge1, value0, value1, px, py, pz) {
		edge0 = new Vector3(edge0.x, edge0.y, edge0.z).sub(new Vector3(px, py, pz));
		edge1 = new Vector3(edge1.x, edge1.y, edge1.z).sub(new Vector3(px, py, pz));
		
		let t = (0.0 - value0) / (value1 - value0);
		return new Vector3(edge1.x, edge1.y, edge1.z).sub(new Vector3(edge0.x, edge0.y, edge0.z)).multiplyScalar(t).add(new Vector3(edge0.x, edge0.y, edge0.z)).add(new Vector3(px, py, pz));
	}
	
	static getLevel(px, py, pz, radius, noise) {
		let value = new Vector3(px, py, pz).length() - radius;
		value += noise.generate(new Vector3(px, py, pz));
		return value;
	}
}

onmessage = function(event) {
	if(event.data[0] == 0) {
		cornerIndexAFromEdge = event.data[1];
		cornerIndexBFromEdge = event.data[2];
		triangulation = event.data[3];
	} else if(event.data[0] == 1) {
		let noise = new SimplexNoise(event.data[7], event.data[8], event.data[9], event.data[10]);
		postMessage(ChunkGenerator.generate(event.data[1], event.data[2], event.data[3], event.data[4], event.data[5], event.data[6], noise));
	}
};