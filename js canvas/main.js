const speed = 5;
const canvas = document.createElement('canvas');
canvas.width = 1200;
canvas.height = 600;
canvas.primeWidth = 1200;
canvas.primeHeight = 600;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

const square = {
    x: 600,
    y: 300,
    size: 50,
    color: '#1c6aad'
};

let end = false;
let mouseX = 0;
let mouseY = 0;

function drawSquare() {
    ctx.fillStyle = square.color;
    ctx.fillRect(square.x, square.y, square.size, square.size);
}

// function drawAim() {
//     ctx.beginPath();
//     ctx.moveTo(square.x + 25, square.y + 25);
//     ctx.lineTo(mouseX, mouseY);
//     ctx.moveTo(square.x + 25, square.y + 25);
//     ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
//     ctx.lineWidth = 20;
//     ctx.stroke();
// }

function drawAim() {
    let aimLength = 100;
  
    let dx = mouseX - (square.x + 25);
    let dy = mouseY - (square.y + 25);
    let distance = Math.sqrt(dx * dx + dy * dy);
  
    let aimX, aimY;
  
    if (distance > aimLength){
      let ratio = aimLength / distance;
      aimX = (square.x + 25) + dx * ratio;
      aimY = (square.y + 25) + dy * ratio;
    } else {
      aimX = mouseX;
      aimY = mouseY;
    }
  
    ctx.beginPath();
    ctx.moveTo(square.x + 25, square.y + 25);
    ctx.lineTo(aimX, aimY);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
    ctx.lineWidth = 20;
    ctx.stroke();
  }  

function update() {
    if(end != true){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys['a'] && square.x >= 0) {
        square.x -= speed;
    } else if (keys['d'] && square.x + 50 <= canvas.width) {
        square.x += speed;
    }

    if (keys['w'] && square.y >= 0) {
        square.y -= speed;
    } else if (keys['s'] && square.y + 50 <= canvas.height) {
        square.y += speed;
    }

    drawSquare();
    drawEnemy();
    drawAim();
    hitCheck();

    requestAnimationFrame(update);
    }
}

function onMouseMove(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
}

function onKeyDown(e) {
    keys[e.key] = true;
}

function onKeyUp(e) {
    keys[e.key] = false;
}

const keys = {};

let step = 0;

const enemy = {
    x: getRandomInt(50),
    y: getRandomInt(50),
    size: 30,
    color: '#a00'
};

function enemyMovement() {
    if (step < 100) {
        enemy.x += 2;
        enemy.y++;
        step++
    } else if (step < 200) {
        enemy.y += 2;
        step++;
    } else if (step < 300) {
        enemy.x += getRandomInt(4);
        step++;
    } else if (step < 400) {
        enemy.y -= getRandomInt(2);
        enemy.x += getRandomInt(2);
        step++;
    } else if (step < 500) {
        enemy.x -= getRandomInt(2);
        step++;
    } else if (step < 600) {
        enemy.x += getRandomInt(3);
        enemy.y += getRandomInt(2);
        step++;
    } else if (step < 700) {
        enemy.x += getRandomInt(4);
        step++;
    }
}
setInterval(enemyMovement, 10); 77

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function drawEnemy() {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

canvas.addEventListener('mousemove', onMouseMove);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);



function limitEnemyMovement() {
    if (enemy.x <= 0) {
        enemy.x = 0;
    }
    if (enemy.x + enemy.size >= canvas.width) {
        enemy.x = canvas.width - enemy.size;
    }
    if (enemy.y <= 0) {
        enemy.y = 0;
    }
    if (enemy.y + enemy.size >= canvas.height) {
        enemy.y = canvas.height - enemy.size;
    }
}
setInterval(limitEnemyMovement, 10);

function hitCheck() {
    if (enemy.x + 30 >= square.x && enemy.x <= square.x + 50 && enemy.y + 30 >= square.y && enemy.y <= square.y + 50) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f00';
        ctx.font = '50px Calibri';
        ctx.fillText('GAME OVER', canvas.width/2 - canvas.width/12, canvas.height/2);
        end = true;
        canvas.style.cursor = 'default';
    }
}

function enterFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

let section = document.getElementById('section');

function fullscreenByButton(){
    enterFullscreen();
    section.style.display = 'none';
    canvas.setAttribute('width', window.innerWidth - 10);
    canvas.setAttribute('height', window.innerHeight + 130);
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
function handleFullscreenChange() {
  if (document.fullscreenElement === null) {
    section.style.display = 'flex';
    canvas.setAttribute('width', canvas.primeWidth);
    canvas.setAttribute('height', canvas.primeHeight);
  }
}

update();