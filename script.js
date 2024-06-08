this.y = canvas.height - fg.h - this.h / 2;
if (state.current == state.game) {
  state.current = state.over;
}


if (this.speed >= this.jump) {
this.rotation = 90 * DEGREE;
this.frame = 1;
} else {
this.rotation = -25 * DEGREE;
}



this.speed = 0;

;

// Borular
const pipes = {
position: [],

top: {
sX: 553,
sY: 0,
},
bottom: {
sX: 502,
sY: 0,
},
w: 53,
h: 400,
gap: 85,
maxYPos: -150,
dx: 2,

draw: function () {
for (let i = 0; i < this.position.length; i++) {
let p = this.position[i];

let topYPos = p.y;
let bottomYPos = p.y + this.h + this.gap;

ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
}
},

update: function () {
if (state.current !== state.game) return;

if (frames % 100 == 0) {
this.position.push({
x: canvas.width,
y: this.maxYPos * (Math.random() + 1),
});
}
for (let i = 0; i < this.position.length; i++) {
let p = this.position[i];
p.x -= this.dx;

if (p.x + this.w <= 0) {
this.position.shift();
}
}
},

reset: function () {
this.position = [];
},
};

// Skor
const score = {
best: parseInt(localStorage.getItem("best")) || 0,
value: 0,

draw: function () {
ctx.fillStyle = "#FFF";
ctx.strokeStyle = "#000";

if (state.current == state.game) {
ctx.lineWidth = 2;
ctx.font = "35px Teko";
ctx.fillText(this.value, canvas.width / 2, 50);
ctx.strokeText(this.value, canvas.width / 2, 50);
} else if (state.current == state.over) {
// Skor
ctx.font = "25px Teko";
ctx.fillText(this.value, 225, 186);
ctx.strokeText(this.value, 225, 186);
// En Yüksek Skor
ctx.fillText(this.best, 225, 228);
ctx.strokeText(this.best, 225, 228);
}
},

reset: function () {
this.value = 0;
},
};

// Oyun başlatma
function startGame() {
canvas.addEventListener("click", flyUp);
}

function flyUp() {
switch (state.current) {
case state.getReady:
state.current = state.game;
break;
case state.game:
bird.flap();
break;
case state.over:
let rect = canvas.getBoundingClientRect();
let clickX = evt.clientX - rect.left;
let clickY = evt.clientY - rect.top;

// Tekrar Başla butonuna tıklama
if (
clickX >= startBtn.x &&
clickX <= startBtn.x + startBtn.w &&
clickY >= startBtn.y &&
clickY <= startBtn.y + startBtn.h
) {
pipes.reset();
bird.speedReset();
score.reset();
state.current = state.getReady;
}
break;
}
}

// Oyun süreci
function draw() {
ctx.fillStyle = "#70c5ce";
ctx.fillRect(0, 0, canvas.width, canvas.height);

bg.draw();
pipes.draw();
fg.draw();
bird.draw();
score.draw();
}

function update() {
bird.update();
fg.update();
pipes.update();
}

function loop() {
update();
draw();
frames++;

requestAnimationFrame(loop);
}
loop();
