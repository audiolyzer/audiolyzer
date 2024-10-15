var chunk_size = 16;

class Chunk {
	
	constructor(x, y, z, celestial, vertices, indices, model) {
		this.celestial = celestial;
		this.x = x;
		this.y = y;
		this.z = z;
		
		generator.postMessage([1, this.celestial.id, this.x, this.y, this.z, chunk_size, celestial.radius, celestial.noise.seed, celestial.noise.amplitude, celestial.noise.octaves, celestial.noise.frequencies]);
	}
	
	initialize(vertices, indices) {
		this.vertices = vertices;
		this.indices = indices;
		this.model = Model.createChunkModel(vertices, indices);
	}
	
	collision(next) {
		let start = new Vector3(spectator.position.x, spectator.position.y, spectator.position.z).sub(this.celestial.origin).add(next);
		let end = new Vector3(spectator.getHeightPosition().x, spectator.getHeightPosition().y, spectator.getHeightPosition().z).sub(this.celestial.origin).add(next);
		let collision = Collision.detectCollision(start, end, 1.0, this.vertices, this.indices);
		return collision;
	}
}