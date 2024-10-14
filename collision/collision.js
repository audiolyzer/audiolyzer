class Collision {

	static detectCollision(capsuleStart, capsuleEnd, capsuleRadius, vertices, indices) {
		let penetrationVector = null;

		for(let i = 0; i < indices.length; i += 3) {
			const v0 = this.getVertex(vertices, indices[i]);
			const v1 = this.getVertex(vertices, indices[i + 1]);
			const v2 = this.getVertex(vertices, indices[i + 2]);

			const closestPoint = this.closestPointOnTriangle(capsuleStart, capsuleEnd, v0, v1, v2);
			const distanceToClosestPoint = closestPoint.distanceTo(capsuleStart);

			if(distanceToClosestPoint < capsuleRadius) {
				const penetration = new Vector3().subVectors(capsuleStart, closestPoint);
				const penetrationDepth = capsuleRadius - distanceToClosestPoint;

				if(penetration.length() > 0) {
					penetration.normalize().multiplyScalar(penetrationDepth);
				}

				if(penetrationVector === null) {
					penetrationVector = penetration.clone();
				} else {
					penetrationVector.add(penetration);
				}
			}
		}

		return penetrationVector;
	}

	static getVertex(vertices, index) {
		return new Vector3(
				vertices[index * 3],
				vertices[index * 3 + 1],
				vertices[index * 3 + 2]
		);
	}

	static closestPointOnTriangle(capsuleStart, capsuleEnd, a, b, c) {
		const ab = new Vector3().subVectors(b, a);
		const ac = new Vector3().subVectors(c, a);
		const ap = new Vector3().subVectors(capsuleStart, a);
		const bp = new Vector3().subVectors(capsuleStart, b);
		const cp = new Vector3().subVectors(capsuleStart, c);

		const d1 = ab.dot(ap);
		const d2 = ac.dot(ap);
		if(d1 <= 0 && d2 <= 0) return a.clone();

		const d3 = ab.dot(bp);
		const d4 = ac.dot(bp);
		if(d3 >= 0 && d4 <= d3) return b.clone();

		const d5 = ab.dot(cp);
		const d6 = ac.dot(cp);
		if(d6 >= 0 && d5 <= d6) return c.clone();

		const denom = (d6 - d5) * (d2 - d4) - (d1 - d3) * (d6 - d5);
		const v = ((d6 - d5) * (d1 - d3) - (d2 - d4) * (d1 - d3)) / denom;
		const w = ((d2 - d4) * (d1 - d3) - (d1 - d3) * (d6 - d5)) / denom;

		return new Vector3().addVectors(
				a.clone().add(ab.multiplyScalar(v)),
				ac.multiplyScalar(w)
		);
	}
}