let nickname;
let room = null;

function setNickname() {
    nickname = document.getElementById("nicknameInput").value;
    document.getElementById("nickname").style.display = "none";
    document.getElementById("lobby").style.display = "block";
}

function createRoom() {
    room = { name: `Room_${Math.floor(Math.random() * 1000)}`, players: [nickname] };
    document.getElementById("lobby").style.display = "none";
    document.getElementById("room").style.display = "block";
    document.getElementById("roomName").innerText = room.name;
    document.getElementById("players").innerText = room.players.join(", ");
}

function joinRoom() {
    // Burada otağa qoşulmaq üçün məntiq əlavə edilməlidir (məsələn, WebSocket və ya API çağırışı vasitəsilə)
}

function startGame() {
    if (room.players.length < 2) {
        alert("Oyunu başlamaq üçün ən azı 2 oyunçu olmalıdır.");
        return;
    }
    document.getElementById("room").style.display = "none";
    document.getElementById("gameBoard").style.display = "block";
    // Oyunun başlanğıc məntiqini buraya əlavə edin
}

// Əlavə oyun məntiqini buraya əlavə edin
