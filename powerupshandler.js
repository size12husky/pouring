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