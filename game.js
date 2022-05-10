const sprites = new Image();
sprites.src = "./sprites.png";
let startGame = false;
const canvas = document.querySelector("canvas");
const score = document.querySelector("#score");
const context = canvas.getContext("2d");
const collisionSound = new Audio();
collisionSound.src = "./hit.wav";
const jumpSound = new Audio();
jumpSound.src = "./pulo.wav";
const scoreSound = new Audio();
scoreSound.src = "./ponto.wav";
let frames = 0;

const flappyBird = {
  lagura: 33,
  altura: 24,
  positionX: 10,
  positionY: 50,
  speed: 0,
  gravity: 0.2,
  jump: 4.6,
  movimentos: [
    { spriteX: 0, spriteY: 0 }, // asa pra cima
    { spriteX: 0, spriteY: 26 }, // asa no meio
    { spriteX: 0, spriteY: 52 }, // asa pra baixo
    { spriteX: 0, spriteY: 26 }, // asa no meio
  ],
  addJump() {
    flappyBird.speed = -this.jump;
  },
  updateSpeed() {
    flappyBird.speed = flappyBird.speed + flappyBird.gravity;
    flappyBird.positionY = flappyBird.positionY + this.speed;
  },

  frameAtual: 0,
  atualizaOFrameAtual() {
    const intervaloDeFrames = 10;
    const passouOIntervalo = frames % intervaloDeFrames === 0;

    if (passouOIntervalo && startGame) {
      const base = 1;
      const incremento = base + flappyBird.frameAtual;
      flappyBird.frameAtual = incremento % flappyBird.movimentos.length;
    }
  },
  draw() {
    this.atualizaOFrameAtual();
    const { spriteX, spriteY } = this.movimentos[this.frameAtual];

    context.drawImage(
      sprites,
      spriteX,
      spriteY,
      flappyBird.lagura,
      flappyBird.altura,
      flappyBird.positionX,
      flappyBird.positionY,
      flappyBird.lagura,
      flappyBird.altura
    );
  },
};

const floor = {
  spriteX: 0,
  spriteY: 610,
  lagura: 224,
  altura: 112,
  positionX: 0,
  positionY: canvas.height - 112,
  movementFloor() {
    const repeatIn = floor.lagura / 2;
    const movimentFloor = floor.positionX - 1;
    if (startGame) {
      floor.positionX = movimentFloor % repeatIn;
    }
  },
  draw() {
    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY, // Sprite x, Sprite y
      floor.lagura,
      floor.altura, // tamanho da Sprite
      floor.positionX,
      floor.positionY,
      floor.lagura,
      floor.altura
    );

    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.lagura,
      floor.altura,
      floor.positionX + floor.lagura,
      floor.positionY,
      floor.lagura,
      floor.altura
    );
  },
};

const background = {
  spriteX: 390,
  spriteY: 0,
  lagura: 275,
  altura: 204,
  positionX: 0,
  positionY: canvas.height - 204,
  draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY, // Sprite x, Sprite y
      background.lagura,
      background.altura, // tamanho da Sprite
      background.positionX,
      background.positionY,
      background.lagura,
      background.altura
    );

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY, // Sprite x, Sprite y
      background.lagura,
      background.altura, // tamanho da Sprite
      background.positionX + background.lagura,
      background.positionY,
      background.lagura,
      background.altura
    );
  },
};

const start = {
  spriteX: 134,
  spriteY: 0,
  lagura: 174,
  altura: 152,
  positionX: canvas.width / 2 - 174 / 2,
  positionY: 50,
  draw() {
    context.drawImage(
      sprites,
      start.spriteX,
      start.spriteY, // Sprite x, Sprite y
      start.lagura,
      start.altura, // tamanho da Sprite
      start.positionX,
      start.positionY,
      start.lagura,
      start.altura
    );
  },
};

const obstacles = {
  width: 52,
  height: 400,
  obstacleBotton: {
    spriteX: 0,
    spriteY: 169,
  },
  obstacleTop: {
    spriteX: 52,
    spriteY: 169,
  },
  pairs: [],

  update() {
    const createObstacle = frames % 100 === 0;
    const valueY = -150 * (Math.random() + 1);
    if (createObstacle && startGame) {
      obstacles.pairs.push({ x: canvas.width, y: valueY });
    }
    obstacles.pairs.forEach((pair) => {
      if (startGame) pair.x += -2;

      if (pair.x + obstacles.width <= 0 && startGame) obstacles.pairs.shift();

      if (
        (flappyBird.positionY + flappyBird.altura >=
          obstacles.height + 90 + pair.y &&
          flappyBird.positionX + flappyBird.lagura >= pair.x) ||
        (flappyBird.positionY <= pair.y + obstacles.height &&
          flappyBird.positionX + flappyBird.lagura >= pair.x)
      ) {
        if (startGame) collisionSound.play();
        startGame = false;
      }
      if (
        flappyBird.positionY + flappyBird.altura < floor.positionY &&
        !startGame
      ) {
        flappyBird.speed += 0.1;
        flappyBird.positionY += flappyBird.speed;
      }
    });
  },

  draw() {
    obstacles.pairs.forEach((pair) => {
      const yRandom = pair.y;
      const spacing = 90;
      context.drawImage(
        sprites,
        obstacles.obstacleTop.spriteX,
        obstacles.obstacleTop.spriteY,
        obstacles.width,
        obstacles.height,
        pair.x,
        yRandom,
        obstacles.width,
        obstacles.height
      );

      context.drawImage(
        sprites,
        obstacles.obstacleBotton.spriteX,
        obstacles.obstacleBotton.spriteY,
        obstacles.width,
        obstacles.height,
        pair.x,
        obstacles.height + spacing + yRandom,
        obstacles.width,
        obstacles.height
      );
    });
  },
};

function collisionFloor() {
  if (flappyBird.positionY + flappyBird.altura > floor.positionY) {
    if (startGame) collisionSound.play();
    startGame = false;
  }
}

function addPont() {
  if (obstacles.pairs[0]) {
    if (obstacles.pairs[0].x + obstacles.width < flappyBird.positionX) {
      const pont = Number(score.textContent);
      setTimeout(() => {
        scoreSound.play();
        score.textContent = pont + 1;
      }, "50");
    }
  }
}

function loop() {
  background.draw();
  if (startGame) {
    floor.movementFloor();
    flappyBird.updateSpeed();
    addPont();
  }
  obstacles.update();
  obstacles.draw();
  floor.draw();
  flappyBird.draw();
  if (!startGame) start.draw();
  collisionFloor();
  frames += 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => {
  if (!startGame) {
    score.textContent = 0;
    flappyBird.positionY = 50;
    flappyBird.speed = 0;
    obstacles.pairs = [];
    startGame = true;
  } else {
    jumpSound.play();
    flappyBird.addJump();
  }
});

loop();
