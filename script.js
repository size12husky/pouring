const TARGET_ASPECT_RATIO = 4 / 3;
const BASE_CANVAS_WIDTH = 800;
const BASE_CANVAS_HEIGHT = 600;

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const backgroundMusic = new Audio("assets/audio/catsanddogs.mp3");
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
let coins = 0;
let gameLoopId;

//Power Ups
let itemCounts = {
	bowl: 0,
	bone: 0,
	beethoven: 0,
	defenses: 0,
	turrets: 0,
};

let level = 1;

let isPaused = false;
let isShopOpen = false;
let isGameOver = false;
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
	catBullets: [],
	dogBullets: [],
};

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
	if (isPaused || isGameOver) return;
	frameCount++;
	entities.buckets = entities.buckets.filter((b) => b.timeLeft > 0);
	entities.cats = entities.cats.filter((c) => c.y <= ctx.canvas.height);
	entities.dogs = entities.dogs.filter((d) => d.y <= ctx.canvas.height);
	entities.pianos = entities.pianos.filter((p) => p.y <= ctx.canvas.height);
	entities.lasers = entities.lasers.filter((l) => l.y <= ctx.canvas.height);
	entities.pellets = entities.pellets.filter((p) => p.y >= 0);
	entities.catBullets = entities.catBullets.filter(
		(b) => b.y <= ctx.canvas.height
	);
	entities.dogBullets = entities.dogBullets.filter((b) => b.y >= 0);

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	drawBackground();
	if (frameCount) if (frameCount % 120 === 0) spawnBuckets();
	drawBuckets();
	if (frameCount % 200 === 0 && (level >= 5) & !lasersDisabled) spawnLasers();
	if (!lasersDisabled) drawLasers();
	if (frameCount % 450 === 0) spawnCats();
	drawCats();
	if (frameCount % 1000 === 0 && level >= 7) spawnJetPackCats();
	drawJetPackCats();
	shootBullets();
	if (frameCount % 700 === 0) spawnDogs();
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
	gameLoopId = window.requestAnimationFrame(gameLoop);
}

function initCanvas(resizeOnly = false) {
	// Calculate available space
	const maxWidth = window.innerWidth * 0.9; // Leave some margin
	const maxHeight = window.innerHeight * 0.9;

	// Determine actual canvas size while maintaining 4:3 aspect ratio
	let canvasWidth, canvasHeight;

	if (maxWidth / maxHeight > TARGET_ASPECT_RATIO) {
		// Window is wider than 4:3, constrain by height
		canvasHeight = maxHeight;
		canvasWidth = canvasHeight * TARGET_ASPECT_RATIO;
	} else {
		// Window is taller than 4:3, constrain by width
		canvasWidth = maxWidth;
		canvasHeight = canvasWidth / TARGET_ASPECT_RATIO;
	}

	// Set canvas dimensions
	ctx.canvas.width = canvasWidth;
	ctx.canvas.height = canvasHeight;

	// Calculate scale factor based on reference resolution
	const scale = canvasWidth / BASE_CANVAS_WIDTH;

	// Update all game variables based on scale
	boxSize = 40 * scale; // Base size at reference resolution

	bucketSize = boxSize * 0.7;
	laserWidth = boxSize / 3;
	laserHeight = boxSize * 2;
	catWidth = boxSize;
	catHeight = boxSize * 0.8;
	dogWidth = catWidth;
	dogHeight = catHeight * 1.1;
	pianoWidth = catWidth;
	pianoHeight = catHeight;

	const isMobile = window.innerWidth <= 768;
	const mobileMultiplier = isMobile ? 0.3 : 0.4; // Slower on mobile

	const baseSpeed = isMobile ? 2 : 3; // Lower base speed on mobile
	const scaledComponent = canvasHeight * 0.008; // Scaled portion

	catSpeed = (baseSpeed + scaledComponent * 0.5) * mobileMultiplier;
	dogSpeed = (baseSpeed + scaledComponent * 0.8) * mobileMultiplier;
	pianoSpeed = (baseSpeed + scaledComponent * 1.5) * mobileMultiplier;
	laserSpeed = (baseSpeed + scaledComponent * 1.2) * mobileMultiplier;
	pelletSpeed = (baseSpeed + scaledComponent * 2) * mobileMultiplier;
	playerSpeed = (baseSpeed + scaledComponent * 1) * mobileMultiplier;

	entities.players[0].width = boxSize * 1.5;
	entities.players[0].height = boxSize / 1.1;
	entities.players[0].speed = playerSpeed;

	if (!resizeOnly) {
		entities.players[0].x =
			ctx.canvas.width / 2 - entities.players[0].width / 2;
		entities.players[0].y =
			ctx.canvas.height / 2 - entities.players[0].height / 2;
	} else {
		entities.players[0].x = Math.max(
			0,
			Math.min(
				ctx.canvas.width - entities.players[0].width,
				entities.players[0].x
			)
		);
		entities.players[0].y = Math.max(
			0,
			Math.min(
				ctx.canvas.height - entities.players[0].height,
				entities.players[0].y
			)
		);
	}
}

function drawBackground() {
	ctx.drawImage(backgroundImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawPlayer() {
	const p = entities.players[0];
	ctx.drawImage(cloudImg, p.x, p.y, p.width, p.height);
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

function drawBuckets() {
	for (const bucket of entities.buckets) {
		bucket.update();
		bucket.draw(ctx);
	}
}

function spawnLasers() {
	const padding = laserWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	entities.lasers.push(new Laser(randomX, 0, laserWidth, laserHeight));
	const laserAudio = new Audio("assets/audio/laser.mp3");
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
	const catAudio = new Audio("assets/audio/meow.mp3");
	catAudio.play();
}

function drawCats() {
	for (const cat of entities.cats) {
		cat.update();
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
	const catAudio = new Audio("assets/audio/meow.mp3");
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
	const dogAudio = new Audio("assets/audio/bark.mp3");
	dogAudio.play();
}

function drawDogs() {
	for (const dog of entities.dogs) {
		dog.update();
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
	const dogAudio = new Audio("assets/audio/bark.mp3");
	dogAudio.play();
}

function drawJetPackDogs() {
	for (const bullet of entities.dogBullets) {
		bullet.y -= bullet.speed;
	}

	for (const dog of entities.jetPackDogs) {
		dog.update();
		dog.draw(ctx);
	}
}

function spawnPianos() {
	const padding = pianoWidth;
	const randomX = Math.random() * (ctx.canvas.width - padding * 2) + padding;
	entities.pianos.push(new Piano(randomX, 0, pianoWidth, pianoHeight));
	const pianoAudio = new Audio("assets/audio/piano.mp3");
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
	if (playerScore >= 20) {
		playerScore = 0;
		cloudImg.src = "assets/images/cloudrain.png";
		entities.players[0].height = boxSize * 1.2;
		level++;
		isPaused = true;
		// Let one frame render with the rain

		cloudImg.onload = () => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			drawBackground();
			drawBuckets();
			drawPlayer();
		};

		setTimeout(() => {
			cancelAnimationFrame(gameLoopId);
			initCanvas();
			startGameBtn.style.display = "block";
			startGameBtn.innerText = "NEXT LEVEL";

			frameCount = 0;
			entities.pellets = [];
			entities.buckets = [];
			entities.cats = [];
			entities.dogs = [];
			entities.pianos = [];
			entities.lasers = [];
			entities.jetPackCats = [];
			entities.jetPackDogs = [];

			const scale = ctx.canvas.width / BASE_CANVAS_WIDTH;
			const speedIncrease = 0.2 * scale;

			laserSpeed += speedIncrease;
			catSpeed += speedIncrease;
			dogSpeed += speedIncrease;
			pianoSpeed += speedIncrease;
		}, 1000);
	}
}

function checkHealth() {
	if (entities.players[0].health <= 0) gameOver();
}

function updateCoins() {
	coinCounter.innerText = coins;
}

function gameOver() {
	isGameOver = true;
	backgroundMusic.pause();
	backgroundMusic.currentTime = 0;

	// Clear the canvas and draw a semi-transparent black overlay
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
	entities.catBullets = [];
	entities.dogBullets = [];
	turretEnabled = false;
	cloudImg.src = "assets/images/cloud.png";
	entities.players[0].height = boxSize / 1.1;
	entities.players[0].x = (ctx.canvas.width - entities.players[0].width) / 2;
	entities.players[0].y = ctx.canvas.height - entities.players[0].height - 10;
	if (gameLoopId) {
		cancelAnimationFrame(gameLoopId);
		gameLoopId = null;
	}
}

startGameBtn.addEventListener("click", () => {
	// Force a reflow to ensure the canvas container has correct dimensions
	const canvasContainer = document.querySelector('.canvas-container');
	if (canvasContainer) {
		const reflow = canvasContainer.offsetHeight;
	}

	// Initialize the canvas with proper dimensions
	initCanvas();

	if (isGameOver) {
		isGameOver = false;
		playerScore = 0;
		scoreDisplay.innerText = `Buckets: ${playerScore}`;
		levelDisplay.innerText = `Level ${level}`;

		for (let i = 0; i < healthBar.length; i++) {
			healthBar[i].style.display = "flex";
		}
	}

	isPaused = false;
	if (turretEnabled) {
		cloudImg.src = "assets/images/cloudturret.png";
		entities.players[0].height = boxSize * 1.2;
	} else {
		cloudImg.src = "assets/images/cloud.png";
		entities.players[0].height = boxSize / 1.1;
	}

	// Position player in the center of the canvas
	entities.players[0].x = (ctx.canvas.width - entities.players[0].width) / 2;
	entities.players[0].y = (ctx.canvas.height - entities.players[0].height) / 2;

	// Start background music
	backgroundMusic.loop = true;
	backgroundMusic.play();
	startGameBtn.style.display = "none";

	// Clear any existing game loop
	if (gameLoopId) {
		cancelAnimationFrame(gameLoopId);
	}

	// Start the game loop
	gameLoopId = requestAnimationFrame(gameLoop);
});

document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "p") shopHandler();
});

document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "m" && turretEnabled) spawnPellet();
});

window.addEventListener("resize", () => {
	initCanvas(true);
});
