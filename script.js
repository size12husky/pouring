const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const backgroundMusic = new Audio("catsanddogs.wav");
let boxSize = window.innerWidth / 20;
let playerWidth = boxSize * 1.5;
let playerHeight = boxSize / 1.2;
let bucketSize = boxSize * 0.7;
let laserWidth = boxSize / 3;
let laserHeight = boxSize * 2;
let catWidth = boxSize;
let catHeight = boxSize * 0.8;
let dogWidth = catWidth;
let dogHeight = catHeight;
let pianoWidth = catWidth;
let pianoHeight = catHeight;
let catSpeed = 0.5;
let dogSpeed = 0.7;
let pianoSpeed = 1.4;
let laserSpeed = 1.5;
let playerX = 0;
let playerY = 0;

let speed = 2;
let rotationSpeed = 2;
let frameCount = 0;
let playerScore = 0;
let playerHealth = 3;
let coins = 1000;
let buckets = [];
let lasers = [];
let cats = [];
let dogs = [];
let pianos = [];

//Power Ups
let itemCounts = {
	bowl: 0,
	bone: 0,
	beethoven: 0,
	defenses: 0
};

let level = 1;

let isPaused = false;
let isShopOpen = false;

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
	bowl: 15,
	bone: 25,
	beethoven: 35,
	defense: 50
};

class Laser {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	update() {}

	draw(ctx) {
		ctx.drawImage(laserImg, this.x, this.y, laserWidth, laserHeight);
	}
}

class Cat {
	constructor(x, y, rotation, rotationSpeed) {
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.rotationSpeed = rotationSpeed;
	}

	update() {
		this.rotation += this.rotationSpeed;
		this.y += catSpeed;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x + catWidth / 2, this.y + catHeight / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(catImg, -catWidth / 2, -catHeight / 2, catWidth, catHeight);
		ctx.restore();
	}
}

class Dog {
	constructor(x, y, rotation, rotationSpeed) {
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.rotationSpeed = rotationSpeed;
	}

	update() {
		this.rotation += this.rotationSpeed;
		this.y += dogSpeed;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x + dogWidth / 2, this.y + dogHeight / 2);
		ctx.rotate(this.rotation);
		ctx.drawImage(dogImg, -dogWidth / 2, -dogHeight / 2, dogWidth, dogHeight);
		ctx.restore();
	}
}

class Piano {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		ctx.drawImage(pianoImg, this.x, this.y, pianoWidth, pianoHeight);
	}
}

class Bucket {
	constructor(x, y, timeLeft) {
		this.x = x;
		this.y = y;
		this.timeLeft = timeLeft;
	}

	update() {
		this.timeLeft--;
	}

	draw(ctx) {
		if (
			(this.timeLeft < 300 && this.timeLeft > 250) ||
			(this.timeLeft < 200 && this.timeLeft > 150) ||
			(this.timeLeft < 100 && this.timeLeft > 50)
		) {
			ctx.drawImage(coinImg, this.x, this.y, bucketSize, bucketSize);
		} else {
			ctx.drawImage(bucketImg, this.x, this.y, bucketSize, bucketSize);
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
	updateEnemies();
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	drawBackground();
	if (frameCount) if (frameCount % 120 === 0) spawnEnemies();
	drawEnemies();
	if (frameCount % 200 === 0 && level >= 5) spawnLasers();
	drawLasers();
	if (frameCount % 450 === 0) spawnCats();
	updateCats();
	drawCats();
	if (frameCount % 700 === 0) spawnDogs();
	updateDogs();
	drawDogs();
	if (frameCount % 1300 === 0 && level >= 3) spawnPianos();
	drawPianos();
	if (keys.w) moveUp();
	if (keys.s) moveDown();
	if (keys.a) moveLeft();
	if (keys.d) moveRight();
	for (let i = 0; i < buckets.length; i++) {
		if (buckets[i].timeLeft === 0) buckets.shift();
	}
	drawPlayer();
	boxCollision();
	laserCollision();
	catCollision();
	dogCollision();
	pianoCollision();
	checkScore();
	checkHealth();
	updateCoins();
	window.requestAnimationFrame(gameLoop);
}

function initCanvas() {
	ctx.canvas.width = window.innerWidth / 1.5;
	ctx.canvas.height = (3 * window.innerWidth) / 5;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	boxSize = window.innerWidth / 20;
	playerX = ctx.canvas.width / 2 - boxSize / 2;
	playerY = ctx.canvas.height / 2 - boxSize / 2;
}

function drawBackground() {
	ctx.drawImage(backgroundImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawPlayer() {
	ctx.drawImage(cloudImg, playerX, playerY, playerWidth, playerHeight);
}

function drawPlayerAlt() {
	ctx.drawImage(cloudAltImg, playerX, playerY, playerWidth, playerHeight);
}

function spawnEnemies() {
	const padding = bucketSize;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	const randomY = Math.random() * (ctx.canvas.height - padding * 2) + padding;

	buckets.push(new Bucket(randomX, randomY, 800));
}

function updateEnemies() {
	for (const bucket of buckets) {
		bucket.update();
	}
}

function drawEnemies() {
	for (const bucket of buckets) {
		bucket.draw(ctx);
	}
}

function spawnLasers() {
	const randomX = Math.random() * ctx.canvas.width;
	lasers.push(new Laser(randomX, 0));
	const laserAudio = new Audio("laser.wav");
	laserAudio.play();
}

function drawLasers() {
	for (const laser of lasers) {
		laser.draw(ctx);
		laser.y += laserSpeed;
	}
}

function spawnCats() {
	const padding = catWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	let rotationSpeed = Math.random() < 0.5 ? 0.05 : -0.05;
	cats.push(new Cat(randomX, 0, 0, rotationSpeed));
	const catAudio = new Audio("meow.wav");
	catAudio.play();
}

function updateCats() {
	for (const cat of cats) {
		cat.update();
	}
}

function drawCats() {
	for (const cat of cats) {
		cat.draw(ctx);
	}
}

function spawnDogs() {
	const padding = dogWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	let rotationSpeed = Math.random() < 0.5 ? 0.01 : -0.01;
	dogs.push(new Dog(randomX, 0, 0, rotationSpeed));
	const dogAudio = new Audio("bark.mp3");
	dogAudio.play();
}

function updateDogs() {
	for (const dog of dogs) {
		dog.update();
	}
}

function drawDogs() {
	for (const dog of dogs) {
		dog.draw(ctx);
	}
}

function spawnPianos() {
	const padding = pianoWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	pianos.push(new Piano(randomX, 0));
	const pianoAudio = new Audio("piano.wav");
	pianoAudio.play();
}

function drawPianos() {
	for (const piano of pianos) {
		piano.draw(ctx);
		piano.y += pianoSpeed;
	}
}

const moveUp = () => {
	if (playerY <= playerHeight * 0.1) {
		playerY = 0;
		return;
	}
	playerY -= speed;
};

const moveDown = () => {
	if (playerY >= ctx.canvas.height - playerHeight) {
		playerY = ctx.canvas.height - playerHeight;
		return;
	}
	playerY += speed;
};

const moveLeft = () => {
	playerX -= speed;
	if (playerX + playerWidth < 0) {
		playerX = ctx.canvas.width;
	}
};

const moveRight = () => {
	playerX += speed;
	if (playerX > ctx.canvas.width) {
		playerX = -playerWidth;
	}
};

function boxCollision() {
	let isBonus = false;
	for (let i = 0; i < buckets.length; i++) {
		const e = buckets[i];
		if (
			playerX < e.x + bucketSize &&
			playerX + playerWidth > e.x &&
			playerY < e.y + bucketSize &&
			playerY + playerHeight > e.y
		) {
			if (buckets[i].timeLeft < 300) {
				new Audio("coin.mp3").play();
				isBonus = true;
				coins++;
				coinDisplay.innerText = `Coins: ${coins}`;
				buckets.splice(i, 1);
				playerScore++;
				scoreDisplay.innerText = `Buckets: ${playerScore}`;
				return true;
			} else {
				new Audio("water.wav").play();
			}

			buckets.splice(i, 1);
			playerScore++;
			scoreDisplay.innerText = `Buckets: ${playerScore}`;
			return true;
		}
	}
	return false;
}

function laserCollision() {
	for (let i = 0; i < lasers.length; i++) {
		const l = lasers[i];
		if (
			playerX < l.x + laserWidth &&
			playerX + boxSize > l.x &&
			playerY < l.y + laserHeight &&
			playerY + boxSize > l.y
		) {
			const hitAudio = new Audio("woosh.wav");
			hitAudio.play();
			hideHeart();
			lasers.splice(i, 1);
			return true;
		}
	}
	return false;
}
function catCollision() {
	for (let i = 0; i < cats.length; i++) {
		const l = cats[i];
		if (
			playerX < l.x + catWidth &&
			playerX + boxSize > l.x &&
			playerY < l.y + catHeight &&
			playerY + boxSize > l.y
		) {
			if (itemCounts.bowl > 0) {
				hidePowerUp("bowl");
				itemCounts.bowl--;
				cats.splice(i, 1);
				return true;
			}
			const hitAudio = new Audio("woosh.wav");
			hitAudio.play();
			hideHeart();
			cats.splice(i, 1);
			return true;
		}
	}
	return false;
}

function dogCollision() {
	for (let i = 0; i < dogs.length; i++) {
		const l = dogs[i];
		if (
			playerX < l.x + dogWidth &&
			playerX + boxSize > l.x &&
			playerY < l.y + dogHeight &&
			playerY + boxSize > l.y
		) {
			if (itemCounts.bone) {
				hidePowerUp("bone");
				itemCounts.bone--;
				dogs.splice(i, 1);
				return true;
			}
			const hitAudio = new Audio("woosh.wav");
			hitAudio.play();
			hideHeart();
			dogs.splice(i, 1);
			return true;
		}
	}
	return false;
}

function pianoCollision() {
	for (let i = 0; i < pianos.length; i++) {
		const l = pianos[i];
		if (
			playerX < l.x + pianoWidth &&
			playerX + boxSize > l.x &&
			playerY < l.y + pianoHeight &&
			playerY + boxSize > l.y
		) {
			if (itemCounts.beethoven) {
				hidePowerUp("beethoven");
				itemCounts.beethoven--;
				pianos.splice(i, 1);
				return true;
			}
			const hitAudio = new Audio("woosh.wav");
			hitAudio.play();
			hideHeart();
			pianos.splice(i, 1);
			return true;
		}
	}
	return false;
}

function hideHeart() {
	if (playerHealth > 0) {
		playerHealth--;
	}

	if (healthBar[playerHealth]) {
		healthBar[playerHealth].style.display = "none";
	}
}

function checkScore() {
	if (playerScore >= 20) {
		playerScore = 0;
		level++;
		initCanvas();
		frameCount = 0;
		buckets = [];
		lasers = [];
		cats = [];
		dogs = [];
		pianos = [];
		laserSpeed += 0.2;
		catSpeed += 0.2;
		dogSpeed += 0.2;
		pianoSpeed += 0.2;
		startGameBtn.style.display = "block";
		startGameBtn.innerText = "NEXT LEVEL";
		window.cancelAnimationFrame();
	}
}

function checkHealth() {
	if (playerHealth <= 0) gameOver();
}

function updateCoins() {
	coinCounter.innerText = coins;
}

function gameOver() {
	backgroundMusic.pause();
	backgroundMusic.currentTime = 0;
	initCanvas();
	frameCount = 0;
	playerHealth = 3;
	coins = 0;
	coinDisplay.innerText = `Coins: ${coins}`;
	level = 1;
	for (let i = 0; i < healthBar.length; i++) {
		healthBar[i].style.display = "flex";
	}
	startGameBtn.style.display = "block";
	startGameBtn.innerText = "PLAY AGAIN";
	buckets = [];
	lasers = [];
	cats = [];
	dogs = [];
	pianos = [];
	window.cancelAnimationFrame();
}

startGameBtn.addEventListener("click", () => {
	if (startGameBtn.innerText !== "START") {
		levelDisplay.innerText = `Level ${level}`;
	}
	backgroundMusic.loop = true;
	backgroundMusic.play().catch(() => {
		// Handle play() promise rejection if needed
	});
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
		showPowerUp(item);
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

function hidePowerUp(item) {
	const powerUpImgs = document.querySelectorAll(`.power-up-img.${item}`);
	for (let i = 0; i < powerUpImgs.length; i++) {
		if (powerUpImgs[i].style.display === "flex") {
			powerUpImgs[i].style.display = "none";
			break;
		}
	}
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

window.addEventListener("resize", () => {
	initCanvas();
	boxSize = window.innerWidth / 20
})