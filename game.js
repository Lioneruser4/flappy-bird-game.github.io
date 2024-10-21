const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let plane = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    dx: 5
};

let planeImg = new Image();
planeImg.src = 'path_to_image.png';  // Burada təyyarənin şəklini qoymalısınız

function drawPlane() {
    ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    plane.x += plane.dx;

    if (plane.x + plane.width > canvas.width || plane.x < 0) {
        plane.dx *= -1;
    }

    requestAnimationFrame(update);
}

update();
