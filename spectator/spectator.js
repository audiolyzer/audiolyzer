class Spectator {
	
	constructor(position, rotation, seperation, moving, x, y, px, py, renderdistance, touchstart, keystart, wkeydown, looking, keys, next, sprint, addnext, grounded, fall, gravity, eyeheight, height, speed, jumpspeed) {
		this.position = new Vector3(-8.0, 1020.0, -8.0);
		this.px = Math.floor(this.position.x/chunk_size);
		this.py = Math.floor(this.position.y/chunk_size);
		this.pz = Math.floor(this.position.z/chunk_size);
		this.rotation = new Vector3(0.0, 0.0, 0.0);
		this.gravity = new Vector3(0.0, 0.0, 0.0);
		this.addnext = new Vector3(0.0, 0.0, 0.0);
		this.fall = new Vector3(0.0, 0.0, 0.0);
		this.next = new Vector3(0.0, 0.0, 0.0);
		this.renderdistance = 3;
		this.touchstart = 0.0;
		this.wkeydown = false;
		this.grounded = false;
		this.looking = false;
		this.zooming = false;
		this.moving = false;
		this.sprint = false;
		this.keystart = 0.0;
		
		this.height = 2.0;
		this.eyeheight = 1.8;
		this.jumpspeed = 5.0;
		this.speed = 4.0;
		this.keys = [];
		
		canvas.addEventListener("mousedown", e => {
			if(e.button == 0) {
				document.body.requestPointerLock();
			}
		});
		
		window.addEventListener("mousemove", e => {
			if(document.pointerLockElement) {
				this.rotation.y += e.movementX / 15.0;
				var pitch = this.rotation.x + e.movementY / 10.0;
				if(pitch >= -90.0 && pitch <= 90.0) {
					this.rotation.x = pitch;
				}
			}
		});
		
		window.addEventListener("keydown", e => {
			if(e.which == 87 && !this.wkeydown) {
				let now = new Date().getTime();
				if(now - this.keystart < 300) {
					this.speed = 6.0;
				}
				this.keystart = now;
				this.wkeydown = true;
				this.sprint = true;
			}
			this.keys[e.which] = true;
		});

		window.addEventListener("keyup", e => {
			if(e.which == 87) {
				this.wkeydown = false;
				this.sprint = false;
				this.speed = 4.0;
			}
			this.keys[e.which] = false;
		});
		
		canvas.addEventListener("touchstart", e => {
			this.seperation = this.getSeperation(e);
			
			let now = new Date().getTime();
			let delta = now - this.touchstart;
			if((delta < 300) && (delta > 0)) {
				if(this.grounded) {
					this.fall.add(new Vector3(this.position.x, this.position.y, this.position.z).sub(celestials.get(0).origin).setLength(this.jumpspeed/framerate));
					this.grounded = false;
				}
			}
			this.touchstart = now;
		});
		
		canvas.addEventListener("touchmove", e => {
			var distance = this.getSeperation(e);
			if(distance >= 0) {
				if(this.moving) {
					var movement = this.seperation - distance;
					this.addnext.x += (movement > 0.0 ? -1.0 : 1.0) * Math.sin(Maths.toRadians(this.rotation.y));
					this.addnext.z += (movement > 0.0 ? -1.0 : 1.0) * -Math.cos(Maths.toRadians(this.rotation.y));
				}
				this.looking = false;
				this.moving = true;
			} else {
				if(this.looking) {
					var dx = e.touches[0].pageX - this.x;
					var dy = e.touches[0].pageY - this.y;
					this.rotation.y += dx * 0.25;
					this.rotation.x += dy * 0.25;
					if(this.rotation.x > 90.0) {
						this.rotation.x = 90.0;
					} else if(this.rotation.x < -90.0) {
						this.rotation.x = -90.0;
					}
				}
				this.x = e.touches[0].pageX;
				this.y = e.touches[0].pageY;
				this.looking = true;
				this.moving = false;
			}
		});
		
		canvas.addEventListener("touchend", e => {
			this.looking = false;
			this.moving = false;
		});
	}
	
	tick() {
		if(document.pointerLockElement) {
			if(this.keys[87]) {
				this.next.add(new Vector3(Math.sin(Maths.toRadians(this.rotation.y)), 0.0, -Math.cos(Maths.toRadians(this.rotation.y))));
		    }
		    if(this.keys[83]) {
		    	this.next.add(new Vector3(-Math.sin(Maths.toRadians(this.rotation.y)), 0.0, Math.cos(Maths.toRadians(this.rotation.y))));
		    }
		    if(this.keys[65]) {
		    	this.next.add(new Vector3(Math.sin(Maths.toRadians(this.rotation.y-90.0)), 0.0, -Math.cos(Maths.toRadians(this.rotation.y-90.0))));
		    }
		    if(this.keys[68]) {
		    	this.next.add(new Vector3(-Math.sin(Maths.toRadians(this.rotation.y-90.0)), 0.0, Math.cos(Maths.toRadians(this.rotation.y-90.0))));
		    }
		}
	    this.next.add(this.addnext);
	    this.addnext = new Vector3(0.0, 0.0, 0.0);
	    
		if(this.next.length() > 0.0) {
			this.next.setLength(this.speed/framerate);
		}
		
		if(this.keys[16]) {
			this.eyeheight = 1.55;
			this.sprint = false;
			this.height = 1.75;
			this.speed = 2.0;
		} else if(!this.sprint) {
			this.eyeheight = 1.8;
			this.height = 2.0;
			this.speed = 4.0;
		}
		
		let position = new Vector3(this.position.x, this.position.y, this.position.z).sub(celestials.get(0).origin);
		
		this.px = Math.floor(this.position.x/chunk_size);
		this.py = Math.floor(this.position.y/chunk_size);
		this.pz = Math.floor(this.position.z/chunk_size);
		this.generate();
		
		let chunk = celestials.get(0).chunks.get(this.px+":"+this.py+":"+this.pz);		
		
		this.checkGravity();
		this.next.add(this.fall);
		this.checkCollision(chunk);
		
		if(this.keys[32] && document.pointerLockElement) {
			if(this.grounded) {
				this.fall.add(new Vector3(this.position.x, this.position.y, this.position.z).sub(celestials.get(0).origin).setLength(this.jumpspeed/framerate));
				this.grounded = false;
			}
		}
		
		if(chunk && !chunk.model) {
			this.fall = new Vector3(0.0, 0.0, 0.0);
			this.next = new Vector3(0.0, 0.0, 0.0);
		}
		
		this.position.add(this.next);
		this.next = new Vector3(0.0, 0.0, 0.0);
	}
	
	checkGravity() {
		if(!this.grounded) {
			this.gravity = Maths.getAcceleration(this.position, celestials.get(0).origin, celestials.get(0).mass);
			let delta = new Vector3(this.gravity.x, this.gravity.y, this.gravity.z).divideScalar(framerate);
			if(delta.length() > 0.0) {
				this.fall.add(new Vector3(this.gravity.x, this.gravity.y, this.gravity.z).divideScalar(framerate));
			}
		}
	}
	
	generate() {
		let chunkset = new Map;
		for(let x = this.px-this.renderdistance; x <= this.px+this.renderdistance; x++) {
			for(let y = this.py-this.renderdistance; y <= this.py+this.renderdistance; y++) {
				for(let z = this.pz-this.renderdistance; z <= this.pz+this.renderdistance; z++) {
					if(!celestials.get(0).chunks.get(x+":"+y+":"+z)) {
						let distance = this.position.distanceToSquared(new Vector3(x*chunk_size, y*chunk_size, z*chunk_size));
						chunkset.set(distance, new Chunk(x, y, z, celestials.get(0)));
					}
				}
			}
		}
		
		let chunks = new Map(Array.from(chunkset.entries()).sort((a, b) => a[0] - b[0]));
		
		let generator = 0;
		for(let chunk of chunks.values()) {
			chunk.generate(generators[generator]);
			celestials.get(0).chunks.set(chunk.x+":"+chunk.y+":"+chunk.z, chunk);
			generator %= generators.length-1;
			generator++;
		}
	}
	
	checkCollision(chunk) {
		if(chunk && chunk.model) {
			let collision = chunk.collision(this.next);
			if(collision) {
				this.next.add(new Vector3(collision.x, collision.y, collision.z).multiplyScalar(45.0/framerate));
				
				let normal = new Vector3(collision.x, collision.y, collision.z).setLength(1.0);
				let up = new Vector3(-this.gravity.x, -this.gravity.y, -this.gravity.z).setLength(1.0);
				let slope = Maths.toDegrees(up.angleTo(normal));
				
				if(slope < 45.0) {
					this.fall = new Vector3(0.0, 0.0, 0.0);
					this.grounded = true;
				} else {
					this.grounded = false;
				}
			} else {
				this.grounded = false;
			}
		}
	}
	
	getEyePosition() {
		if(this.gravity.length() > 0.0) {
			return new Vector3(this.position.x, this.position.y, this.position.z).add(new Vector3(-this.gravity.x, -this.gravity.y, -this.gravity.z).setLength(this.eyeheight));
		}
		return this.position;
	}
	
	getHeightPosition() {
		if(this.gravity.length() > 0.0) {
			return new Vector3(this.position.x, this.position.y, this.position.z).add(new Vector3(-this.gravity.x, -this.gravity.y, -this.gravity.z).setLength(this.height));
		}
		return this.position;
	}
	
	getRay(x, y) {
		x = (2.0*x)/canvas.width - 1.0;
		y = -((2.0*y)/canvas.height - 1.0);
		var clipCoords = new Vector4(x, y, -1.0, 1.0);
		
		var invProjection = projection.clone().invert();
		var eyeCoords = clipCoords.applyMatrix4(invProjection);
		eyeCoords = new Vector4(eyeCoords.x, eyeCoords.y, -1.0, 0.0);
		
		var invView = view.clone().invert();
		var worldRay = eyeCoords.applyMatrix4(invView);
		var ray = new Vector3(worldRay.x, worldRay.y, worldRay.z);
		return ray.normalize();
	}
	
	getSeperation(e) {
		if(e.touches.length > 1) {
			var ax = e.touches[0].pageX;
			var ay = e.touches[0].pageY;
			var bx = e.touches[1].pageX;
			var by = e.touches[1].pageY;
			return Math.pow(Math.pow(ax-bx, 2.0) + Math.pow(ay-by, 2.0), 0.5);
		} else {
			return -1;
		}
	}
}