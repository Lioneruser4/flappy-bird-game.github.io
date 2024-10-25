let scene, camera, renderer, wheel;
const names = ["Ali", "Beyza", "Cem", "Deniz", "Ece", "Furkan", "Gizem"];
let spinning = false;
let spinVelocity = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    const geometry = new THREE.CylinderGeometry(5, 5, 1, 7);
    const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
    wheel = new THREE.Mesh(geometry, material);
    scene.add(wheel);

    camera.position.z = 10;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (spinning) {
        wheel.rotation.y += spinVelocity;
        spinVelocity *= 0.99;
        if (spinVelocity < 0.01) {
            spinning = false;
            determineWinner();
        }
    }

    renderer.render(scene, camera);
}

function spin() {
    spinning = true;
    spinVelocity = Math.random() * 0.2 + 0.05;
}

function determineWinner() {
    const segmentAngle = (2 * Math.PI) / names.length;
    const angle = wheel.rotation.y % (2 * Math.PI);
    const index = Math.floor(angle / segmentAngle);
    document.getElementById("winner").innerText = names[index];
}

init();
