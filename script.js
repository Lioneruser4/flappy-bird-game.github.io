let scene, camera, renderer;
let slotMeshes = [];
const fruits = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍓"];
let username = localStorage.getItem("username");
let scores = JSON.parse(localStorage.getItem("scores")) || [];

if (!username) {
    username = prompt("Lütfen kullanıcı adınızı girin:");
    localStorage.setItem("username", username);
}

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Slot Machine
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = i * 1.5 - 1.5;
        scene.add(mesh);
        slotMeshes.push(mesh);
    }

    // Event Listener
    document.getElementById("spin-button").addEventListener("click", spinSlots);

    // Update Scores
    updateScores();
}

function spinSlots() {
    const results = [];
    slotMeshes.forEach((mesh, index) => {
        const fruitIndex = Math.floor(Math.random() * fruits.length);
        mesh.userData.fruit = fruits[fruitIndex];
        results.push(fruits[fruitIndex]);

        // Rotate the slot
        const rotation = Math.random() * Math.PI * 2;
        mesh.rotation.y += rotation;
    });

    setTimeout(() => {
        checkWin(results);
    }, 1000);
}

function checkWin(results) {
    const message = document.getElementById("message");
    if (results[0] === results[1] && results[1] === results[2]) {
        message.textContent = "Kazandınız! Skorunuz 100!";
        addScore(username, 100);
    } else {
        message.textContent = "Kaybettiniz. Tekrar deneyin!";
    }
}

function addScore(username, score) {
    scores.push({ username, score });
    localStorage.setItem("scores", JSON.stringify(scores));
    updateScores();
}

function updateScores() {
    const scoresList = document.getElementById("scores");
    scoresList.innerHTML = scores.map(score => `<li>${score.username}: ${score.score}</li>`).join("");
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
animate();
