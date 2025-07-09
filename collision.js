const collisionPairs = [
	["players", "buckets"],
	["players", "cats"],
	["players", "dogs"],
	["players", "pianos"],
	["players", "lasers"],
	["players", "jetPackCats"],
	["players", "jetPackDogs"],
	["players", "enemyBullets"],
	["pellets", "cats"],
	["pellets", "dogs"],
	["pellets", "pianos"],
	["pellets", "lasers"],
	["pellets", "jetPackDogs"],
	["pellets", "jetPackCats"],
];

function handleCollisions() {
	for (let [groupNameA, groupNameB] of collisionPairs) {
		const groupA = entities[groupNameA];
		const groupB = entities[groupNameB];
		checkCollision(groupA, groupB, groupNameA, groupNameB);
	}
}

function checkCollision(groupA, groupB, nameA, nameB) {
	for (let i = groupA.length - 1; i >= 0; i--) {
		const a = groupA[i];
		let collided = false;
		for (let j = groupB.length - 1; j >= 0; j--) {
			const b = groupB[j];
			if (
				a.x + a.width > b.x &&
				a.x < b.x + b.width &&
				a.y + a.height > b.y &&
				a.y < b.y + b.height
			) {
				onHit(a, b, nameA, nameB);
				if (nameA === "pellets") {
					groupA.splice(i, 1);
					groupB.splice(j, 1);
				} else if (nameA === "players") {
					groupB.splice(j, 1);
				} else {
				}
				collided = true;
			}
		}
		if (collided) break;
	}
}

function onHit(a, b, nameA, nameB) {
	if (nameA !== "players" && nameB === "buckets") {
		return;
	} else if (nameA === "players" && nameB === "buckets") {
		if (b.timeLeft < 300) {
			coins++;
			coinDisplay.innerText = `Coins: ${coins}`;
			new Audio("coin.mp3").play();
			return;
		}
		playerScore++;
		scoreDisplay.innerText = `Buckets: ${playerScore}`;
		new Audio("water.wav").play();
		return;
	} else if (nameA === "pellets") {
		new Audio("coin.mp3").play();
		console.log(b.x, b.y, b.width, b.height);
		entities.buckets.push(
			new Bucket(b.x, b.y, bucketSize, bucketSize, 300, true)
		);
	} else {
		new Audio("woosh.wav").play();
		hideHeart();
	}
}
