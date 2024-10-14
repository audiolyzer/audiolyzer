class Celestial {
	
	constructor(origin, rotation, mass, radius, noise, chunks) {
		this.origin = origin;
		this.rotation = rotation;
		this.mass = mass;
		this.radius = radius;
		this.noise = noise;
		
		this.chunks = new Map();
		this.chunks.set("0:62:0", new Chunk(0, 62, 0, this));
		this.chunks.set("0:62:-1", new Chunk(0, 62, -1, this));
		this.chunks.set("-1:62:-1", new Chunk(-1, 62, -1, this));
		this.chunks.set("-1:62:0", new Chunk(-1, 62, 0, this));
	}
}