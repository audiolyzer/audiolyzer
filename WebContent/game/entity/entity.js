class Entity {
	
	constructor(mod, pos, rot, size, model, position, rotation, scale, meshcolour) {
		this.model = mod;
		this.position = pos;
		this.rotation = rot;
		this.scale = size;
		this.meshcolour = new Vector4(Math.random()/2.0+0.5, Math.random()/2.0+0.5, Math.random()/2.0+0.5, 1.0);
	}
}