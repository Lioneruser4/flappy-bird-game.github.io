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
planeImg.src = 'https://www.google.com/search?q=plane+png&client=ms-android-xiaomi-terr1-rso2&sca_esv=0ba5b4315e0bd468&udm=2&biw=360&bih=729&ei=XUAWZ9m5F8jEwPAPjI_doQw&oq=plane+png&gs_lp=EhNtb2JpbGUtZ3dzLXdpei1zZXJwIglwbGFuZSBwbmcyBRAAGIAEMgUQABiABDIEEAAYHjIEEAAYHjIEEAAYHkjMDVBCWJUMcAF4AJABAZgB3gSgAZcTqgEHMi0zLjUtM7gBA8gBAPgBAZgCBKACuQaYAwCSBwcxLjAuMi4xoAe_Dw&sclient=mobile-gws-wiz-serp#vhid=VITCw9LjJ45iKM&vssid=mosaic';  // Burada təyyarənin şəklini qoymalısınız

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
