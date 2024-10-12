class Maths {
	
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
	
	static createViewMatrix() {
		var view = new Matrix4().identity();
		var translation = new Vector3(spectator.position.x, spectator.position.y, spectator.position.z).negate();
		view.multiply(new Matrix4().makeRotationX(Maths.toRadians(spectator.rotation.x)));
		view.multiply(new Matrix4().makeRotationY(Maths.toRadians(spectator.rotation.y)));
		view.multiply(new Matrix4().makeRotationZ(Maths.toRadians(spectator.rotation.z)));
		view.multiply(new Matrix4().makeTranslation(translation.x, translation.y, translation.z));
		return view;
	}
	
	static createSpaceViewMatrix(rotation) {
		var view = new Matrix4().identity();
		view.multiply(new Matrix4().makeRotationX(Maths.toRadians(spectator.rotation.x)));
		view.multiply(new Matrix4().makeRotationY(Maths.toRadians(spectator.rotation.y+rotation)));
		view.multiply(new Matrix4().makeRotationZ(Maths.toRadians(spectator.rotation.z+30.0)));
		return view;
	}
	
	static toRadians(value) {
		return value * (Math.PI / 180.0)
	}
	
	static toDegrees(value) {
		return value / (Math.PI / 180.0)
	}
}