const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Propiedades físicas
const acceleration = 0.2; // Aceleración
const friction = 0.95; // Fricción
const carWidth = 40;
const carHeight = 20;

// Ajustes de movimiento lateral
const lateralAcceleration = 0.1; // Aceleración lateral
const lateralFriction = 0.9; // Fricción lateral
const maxLateralSpeed = 3; // Velocidad lateral máxima

// Coche del jugador
const playerCar = {
    x: canvas.width / 2 - carWidth / 2, // Ajustamos la posición inicial del jugador
    y: canvas.height / 2 - carHeight / 2, // Ajustamos la posición inicial del jugador
    width: carWidth * 4, // Duplicamos el ancho del carro
    height: carHeight * 4, // Duplicamos la altura del carro
    speed: 2,
    maxSpeed: 6,
    speedX: 6, // Velocidad lateral en el eje X
    speedY: 6 // Velocidad lateral en el eje Y
};


// Coche enemigo
const enemyCar = {
    x: canvas.width, // Aparece fuera del lienzo
    y: Math.floor(Math.random() * (canvas.height - carHeight)), // Aleatoriamente en el eje Y
    width: carWidth * 4,
    height: carHeight * 4,
    speed: 7
};

// Variable global para almacenar la velocidad del jugador
let playerSpeed = 0;

// Explosión
const explosion = new Image();
explosion.src = 'imagenes/explosion.png'; 

// Teclas de control
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Función para detectar colisiones entre dos rectángulos
function detectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Control de teclas
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); // Evitar el desplazamiento de la página cuando se usan las flechas
    }
});
document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

// Actualizar la posición del coche
function updateCar() {
    // Movimiento lateral hacia la izquierda
    if (keys.ArrowLeft) {
        playerCar.speedX -= lateralAcceleration;
        if (playerCar.speedX < -maxLateralSpeed) {
            playerCar.speedX = -maxLateralSpeed;
        }
    }
    // Movimiento lateral hacia la derecha
    if (keys.ArrowRight) {
        playerCar.speedX += lateralAcceleration;
        if (playerCar.speedX > maxLateralSpeed) {
            playerCar.speedX = maxLateralSpeed;
        }
    }

    // Aplicar fricción lateral cuando no se presionan las teclas de flecha
    if (!keys.ArrowLeft && !keys.ArrowRight) {
        playerCar.speedX *= lateralFriction;
    }

    // Actualizar la posición lateral del coche
    playerCar.x += playerCar.speedX;

    // Movimiento vertical
    if (keys.ArrowUp && playerCar.y > 0) { // Limitamos el movimiento hacia arriba
        playerCar.speedY -= acceleration;
        if (playerCar.speedY < -playerCar.maxSpeed) {
            playerCar.speedY = -playerCar.maxSpeed;
        }
    } else if (keys.ArrowDown && playerCar.y + playerCar.height < canvas.height) { // Limitamos el movimiento hacia abajo
        playerCar.speedY += acceleration;
        if (playerCar.speedY > playerCar.maxSpeed) {
            playerCar.speedY = playerCar.maxSpeed;
        }
    } else {
        playerCar.speedY *= friction;
    }

    playerCar.y += playerCar.speedY;

    // Colisiones con los bordes
    if (playerCar.y < 0) {
        playerCar.y = 0;
        playerCar.speedY = 0;
    }
    if (playerCar.y + carHeight > canvas.height) {
        playerCar.y = canvas.height - carHeight;
        playerCar.speedY = 0;
    }

    // Colisiones con el coche enemigo
   // Colisiones con el coche enemigo
if (detectCollision(playerCar, enemyCar)) {
    // Aumentar el tamaño de la explosión
    const explosionWidth = enemyCar.width * 2;
    const explosionHeight = enemyCar.height * 2;
    
    // Mostrar la explosión con el nuevo tamaño
    ctx.drawImage(explosion, enemyCar.x - (explosionWidth - enemyCar.width) / 2, enemyCar.y - (explosionHeight - enemyCar.height) / 2, explosionWidth, explosionHeight);

    // Reiniciar juego
    resetGame();
}

}

// Función para calcular la velocidad del jugador
function calculatePlayerSpeed() {
    // Calcular la velocidad en función del desplazamiento en el eje X
    const prevX = playerCar.x;
    updateCar();
    const deltaX = playerCar.x - prevX;
    playerSpeed = Math.abs(deltaX);
}

// Función para dibujar el medidor de velocidad
// Función para dibujar el velocímetro con fondo verde
// Función para dibujar el velocímetro con fondo verde
function drawSpeedometer() {
    // Dibujar el fondo verde del velocímetro
    ctx.fillStyle = 'green';
    ctx.fillRect(25, 0, 150, 30);

    // Configurar el estilo del texto
    ctx.fillStyle = 'white';
    ctx.font = '22px Arial';

    // Calcular la velocidad en km/h
    let speedKPH;
    if (playerCar.speedX >= 0) {
        speedKPH = playerCar.speedX * 50; // Suponiendo una escala para convertir a KPH
    } else {
        speedKPH = playerCar.speedX * 11 * -1; // Convertir velocidad negativa a positiva para mostrarla en el velocímetro
    }

    // Mostrar la velocidad actual
    ctx.fillText('Velocidad: ' + Math.round(speedKPH), 30, 20);
}


// Dibujar el coche del jugador
function drawCar(car) {
    const carImage = new Image();
    carImage.src = 'imagenes/carrito.png'; // Cambia 'car.png' al nombre de tu imagen de carro
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

// Mover el coche enemigo
function moveEnemyCar() {
    enemyCar.x -= enemyCar.speed;
    if (enemyCar.x + enemyCar.width < 0) {
        // Resetear la posición del coche enemigo al llegar al borde izquierdo
        enemyCar.x = canvas.width;
        enemyCar.y = Math.floor(Math.random() * 3) * (canvas.height / 3); // Limitamos a tres filas
    }
}

// Reiniciar el juego
function resetGame() {
    document.location.reload();
}

// Loop del juego
function gameLoop() {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar el juego
    updateCar();
    moveEnemyCar();
    drawCar(playerCar);
    drawCar(enemyCar);
    calculatePlayerSpeed(); // Calcular velocidad del jugador
    drawSpeedometer(); // Dibujar medidor de velocidad

    // Siguiente fotograma
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();