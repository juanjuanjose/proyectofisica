// Obtener el lienzo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Propiedades físicas
const acceleration = 0.2; // Aceleración
const friction = 0.95; // Fricción
const carWidth = 40;
const carHeight = 20;

// Coche del jugador
const playerCar = {
    x: canvas.width / 2 - carWidth / 2 - 300, // Centramos el coche en el lienzo
    y: canvas.height / 2 - carHeight / 2, // Ajustamos la posición para moverlo más atrás
    width: carWidth * 2, // Duplicamos el ancho del carro
    height: carHeight * 2, // Duplicamos la altura del carro
    speed: 3,
    maxSpeed: 5
};

// Coche enemigo
const enemyCar = {
    x: canvas.width, // Aparece fuera del lienzo
    y: Math.floor(Math.random() * 3) * (canvas.height / 3), // Limitamos a tres filas
    width: carWidth *  2,
    height: carHeight * 2,
    speed: 7
};

// Explosión
const explosion = new Image();
explosion.src = 'imagenes/explosion.png'; // Cambia 'explosion.png' al nombre de tu imagen de explosión

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

// Actualizar la posición del coche
function updateCar() {
    if (keys.ArrowUp && playerCar.y > 0) { // Limitamos el movimiento hacia arriba
        playerCar.speed -= acceleration;
        if (playerCar.speed < -playerCar.maxSpeed) {
            playerCar.speed = -playerCar.maxSpeed;
        }
    } else if (keys.ArrowDown && playerCar.y + playerCar.height < canvas.height) { // Limitamos el movimiento hacia abajo
        playerCar.speed += acceleration;
        if (playerCar.speed > playerCar.maxSpeed) {
            playerCar.speed = playerCar.maxSpeed;
        }
    } else {
        playerCar.speed *= friction;
    }

    playerCar.y += playerCar.speed;

    // Colisiones con los bordes
    if (playerCar.y < 0) {
        playerCar.y = 0;
        playerCar.speed = 0;
    }
    if (playerCar.y + carHeight > canvas.height) {
        playerCar.y = canvas.height - carHeight;
        playerCar.speed = 0;
    }

    // Colisiones con el coche enemigo
    if (detectCollision(playerCar, enemyCar)) {
        // Mostrar explosión
        ctx.drawImage(explosion, enemyCar.x, enemyCar.y, enemyCar.width, enemyCar.height);

        // Reiniciar juego
        resetGame();
    }
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

// Control de teclas
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Evitar el desplazamiento de la página cuando se usan las flechas
    }
});
document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

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

    // Siguiente fotograma
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();
