function checkCollision(entity, width, height) {
	for (let i = 0; i < entity.length; i++) {
		const e = entity[i];
		if (
			playerX < e.x + width &&
			playerX + boxSize > e.x &&
			playerY < e.y + height &&
			playerY + boxSize > e.y
		) {
			return true;
		}
	}
	return false;
}

function onHit () {
    const hitAudio = new Audio("woosh.wav");
			hitAudio.play();
			hideHeart();
			entity.splice(i, 1);
}