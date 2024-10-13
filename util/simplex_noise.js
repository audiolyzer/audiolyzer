class SimplexNoise {

	static noise3D(position, seed, amplitude, octaves, frequencies) {
		let noise = 0;
		for(let i = 0; i < octaves; i++) {
			let freqx = frequencies.x * Math.pow(2, i);
			let freqy = frequencies.y * Math.pow(2, i);
			let freqz = frequencies.z * Math.pow(2, i);
			let amp = amplitude * Math.pow(0.5, i);
			let x = freqx * (position.x + seed / 1000);
			let y = freqy * (position.y + seed / 1000);
			let z = freqz * (position.z + seed / 1000);
			noise += this.noise(x, y, z) * amp;
		}
		return noise;
	}

	static fastfloor(x) {
		return Math.floor(x);
	}

	static dot(g, ...coords) {
		return coords.reduce((sum, coord, i) => sum + g[i] * coord, 0);
	}

	static noise(x, y, z) {
		const F3 = 1.0 / 3.0;
		const G3 = 1.0 / 6.0;

		let s = (x + y + z) * F3;
		let i = this.fastfloor(x + s);
		let j = this.fastfloor(y + s);
		let k = this.fastfloor(z + s);
		let t = (i + j + k) * G3;
		let X0 = i - t;
		let Y0 = j - t;
		let Z0 = k - t;
		let x0 = x - X0;
		let y0 = y - Y0;
		let z0 = z - Z0;

		let i1, j1, k1;
		let i2, j2, k2;

		if(x0 >= y0) {
			if(y0 >= z0) {
				i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
			} else if(x0 >= z0) {
				i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
			} else {
				i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
			}
		} else {
			if(y0 < z0) {
				i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
			} else if(x0 < z0) {
				i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
			} else {
				i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
			}
		}

		let x1 = x0 - i1 + G3;
		let y1 = y0 - j1 + G3;
		let z1 = z0 - k1 + G3;
		let x2 = x0 - i2 + 2.0 * G3;
		let y2 = y0 - j2 + 2.0 * G3;
		let z2 = z0 - k2 + 2.0 * G3;
		let x3 = x0 - 1.0 + 3.0 * G3;
		let y3 = y0 - 1.0 + 3.0 * G3;
		let z3 = z0 - 1.0 + 3.0 * G3;

		const grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

		const perm = SimplexNoise.getPerm();
		const permMod12 = SimplexNoise.getPermMod12();

		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;
		const gi0 = permMod12[ii + perm[jj + perm[kk]]] % 12;
		const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
		const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
		const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		let n0 = t0 < 0 ? 0 : Math.pow(t0, 4) * this.dot(grad3[gi0], x0, y0, z0);

		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		let n1 = t1 < 0 ? 0 : Math.pow(t1, 4) * this.dot(grad3[gi1], x1, y1, z1);

		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		let n2 = t2 < 0 ? 0 : Math.pow(t2, 4) * this.dot(grad3[gi2], x2, y2, z2);

		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		let n3 = t3 < 0 ? 0 : Math.pow(t3, 4) * this.dot(grad3[gi3], x3, y3, z3);

		return 32.0 * (n0 + n1 + n2 + n3);
	}

	static getPerm() {
		const perm = new Array(512);
		const p = new Uint8Array([-105, -96, -119, 91, 90, 15, -125, 13, -55, 95, 96, 53, -62, -23, 7, -31, -116, 36, 103, 30, 69, -114, 8, 99, 37, -16, 21, 10, 23, -66, 6, -108, -9, 120, -22, 75, 0, 26, -59, 62, 94, -4, -37, -53, 117, 35, 11, 32, 57, -79, 33, 88, -19, -107, 56, 87, -82, 20, 125, -120, -85, -88, 68, -81, 74, -91, 71, -122, -117, 48, 27, -90, 77, -110, -98, -25, 83, 111, -27, 122, 60, -45, -123, -26, -36, 105, 92, 41, 55, 46, -11, 40, -12, 102, -113, 54, 65, 25, 63, -95, 1, -40, 80, 73, -47, 76, -124, -69, -48, 89, 18, -87, -56, -60, -121, -126, 116, -68, -97, 86, -92, 100, 109, -58, -83, -70, 3, 64, 52, -39, -30, -6, 124, 123, 5, -54, 38, -109, 118, 126, -1, 82, 85, -44, -49, -50, 59, -29, 47, 16, 58, 17, -74, -67, 28, 42, -33, -73, -86, -43, 119, -8, -104, 2, 44, -102, -93, 70, -35, -103, 101, -101, -89, 43, -84, 9, -127, 22, 39, -3, 19, 98, 108, 110, 79, 113, -32, -24, -78, -71, 112, 104, -38, -10, 97, -28, -5, 34, -14, -63, -18, -46, -112, 12, -65, -77, -94, -15, 81, 51, -111, -21, -7, 14, -17, 107, 49, -64, -42, 31, -75, -57, 106, -99, -72, 84, -52, -80, 115, 121, 50, 45, 127, 4, -106, -2, -118, -20, -51, 93, -34, 114, 67, 29, 24, 72, -13, -115, -128, -61, 78, 66, -41, 61, -100, -76]);
		for(let i = 0; i < 512; i++) {
			perm[i] = p[i & 255];
		}
		return perm;
	}

	static getPermMod12() {
		const permMod12 = new Array(512);
		const perm = this.getPerm();
		for(let i = 0; i < 512; i++) {
			permMod12[i] = perm[i] % 12;
		}
		return permMod12;
	}
}