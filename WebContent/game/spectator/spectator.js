class Spectator {
	
	constructor(position, rotation, seperation, moving, x, y, looking) {
		this.position = new Vector3(0.0, 0.0, 5.0);
		this.rotation = new Vector3(0.0, 0.0, 0.0);
		this.looking = false;
		this.zooming = false;
		this.moving = false;
		
		canvas.addEventListener("touchmove", e => {
			var distance = this.getSeperation(e);
			if(distance >= 0) {
				if(this.moving) {
					var movement = this.seperation - distance;
					
					var fx = (e.touches[0].pageX + e.touches[1].pageX) / 2.0;
					var fy = (e.touches[0].pageY + e.touches[1].pageY) / 2.0;
					var direction = this.getRay(fx, fy);
					
					this.position.x -= movement * direction.x * 0.025;
					this.position.y -= movement * direction.y * 0.025;
					this.position.z -= movement * direction.z * 0.025;
				}
				this.seperation = distance;
				this.looking = false;
				this.moving = true;
			} else {
				if(this.looking) {
					var dx = e.touches[0].pageX - this.x;
					var dy = e.touches[0].pageY - this.y;
					this.rotation.y += dx * 0.2;
					this.rotation.x += dy * 0.2;
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