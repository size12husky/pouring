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

shopBtn.addEventListener("click", () => {
	shopHandler();
});

const itemKeys = Object.keys(shopItems);
for (let i = 0; i < shopBtns.length; i++) {
	shopBtns[i].addEventListener("click", () => {
		buyItem(`${itemKeys[i]}`);
	});
}