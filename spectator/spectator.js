class Spectator {
	
	constructor(position, rotation, seperation, moving, x, y, looking, keys, next, addnext, grounded, fall, gravity, eyeheight, height, speed, jumpspeed) {
		this.position = new Vector3(-8.0, 1020.0, -8.0);
		this.rotation = new Vector3(0.0, 0.0, 0.0);
		this.gravity = new Vector3(0.0, 0.0, 0.0);
		this.addnext = new Vector3(0.0, 0.0, 0.0);
		this.fall = new Vector3(0.0, 0.0, 0.0);
		this.next = new Vector3(0.0, 0.0, 0.0);
		this.grounded = false;
		this.looking = false;
		this.zooming = false;
		this.moving = false;
		
		this.height = 2.0;
		this.eyeheight = 1.8;
		this.jumpspeed = 5.0;
		this.speed = 5.0;
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
		   this.keys[e.which] = true;
		});

		window.addEventListener("keyup", e => {
		    this.keys[e.which] = false;
		});
		
		canvas.addEventListener("touchmove", e => {
			var distance = this.getSeperation(e);
			if(distance >= 0) {
				if(this.moving) {
					var movement = this.seperation - distance;
					this.addnext.x += (movement > 0.0 ? -1.0 : 1.0) * Math.sin(Maths.toRadians(this.rotation.y));
					this.addnext.z += (movement > 0.0 ? -1.0 : 1.0) * -Math.cos(Maths.toRadians(this.rotation.y));
				}
				this.seperation = distance;
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
	    this.next.add(this.addnext);
	    this.addnext = new Vector3(0.0, 0.0, 0.0);
	    
		if(this.next.length() > 0.0) {
			this.next.setLength(this.speed/framerate);
		}
		
		if(this.keys[16]) {
			this.eyeheight = 1.55;
			this.height = 1.75;
			this.speed = 3.0;
		} else {
			this.eyeheight = 1.8;
			this.height = 2.0;
			this.speed = 5.0;
		}
		
		this.checkGravity();
		this.next.add(this.fall);
		this.checkCollision();
		
		if(this.keys[32]) {
			if(this.grounded) {
				this.fall.add(new Vector3(this.position.x, this.position.y, this.position.z).sub(celestials[0].origin).setLength(this.jumpspeed/framerate));
				this.grounded = false;
			}
		}
		
		this.position.add(this.next);
		this.next = new Vector3(0.0, 0.0, 0.0);
	}
	
	checkGravity() {
		if(!this.grounded) {
			this.gravity = Maths.getAcceleration(this.position, celestials[0].origin, celestials[0].mass);
			let delta = new Vector3(this.gravity.x, this.gravity.y, this.gravity.z).divideScalar(framerate);
			if(delta.length() > 0.0) {
				this.fall.add(new Vector3(this.gravity.x, this.gravity.y, this.gravity.z).divideScalar(framerate));
			}
		}
	}
	
	checkCollision() {
		let position = new Vector3(this.position.x, this.position.y, this.position.z).sub(celestials[0].origin);
		let px = Math.floor(this.position.x/chunk_size);
		let py = Math.floor(this.position.y/chunk_size);
		let pz = Math.floor(this.position.z/chunk_size);
		let chunk = celestials[0].chunks.get(px+":"+py+":"+pz);
		
		if(chunk) {
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