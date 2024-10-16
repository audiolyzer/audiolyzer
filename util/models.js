let models = new Map();

class Models {
	
	static loadModels() {
		loadJSONResource('assets/models/chicken.json', function(data) {
			var vertices = data.meshes[0].vertices;
			var normals = data.meshes[0].normals;
			var uvs = data.meshes[0].texturecoords[0];
			var indices = [].concat.apply([], data.meshes[0].faces);
			models.set("chicken", Model.createEntityModel(vertices, normals, uvs, indices, 'texture_chicken'));
		});
	}
}