class Celestial {
	
	constructor(id, origin, rotation, mass, radius, noise, chunks) {
		this.id = id;
		this.origin = origin;
		this.rotation = rotation;
		this.mass = mass;
		this.radius = radius;
		this.noise = noise;
		this.chunks = new Map();		
	}
}