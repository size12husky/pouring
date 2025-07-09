class Player {
	constructor(x, y, width, height, speed, health) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.health = health;
	}
}

class Bucket {
	constructor(x, y, width, height, timeLeft, isCoin) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.timeLeft = timeLeft;
		this.isCoin = isCoin;
	}

	update() {
		this.timeLeft--;
	}

	draw(ctx) {
		const blinking =
			(this.timeLeft < 300 && this.timeLeft > 250) ||
			(this.timeLeft < 200 && this.timeLeft > 150) ||
			(this.timeLeft < 100 && this.timeLeft > 50);

		if (this.isCoin) {
			if (blinking) {
				ctx.drawImage(coinImg, this.x, this.y, this.width, this.height);
			}
		} else {
			if (blinking) {
				ctx.drawImage(coinImg, this.x, this.y, this.width, this.height);
			} else {
				ctx.drawImage(bucketImg, this.x, this.y, this.width, this.height);
			}
		}
	}
}

class Pellet {
	constructor(x, y, width, height) {
		this.x = x + boxSize * 0.7;
		this.y = y - boxSize * 0.2;
		this.width = width;
		this.height = height;
	}

	draw(ctx) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Cat {
	constructor(x, y, width, height, rotation, rotationSpeed) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.rotationSpeed = rotationSpeed;
	}

	update() {
		this.rotation += this.rotationSpeed;
		this.y += catSpeed;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(
			catImg,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
	}
}

class Dog {
	constructor(x, y, width, height, rotation, rotationSpeed) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.rotationSpeed = rotationSpeed;
	}

	update() {
		this.rotation += this.rotationSpeed;
		this.y += dogSpeed;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(
			dogImg,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
	}
}

class Piano {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw(ctx) {
		ctx.drawImage(pianoImg, this.x, this.y, this.width, this.height);
	}
}

class Laser {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	update() {}

	draw(ctx) {
		ctx.drawImage(laserImg, this.x, this.y, this.width, this.height);
	}
}

class JetPackCat {
	constructor(x, y, width, height, targetY, isHovering, hoverDir) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.targetY = targetY;
		this.isHovering = isHovering;
		this.hoverDir = hoverDir;

		this.bullets = [];
	}

	shoot() {
		const bullet = {
			x: this.x + this.width / 2,
			y: this.y + this.height,
			width: 5,
			height: 10,
			speed: 2,
		};
		entities.enemyBullets.push(bullet);
	}

	update() {
		const topHoverY = this.targetY - ctx.canvas.height / 40;
		const bottomHoverY = this.targetY + ctx.canvas.height / 40;

		if (!this.isHovering) {
			if (this.y < this.targetY) {
				this.y += catSpeed / 2;
				if (this.y >= this.targetY) {
					this.y = this.targetY;
					this.isHovering = true;
					this.hoverDir = 1;
				}
			}
		} else {
			this.bullets.forEach((b) => (b.y += b.speed));
			this.bullets = this.bullets.filter((b) => b.y <= ctx.canvas.height);
			this.y += (catSpeed / 3) * this.hoverDir;

			if (this.y >= bottomHoverY) {
				this.y = bottomHoverY;
				this.hoverDir = -1;
			}
			if (this.y <= topHoverY) {
				this.y = topHoverY;
				this.hoverDir = 1;
			}
		}
	}

	draw(ctx) {
		ctx.drawImage(jetPackCatImg, this.x, this.y, this.width, this.height);
		if (!this.isHovering) return;
		for (const bullet of entities.enemyBullets) {
			bullet.y += bullet.speed;
			ctx.fillStyle = "red";
			ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
		}
	}
}

class JetPackDog {
	constructor(x, y, width, height, targetY, isHovering, hoverDir) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.targetY = targetY;
		this.isHovering = isHovering;
		this.hoverDir = hoverDir;

		this.bullets = [];
	}

	shoot() {
		const bullet = {
			x: this.x + this.width / 2,
			y: this.y + this.height,
			width: 5,
			height: 10,
			speed: 2,
		};
		entities.enemyBullets.push(bullet);
	}

	update() {
		const topHoverY = this.targetY - ctx.canvas.height / 40;
		const bottomHoverY = this.targetY + ctx.canvas.height / 40;

		if (!this.isHovering) {
			if (this.y > this.targetY) {
				this.y -= dogSpeed / 2;
				if (this.y <= this.targetY) {
					this.y = this.targetY;
					this.isHovering = true;
					this.hoverDir = 1;
				}
			}
		} else {
			this.bullets.forEach((b) => (b.y -= b.speed));
			this.y += (dogSpeed / 3) * this.hoverDir;

			if (this.y >= bottomHoverY) {
				this.y = bottomHoverY;
				this.hoverDir = -1;
			}
			if (this.y <= topHoverY) {
				this.y = topHoverY;
				this.hoverDir = 1;
			}
		}
	}

	draw(ctx) {
		ctx.drawImage(jetPackDogImg, this.x, this.y, this.width, this.height);
		if (!this.isHovering) return;
		for (const bullet of entities.enemyBullets) {
			bullet.y -= bullet.speed;
			ctx.fillStyle = "red";
			ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
		}
	}
}