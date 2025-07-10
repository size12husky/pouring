import nipplejs from "nipplejs";

let currentMovement = {
	left: false,
	right: false,
	up: false,
	down: false,
};

const manager = nipplejs.create({
	zone: document.getElementById("joystick-container"),
	mode: "static",
	position: { left: "50px", bottom: "50px" },
	color: "blue",
	size: 120,
});

manager.on("move", (evt, data) => {
	currentMovement = { left: false, right: false, up: false, down: false };

	const x = data.direction.x;
	const y = data.direction.y;

	const threshold = 0.3;

	if (Math.abs(x) > threshold) {
		if (x > 0) currentMovement.right = true;
		if (x < 0) currentMovement.left = true;
	}

	if (Math.abs(y) > threshold) {
		if (y > 0) currentMovement.up = true;
		if (y < 0) currentMovement.down = true;
	}
});

manager.on("end", () => {
	currentMovement = { left: false, right: false, up: false, down: false };
});
