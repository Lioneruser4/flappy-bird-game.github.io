let scene, camera, renderer;
let symbols = [];
let spinning = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("slotCanvas") });
    renderer.setSize(400, 300);
    camera.position.z = 5;

    // Meyve sembollerini ekleyin
    const geometry = new THREE.BoxGeometry();
    const fruits = ["🍒", "🍋", "🍉"];
    fruits.forEach((fruit, index) => {
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const symbol = new THREE.Mesh(geometry, material);
        symbol.position.x = index - 1;
        scene.add(symbol);
        symbols.push(symbol);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (spinning) {
        symbols.forEach((symbol) => {
            symbol.rotation.x += 0.1;
            symbol.rotation.y += 0.1;
        });
    }
    renderer.render(scene, camera);
}

function spin() {
    spinning = true;
    setTimeout(() => {
        spinning = false;
        checkJackpot();
    }, 2000);
}

function checkJackpot() {
    if (Math.random() > 0.8) {
        alert("Jackpot! 🍒🍒🍒");
    } else {
        alert("Şansını tekrar dene!");
    }
}

window.onload = init;
