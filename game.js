const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
    x: 50,
    y: 50,
    size: 20,
    gravity: 0.5,
    lift: -15,
    velocity: 0,
    show: function() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    },
    up: function() {
        this.velocity += this.lift;
    },
    update: function() {
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;
        
        if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            this.velocity = 0;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
};

window.addEventListener('click', () => {
    bird.up();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.show();
    bird.update();
    requestAnimationFrame(draw);
}

draw();
