const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const backgroundMusic = new Audio("catsanddogs.wav");
let boxSize = window.innerWidth / 20;
let bucketSize = boxSize * 0.7;
let laserWidth = boxSize / 3;
let laserHeight = boxSize * 2;
let catWidth = boxSize;
let catHeight = boxSize * 0.8;
let dogWidth = catWidth;
let dogHeight = catHeight * 1.1;
let pianoWidth = catWidth;
let pianoHeight = catHeight;
let catSpeed = boxSize * 0.02;
let dogSpeed = boxSize * 0.03;
let pianoSpeed = boxSize * 0.065;
let laserSpeed = boxSize * 0.06;
let pelletSpeed = boxSize * 0.1;
let playerSpeed = boxSize * 0.06;
let rotationSpeed = 2;
let frameCount = 0;
let playerScore = 0;
let playerHealth = 3;
let coins = 1000;

//Power Ups
let itemCounts = {
	bowl: 0,
	bone: 0,
	beethoven: 0,
	defenses: 0,
	turrets: 0,
};

let level = 7;

let isPaused = false;
let isShopOpen = false;
let lasersDisabled = false;
let turretEnabled = false;

const scoreDisplay = document.getElementById("score-display");
const levelDisplay = document.getElementById("level-display");
const coinDisplay = document.getElementById("coin-display");
const startGameBtn = document.getElementById("start-game-btn");
const catImg = document.getElementById("cat-img");
const dogImg = document.getElementById("dog-img");
const pianoImg = document.getElementById("piano-img");
const laserImg = document.getElementById("laser-img");
const bucketImg = document.getElementById("bucket-img");
const coinImg = document.getElementById("coin-img");
const cloudImg = document.getElementById("cloud-img");
const cloudAltImg = document.getElementById("cloud-alt-img");
const jetPackCatImg = document.getElementById("jet-pack-cat-img");
const jetPackDogImg = document.getElementById("jet-pack-dog-img");
const backgroundImg = document.getElementById("background-img");
const healthBar = document.querySelectorAll("#health-bar img");
const shopBtn = document.getElementById("shop-btn");
const shopPanel = document.getElementById("shop-panel");
const shopCoinsDisplay = document.querySelector(".shop-coins-display");
const coinCounter = document.getElementById("player-coins");
const shopBtns = document.querySelectorAll(".buy-btn");
const bowlBtn = document.getElementById("bowl-btn");
const boneBtn = document.getElementById("bone-btn");
const beethovenBtn = document.getElementById("beethoven-btn");

const keys = {
	w: false,
	s: false,
	a: false,
	d: false,
};

const shopItems = {
	bowl: 10,
	bone: 20,
	beethoven: 30,
	defense: 40,
	turret: 50,
};

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

let entities = {
	players: [
		new Player(0, 0, boxSize * 1.5, boxSize / 1.1, playerSpeed, playerHealth),
	],
	buckets: [],
	cats: [],
	dogs: [],
	pianos: [],
	lasers: [],
	jetPackCats: [],
	jetPackDogs: [],
	pellets: [],
	enemyBullets: [],
};

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
					this.hoverDir = 1; // start by hovering down
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

function shootBullets() {
	for (const cat of entities.jetPackCats) {
		if (frameCount % 500 === 0 && cat.isHovering) {
			cat.shoot();
		}
	}
	for (const dog of entities.jetPackDogs) {
		if (frameCount % 300 === 0 && dog.isHovering) {
			dog.shoot();
		}
	}
}

document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "w") {
		keys.w = true;
	} else if (e.key.toLowerCase() === "s") {
		keys.s = true;
	} else if (e.key.toLowerCase() === "a") {
		keys.a = true;
	} else if (e.key.toLowerCase() === "d") {
		keys.d = true;
	}
});

document.addEventListener("keyup", (e) => {
	if (e.key.toLowerCase() === "w") {
		keys.w = false;
	} else if (e.key.toLowerCase() === "s") {
		keys.s = false;
	} else if (e.key.toLowerCase() === "a") {
		keys.a = false;
	} else if (e.key.toLowerCase() === "d") {
		keys.d = false;
	}
});

function gameLoop() {
	if (isPaused) return;
	frameCount++;
	updateBuckets();
	//Filter arrays for screen bounds
	entities.buckets = entities.buckets.filter((b) => b.timeLeft > 0);
	entities.cats = entities.cats.filter((c) => c.y <= ctx.canvas.height);
	entities.dogs = entities.dogs.filter((d) => d.y <= ctx.canvas.height);
	entities.pianos = entities.pianos.filter((p) => p.y <= ctx.canvas.height);
	entities.lasers = entities.lasers.filter((l) => l.y <= ctx.canvas.height);
	entities.pellets = entities.pellets.filter((p) => p.y >= 0);

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	drawBackground();
	if (frameCount) if (frameCount % 120 === 0) spawnBuckets();
	drawBuckets();
	if (frameCount % 200 === 0 && (level >= 5) & !lasersDisabled) spawnLasers();
	if (!lasersDisabled) drawLasers();
	if (frameCount % 450 === 0) spawnCats();
	updateCats();
	drawCats();
	if (frameCount % 1000 === 0 && level >= 7) spawnJetPackCats();
	drawJetPackCats();
	shootBullets();
	if (frameCount % 700 === 0) spawnDogs();
	updateDogs();
	drawDogs();
	if (frameCount % 1900 === 0 && level >= 9) spawnJetPackDogs();
	drawJetPackDogs();
	if (frameCount % 1300 === 0 && level >= 3) spawnPianos();
	drawPianos();
	if (keys.w) moveUp();
	if (keys.s) moveDown();
	if (keys.a) moveLeft();
	if (keys.d) moveRight();
	for (let i = 0; i < entities.buckets.length; i++) {
		if (entities.buckets[i].timeLeft === 0) entities.buckets.shift();
	}
	drawPlayer();
	drawPellets();
	handleCollisions();
	checkScore();
	checkHealth();
	updateCoins();
	disableLasers();
	window.requestAnimationFrame(gameLoop);
}

function initCanvas() {
	ctx.canvas.width = window.innerWidth / 1.5;
	ctx.canvas.height = (3 * window.innerWidth) / 5;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	boxSize = window.innerWidth / 20;
	entities.players[0].x = ctx.canvas.width / 2 - boxSize / 2;
	entities.players[0].y = ctx.canvas.height / 2 - boxSize / 2;
}

function drawBackground() {
	ctx.drawImage(backgroundImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawPlayer() {
	const p = entities.players[0];
	ctx.drawImage(cloudImg, p.x, p.y, p.width, p.height);
}

function drawPlayerAlt() {
	const p = entities.players[0];
	ctx.drawImage(cloudAltImg, p.x, p.y, p.width, p.height);
}

function spawnPellet() {
	entities.pellets.push(
		new Pellet(
			entities.players[0].x,
			entities.players[0].y,
			boxSize * 0.1,
			boxSize * 0.4
		)
	);
}

function drawPellets() {
	for (const pellet of entities.pellets) {
		pellet.draw(ctx);
		pellet.y -= pelletSpeed;
	}
}

function spawnBuckets() {
	const padding = bucketSize;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	const randomY = Math.random() * (ctx.canvas.height - padding * 2) + padding;

	entities.buckets.push(
		new Bucket(randomX, randomY, bucketSize, bucketSize, 800)
	);
}

function updateBuckets() {
	for (const bucket of entities.buckets) {
		bucket.update();
	}
}

function drawBuckets() {
	for (const bucket of entities.buckets) {
		bucket.draw(ctx);
	}
}

function spawnLasers() {
	const padding = laserWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	entities.lasers.push(new Laser(randomX, 0, laserWidth, laserHeight));
	const laserAudio = new Audio("laser.wav");
	laserAudio.play();
}

function drawLasers() {
	for (const laser of entities.lasers) {
		laser.draw(ctx);
		laser.y += laserSpeed;
	}
}

function spawnCats() {
	const padding = catWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	let rotationSpeed = Math.random() < 0.5 ? 0.05 : -0.05;
	entities.cats.push(
		new Cat(randomX, 0, catWidth, catHeight, 0, rotationSpeed)
	);
	const catAudio = new Audio("meow.wav");
	catAudio.play();
}

function updateCats() {
	for (const cat of entities.cats) {
		cat.update();
	}
}

function drawCats() {
	for (const cat of entities.cats) {
		cat.draw(ctx);
	}
}

function spawnJetPackCats() {
	const padding = catWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	const targetY = (Math.random() * ctx.canvas.height) / 2;
	entities.jetPackCats.push(
		new JetPackCat(randomX, 0, dogWidth, dogHeight, targetY, false, 1)
	);
	const catAudio = new Audio("meow.wav");
	catAudio.play();
}

function drawJetPackCats() {
	for (const cat of entities.jetPackCats) {
		cat.update();
		cat.draw(ctx);
	}
}

function spawnDogs() {
	const padding = dogWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	let rotationSpeed = Math.random() < 0.5 ? 0.01 : -0.01;
	entities.dogs.push(
		new Dog(randomX, 0, dogWidth, dogHeight, 0, rotationSpeed)
	);
	const dogAudio = new Audio("bark.mp3");
	dogAudio.play();
}

function updateDogs() {
	for (const dog of entities.dogs) {
		dog.update();
	}
}

function drawDogs() {
	for (const dog of entities.dogs) {
		dog.draw(ctx);
	}
}

function spawnJetPackDogs() {
	const padding = dogWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	const minY = ctx.canvas.height / 2;
	const maxY = ctx.canvas.height - dogHeight;
	const targetY = Math.random() * (maxY - minY) + minY;

	entities.jetPackDogs.push(
		new JetPackDog(
			randomX,
			ctx.canvas.height,
			dogWidth,
			dogHeight,
			targetY,
			false,
			1
		)
	);
	const dogAudio = new Audio("bark.mp3");
	dogAudio.play();
}

function drawJetPackDogs() {
	for (const dog of entities.jetPackDogs) {
		dog.update();
		dog.draw(ctx);
	}
}

function spawnPianos() {
	const padding = pianoWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	entities.pianos.push(new Piano(randomX, 0, pianoWidth, pianoHeight));
	const pianoAudio = new Audio("piano.wav");
	pianoAudio.play();
}

function drawPianos() {
	for (const piano of entities.pianos) {
		piano.draw(ctx);
		piano.y += pianoSpeed;
	}
}

const moveUp = () => {
	const p = entities.players[0];
	if (p.y <= p.height * 0.1) {
		p.y = 0;
		return;
	}
	p.y -= p.speed;
};

const moveDown = () => {
	const p = entities.players[0];
	if (p.y >= ctx.canvas.height - p.height) {
		p.y = ctx.canvas.height - p.height;
		return;
	}
	p.y += p.speed;
};

const moveLeft = () => {
	const p = entities.players[0];
	p.x -= p.speed;
	if (p.x + p.width < 0) {
		p.x = ctx.canvas.width;
	}
};

const moveRight = () => {
	const p = entities.players[0];
	p.x += p.speed;
	if (p.x > ctx.canvas.width) {
		p.x = -p.width;
	}
};

function hideHeart() {
	const p = entities.players[0];
	if (p.health > 0) {
		p.health--;
	}

	if (healthBar[p.health]) {
		healthBar[p.health].style.display = "none";
	}
}

function checkScore() {
	if (playerScore >= 10) {
		playerScore = 0;
		level++;
		initCanvas();
		frameCount = 0;
		entities.pellets = [];
		entities.buckets = [];
		entities.cats = [];
		entities.dogs = [];
		entities.pianos = [];
		entities.lasers = [];
		entities.jetPackCats = [];
		entities.jetPackDogs = [];
		laserSpeed += boxSize * 0.005;
		catSpeed += boxSize * 0.005;
		dogSpeed += boxSize * 0.005;
		pianoSpeed += boxSize * 0.005;
		startGameBtn.style.display = "block";
		startGameBtn.innerText = "NEXT LEVEL";
		window.cancelAnimationFrame();
	}
}

function checkHealth() {
	if (entities.players[0].health <= 0) gameOver();
}

function updateCoins() {
	coinCounter.innerText = coins;
}

function gameOver() {
	backgroundMusic.pause();
	backgroundMusic.currentTime = 0;
	initCanvas();
	frameCount = 0;
	entities.players[0].health = 3;
	coins = 0;
	coinDisplay.innerText = `Coins: ${coins}`;
	level = 1;
	for (let i = 0; i < healthBar.length; i++) {
		healthBar[i].style.display = "flex";
	}
	hideAllPowerUps();
	startGameBtn.style.display = "block";
	startGameBtn.innerText = "PLAY AGAIN";
	entities.pellets = [];
	entities.buckets = [];
	entities.cats = [];
	entities.dogs = [];
	entities.pianos = [];
	entities.lasers = [];
	entities.jetPackCats = [];
	entities.jetPackDogs = [];
	turretEnabled = false;
	cloudImg.src = "cloud.png";
	entities.players[0].height = boxSize / 1.1;
	window.cancelAnimationFrame();
}

startGameBtn.addEventListener("click", () => {
	if (startGameBtn.innerText !== "START") {
		levelDisplay.innerText = `Level ${level}`;
	}
	backgroundMusic.loop = true;
	backgroundMusic.play();
	startGameBtn.style.display = "none";
	playerScore = 0;
	scoreDisplay.innerText = `Buckets: ${playerScore}`;
	initCanvas();
	window.requestAnimationFrame(gameLoop);
});

function shopHandler() {
	if (!isShopOpen) {
		isPaused = true;
		isShopOpen = true;
		shopBtn.innerText = "close";
		shopPanel.style.display = "flex";
	} else {
		window.requestAnimationFrame(gameLoop);
		isPaused = false;
		isShopOpen = false;
		shopBtn.innerText = "shop (p)";
		shopPanel.style.display = "none";
	}
}

function buyItem(item) {
	if (coins >= shopItems[item]) {
		if (itemCounts[item] >= 3) {
			return;
		}
		itemCounts[item]++;
		coins -= shopItems[item];
		coinDisplay.innerText = `Coins: ${coins}`;
		coinCounter.innerText = coins;
		if (item !== "turret") {
			showPowerUp(item);
		} else {
			enableTurret();
		}
	} else {
		shopCoinsDisplay.style.color = "red";
		setTimeout(() => {
			shopCoinsDisplay.style.color = "white";
		}, 1000);
	}
}

function showPowerUp(item) {
	const powerUpImgs = document.querySelectorAll(`.power-up-img.${item}`);
	for (let i = 0; i < powerUpImgs.length; i++) {
		if (powerUpImgs[i].style.display === "none") {
			powerUpImgs[i].style.display = "flex";
			break;
		}
	}
}

function hidePowerUp(item, imgToHide = null) {
	const powerUpImgs = document.querySelectorAll(`.power-up-img.${item}`);
	for (let i = 0; i < powerUpImgs.length; i++) {
		if (
			getComputedStyle(powerUpImgs[i]).display !== "none" &&
			(imgToHide === null || powerUpImgs[i] === imgToHide)
		) {
			powerUpImgs[i].style.display = "none";
			break;
		}
	}
}

function hideAllPowerUps() {
	const powerUpImgs = document.querySelectorAll(`.power-up-img`);
	powerUpImgs.forEach((img) => {
		if (getComputedStyle(img) !== "none") {
			img.style.display = "none";
		}
	});
}

function disableLasers() {
	const defenseImgs = document.querySelectorAll(".power-up-img.defense");
	defenseImgs.forEach((img) => {
		img.addEventListener("click", () => {
			if (lasersDisabled) return;
			itemCounts.defenses--;
			img.src = "defenseactive.png";
			lasersDisabled = true;
			setTimeout(() => {
				img.src = "defense.png";
				entities.lasers = [];
				lasersDisabled = false;
				hidePowerUp("defense", img);
			}, 15000);
		});
	});
}

function enableTurret() {
	turretEnabled = true;
	cloudImg.src = "cloudturret.png";
	entities.players[0].height = boxSize * 1.2;
}

shopBtn.addEventListener("click", () => {
	shopHandler();
});

const itemKeys = Object.keys(shopItems);
for (let i = 0; i < shopBtns.length; i++) {
	shopBtns[i].addEventListener("click", () => {
		buyItem(`${itemKeys[i]}`);
	});
}

document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "p") shopHandler();
});

document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "m" && turretEnabled) spawnPellet();
});

window.addEventListener("resize", () => {
	initCanvas();
	boxSize = window.innerWidth / 20;
});
