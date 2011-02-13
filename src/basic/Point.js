var Point = Base.extend({
	beans: true,
	initialize: function() {
		if(arguments.length == 2) {
			this.x = arguments[0];
			this.y = arguments[1];
		} else if(arguments.length == 1) {
			var first = arguments[0];
			if(first == null) {
				this.x = this.y = 0;
			} else if(first.x !== undefined) {
				this.x = first.x;
				this.y = first.y;
			} else if(first.width !== undefined) {
				this.x = first.width;
				this.y = first.height;
			} else if(first.length !== undefined) {
				this.x = first[0];
				this.y = first.length > 1 ? first[1] : first[0];
			} else if(typeof first === 'number') {
				this.x = this.y = first;
			} else {
				this.x = this.y = 0;
			}
		} else {
			this.x = this.y = 0;	
		}
	},

	clone: function() {
		return new Point(this.x, this.y);
	},

	add: function() {
		var point = Point.read(arguments);
		return new Point(this.x + point.x, this.y + point.y);
	},

	subtract: function() {
		var point = Point.read(arguments);
		return new Point(this.x - point.x, this.y - point.y);
	},

	multiply: function() {
		var point = Point.read(arguments);
		return new Point(this.x * point.x, this.y * point.y);
	},

	divide: function() {
		var point = Point.read(arguments);
		return new Point(this.x / point.x, this.y / point.y);
	},

	modulo: function() {
		var point = Point.read(arguments);
		return new Point(this.x % point.x, this.y % point.y);
	},

	negate: function() {
		return new Point(-this.x, -this.y);
	},

	equals: function() {
		var point = Point.read(arguments);
		return this.x == point.x && this.y == point.y;
	},

	getDistance: function() {
		var point = Point.read(arguments);
		var px = point.x - this.x;
		var py = point.y - this.y;
		return Math.sqrt(px * px + py * py);
	},

	getDistanceSquared: function() {
		var point = Point.read(arguments);
		var px = point.x - this.x;
		var py = point.y - this.y;
		return px * px + py * py;
	},

	getLength: function() {
		var point = Point.read(arguments);
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	setLength: function(length) {
		if (this.isZero()) {
			if (this._angle != null) {
				var a = this._angle;
				this.x = Math.cos(a) * length;
				this.y = Math.sin(a) * length;
			} else {
				// Assume angle = 0
				this.x = length;
				// y is already 0
			}
		} else {
			var scale = length / this.length;
			if (scale == 0.0) {
				// Calculate angle now, so it will be preserved even when
				// x and y are 0
				this.getAngle();
			}
			this.x *= scale;
			this.y *= scale;
		}
	},
	
	normalize: function(length) {
		if (length === null)
			length = 1;
		var len = this.length;
		var scale = len != 0 ? length / len : 0;
		var res = new Point(this.x * scale, this.y * scale);
		// Preserve angle.
		res._angle = this._angle;
		return res;
	},
	
	getAngleInRadians: function() {
		return Math.atan2(this.y, this.x);
	},
	
	getAngleInDegrees: function() {
		return Math.atan2(this.y, this.x) * 180 / Math.PI;
	},
	
	
	getQuadrant: function() {
		if (this.x >= 0) {
			if (this.y >= 0) {
				return 1;
			} else {
				return 4;
			}
		} else {
			if (this.y >= 0) {
				return 2;
			} else {
				return 3;
			}
		}
	},
	
	setAngle: function(angle) {
		angle = this._angle = angle * Math.PI / 180;
		if(!this.isZero()) {
			var length = this.length;
			this.x = Math.cos(angle) * length;
			this.y = Math.sin(angle) * length;
		}
	},

	getAngle: function() {
		var angle;
		if(arguments.length) {
			var point = Point.read(arguments);
			var div = this.length * point.length;
			if(div == 0) {
				return NaN;
			} else {
				angle = Math.acos(this.dot(point) / div);
			}
		} else {
			if (this._angle == null)
				this._angle = Math.atan2(this.y, this.x);
			angle = this._angle;
		}
		return angle * 180 / Math.PI;
	},

	getDirectedAngle: function() {
		var point = Point.read(arguments);
		var angle = this.angle - point.angle;
		var bounds = 180;
		if(angle < - bounds) {
			return angle + bounds * 2;
		} else if (angle > bounds) {
			return angle - bounds * 2;
		} else {
			return angle;
		}
	},
	
	rotate: function(angle) {
		angle = angle * Math.PI / 180;
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		return new Point(
			this.x * c - this.y * s,
			this.y * c + this.x * s
		);
	},

	rotateAround: function(angle, center) {
		center = new Point(center);
		return this.subtract(center).rotate(angle).add(this);
	},

	interpolate: function(point, t) {
		return new Point(
			this.x * (1 - t) + point.x * t,
			this.y * (1 - t) + point.y * t
		);
	},

	// Need to adapt Rectangle.java first
	// isInside: function(rect) {
	// 	return rect.contains(this);
	// },

	isClose: function(point, tolerance) {
		point = new Point(point);
		return this.getDistance(point) < tolerance;
	},

	isParallel: function(point) {
		return Math.abs(this.x / point.x - this.y / point.y) < 0.00001;
	},

	isZero: function() {
		return this.x == 0 && this.y == 0;
	},

	isNaN: function() {
		return isNaN(this.x) || isNaN(this.y);
	},

	round: function() {
		return new Point(Math.round(this.x), Math.round(this.y));
	},

	ceil: function() {
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	},

	floor: function() {
		return new Point(Math.floor(this.x), Math.floor(this.y));
	},

	abs: function() {
		return new Point(Math.abs(this.x), Math.abs(this.y));
	},

	dot: function() {
		var point = Point.read(arguments);
		return this.x * point.x + this.y * point.y;
	},

	cross: function() {
		var point = Point.read(arguments);
		return this.x * point.y - this.y - point.x;
	},

	project: function() {
		var point = Point.read(arguments);
		if(point.isZero()) {
			return new Point(0, 0);
		} else {
			var scale = this.dot(point) / point.dot(point);
			return new Point(
				point.x * scale,
				point.y * scale
			);
		}
	},

	toString: function() {
		return '{ x: ' + this.x + ', y: ' + this.y + ' }';
	},

	statics: {
		read: function(args) {
			if (args.length == 1 && args[0] instanceof Point) {
				return args[0];
			} else if (args.length) {
				var point = new Point();
				point.initialize.apply(point, args);
				return point;
			}
		},

		min: function(point1, point2) {
			return new Point(
				Math.min(point1.x, point2.x),
				Math.min(point1.y, point2.y));
		},

		max: function(point1, point2) {
			return new Point(
				Math.max(point1.x, point2.x),
				Math.max(point1.y, point2.y));
		},

		random: function() {
			return new Point(Math.random(), Math.random());
		}
	}
});
