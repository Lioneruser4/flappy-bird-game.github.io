let deg = 0;

function spin() {
    document.getElementById("result").innerText = "";
    const wheel = document.getElementById("wheel");
    const oldDeg = deg;
    deg = Math.floor(5000 + Math.random() * 5000);
    const realDeg = deg % 360;
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        const sector = Math.floor(realDeg / 10);
        const resultNumber = (sector % 36) + 1;
        document.getElementById("result").innerText = `Kazanan numara: ${resultNumber}`;
    }, 4000);
}
