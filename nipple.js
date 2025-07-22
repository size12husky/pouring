window.currentMovement = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        const container = document.getElementById('joystick-container');
        
        const manager = nipplejs.create({
            zone: container,
            mode: 'dynamic',
            color: 'blue',
            size: 120,
            threshold: 0.1
        });

        manager.on('move', (evt, data) => {
            console.log('Full data:', data);
            console.log('Angle:', data.angle?.degree);
            
            window.currentMovement = { left: false, right: false, up: false, down: false };
            
            const angle = data.angle?.degree;
            if (typeof angle === 'number') {
                if (angle >= 315 || angle <= 45) window.currentMovement.right = true;
                if (angle >= 45 && angle <= 135) window.currentMovement.up = true;
                if (angle >= 135 && angle <= 225) window.currentMovement.left = true;
                if (angle >= 225 && angle <= 315) window.currentMovement.down = true;
            }
        });

        manager.on('end', () => {
            window.currentMovement = { left: false, right: false, up: false, down: false };
        });