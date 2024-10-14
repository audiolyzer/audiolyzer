class Maths {
	
	static getAcceleration(position, origin, mass) {
		return new Vector3(origin.x, origin.y, origin.z).sub(position).setLength(6.67430E-11*mass/(position.distanceTo(origin)*position.distanceTo(origin)));
	}
	
	static createTransformationMatrix(translation, rotation, scale) {
		var transformation = new Matrix4().identity();
		transformation.multiply(new Matrix4().makeTranslation(translation.x, translation.y, translation.z));
		transformation.multiply(new Matrix4().makeRotationX(Maths.toRadians(rotation.x)));
		transformation.multiply(new Matrix4().makeRotationY(Maths.toRadians(rotation.y)));
		transformation.multiply(new Matrix4().makeRotationZ(Maths.toRadians(rotation.z)));
		transformation.multiply(new Matrix4().makeScale(scale.x, scale.y, scale.z));
		return transformation;
	}
	
	static createProjectionMatrix(fov, near, far) {
		var aspectRatio = canvas.width / canvas.height;
		var y_scale = (1.0 / Math.tan(Maths.toRadians(fov / 2.0))) * aspectRatio;
		var x_scale = y_scale / aspectRatio;
		var frustum_length = far - near;
		var projection = new Matrix4(x_scale, 0.0, 0.0, 0.0, 0.0, y_scale, 0.0, 0.0, 0.0, 0.0, -((far + near) / frustum_length), -((2 * near * far) / frustum_length), 0.0, 0.0, -1.0, 0.0);
		return projection;
	}
	
	static createViewMatrix(position, rotation) {
		var view = new Matrix4().identity();
		var translation = new Vector3(position.x, position.y, position.z).negate();
		view.multiply(new Matrix4().makeRotationX(Maths.toRadians(rotation.x)));
		view.multiply(new Matrix4().makeRotationY(Maths.toRadians(rotation.y)));
		view.multiply(new Matrix4().makeRotationZ(Maths.toRadians(rotation.z)));
		view.multiply(new Matrix4().makeTranslation(translation.x, translation.y, translation.z));
		return view;
	}
	
	static randomInt(max) {
		return Math.floor(Math.random() * max);
	}
	
	static toRadians(value) {
		return value * (Math.PI / 180.0)
	}
	
	static toDegrees(value) {
		return value / (Math.PI / 180.0)
	}
}