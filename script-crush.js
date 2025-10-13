const crushGrid = document.getElementById('crush-game-grid');
const crushScoreDisplay = document.getElementById('crush-score');
const crushWidth = 8; // 8x8 ölçüsündə oyun sahəsi
const crushSquareCount = crushWidth * crushWidth;
const crushSquares = [];
let crushScore = 0;

let crushEmojiBeingDragged;
let crushEmojiBeingReplaced;

// Bütün mövcud emojilərin daha böyük və müxtəlif setini istifadə edirik!
const crushEmojis = [
    '😀', '😍', '🤩', '🥳', '😎', '😇', '🤫', '💩',
    '🍉', '🍍', '🍓', '🍇', '🍒', '🍋', '🥝', '🍎',
    '🚗', '🚕', '🚌', '🚓', '🚑' // Əlavə emojilər
];


// 1. Emoji Crush Taxtasını Yaratmaq
function crushCreateBoard() {
    // Taxta tamamilə görünənə qədər gözləyin
    if (!crushGrid || crushGrid.clientWidth === 0) {
        setTimeout(crushCreateBoard, 50); // 50ms gözləyin və yenidən cəhd edin
        return;
    }
    
    const crushSquareSize = crushGrid.clientWidth / crushWidth;
    crushGrid.style.gridTemplateColumns = `repeat(${crushWidth}, 1fr)`;
    crushGrid.style.gridTemplateRows = `repeat(${crushWidth}, 1fr)`;
    
    // Yalnız bir dəfə yaratmağı təmin edin
    if (crushSquares.length === crushSquareCount) return; 

    for (let i = 0; i < crushSquareCount; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', 'crush-' + i);
        square.classList.add('crush-square');

        // Ölçüləri quraşdırın
        square.style.width = `${crushSquareSize}px`;
        square.style.height = `${crushSquareSize}px`;
        square.style.fontSize = `${crushSquareSize * 0.6}px`;

        // Təsadüfi emoji seçin
        let randomEmoji = Math.floor(Math.random() * crushEmojis.length);
        square.innerHTML = crushEmojis[randomEmoji];

        // Drag & Drop hadisələrini əlavə edin
        crushAddEventListeners(square, i);

        crushGrid.appendChild(square);
        crushSquares.push(square);
    }
}

// Mobil və Masaüstü üçün Hadisə Dinləyiciləri
function crushAddEventListeners(square, id) {
    square.setAttribute('draggable', true);

    // Masaüstü
    square.addEventListener('dragstart', crushDragStart);
    square.addEventListener('dragover', crushDragOver);
    square.addEventListener('dragenter', crushDragEnter);
    square.addEventListener('dragleave', crushDragLeave);
    square.addEventListener('drop', crushDragDrop);
    square.addEventListener('dragend', crushDragEnd);

    // Mobil Cihazlar (Touch Events)
    square.addEventListener('touchstart', crushTouchStart);
    square.addEventListener('touchmove', crushTouchMove);
    square.addEventListener('touchend', crushTouchEnd);
}

// 2. Drag & Drop Məntiqi (Sürüşdürmə)

function crushDragStart() {
    crushEmojiBeingDragged = this;
    this.classList.add('drag-start');
}

function crushDragOver(e) { e.preventDefault(); }
function crushDragEnter(e) { e.preventDefault(); this.style.opacity = 0.7; }
function crushDragLeave() { this.style.opacity = 1; }
function crushDragDrop() {
    crushEmojiBeingReplaced = this;
    this.style.opacity = 1;
}

function crushDragEnd() {
    this.classList.remove('drag-start');

    if (!crushEmojiBeingReplaced) {
        // Əgər dəyişməyə bir emoji yoxdursa, opacity-ni sıfırla
        if (crushEmojiBeingDragged) crushEmojiBeingDragged.style.opacity = 1;
        crushEmojiBeingDragged = null;
        return;
    }

    const dragId = parseInt(crushEmojiBeingDragged.id.replace('crush-', ''));
    const replaceId = parseInt(crushEmojiBeingReplaced.id.replace('crush-', ''));

    // Dəyişməyə icazə verilən qonşu indeksləri
    const validMoves = [
        dragId - 1, dragId + 1,
        dragId + crushWidth, dragId - crushWidth
    ];

    if (validMoves.includes(replaceId)) {
        const draggedEmoji = crushEmojiBeingDragged.innerHTML;
        const replacedEmoji = crushEmojiBeingReplaced.innerHTML;
        
        // Emojiləri dəyişin
        crushEmojiBeingReplaced.innerHTML = draggedEmoji;
        crushEmojiBeingDragged.innerHTML = replacedEmoji;

        // Uyğunluqları yoxlayın
        let isMatch = crushCheckRowForThree() || crushCheckColumnForThree();

        // Əgər uyğunluq yoxdursa, dəyişikliyi geri qaytarın
        if (!isMatch) {
            crushEmojiBeingReplaced.innerHTML = replacedEmoji;
            crushEmojiBeingDragged.innerHTML = draggedEmoji;
        }
    }

    crushEmojiBeingDragged = null;
    crushEmojiBeingReplaced = null;
}

// Touch Hadisələri (Mobil)
let crushStartTouchSquare = null;
let crushEndTouchSquare = null;

function crushTouchStart(e) {
    e.preventDefault();
    crushStartTouchSquare = this;
    this.classList.add('drag-start');
}

function crushTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (targetElement && targetElement.classList.contains('crush-square')) {
        if (crushEndTouchSquare && crushEndTouchSquare !== targetElement) {
            crushEndTouchSquare.style.opacity = 1;
        }
        crushEndTouchSquare = targetElement;
        crushEndTouchSquare.style.opacity = 0.7;
    }
}

function crushTouchEnd(e) {
    if (!crushStartTouchSquare) return;
    
    crushStartTouchSquare.classList.remove('drag-start');

    if (!crushEndTouchSquare) {
        crushStartTouchSquare = null;
        return;
    }

    crushEndTouchSquare.style.opacity = 1;

    crushEmojiBeingDragged = crushStartTouchSquare;
    crushEmojiBeingReplaced = crushEndTouchSquare;
    crushDragEnd(); // DragEnd məntiqini icra edin

    crushStartTouchSquare = null;
    crushEndTouchSquare = null;
}


// 3. Uyğunluqları Yoxlamaq (Match Checking)

function crushAddScore(count) {
    crushScore += count * 10;
    // Mövcud Memory Game'in Xal divi ilə qarışmasın deyə ID fərqlidir
    if (crushScoreDisplay) {
        crushScoreDisplay.innerHTML = crushScore;
    }
}

// Ard-arda 3 emojini yoxlamaq (Sətirlər üçün)
function crushCheckRowForThree() {
    let matchFound = false;
    for (let i = 0; i < crushSquareCount - 2; i++) {
        const isEndOfRow = [crushWidth - 3, crushWidth - 2, crushWidth - 1].includes(i % crushWidth);

        if (isEndOfRow) continue;

        const firstEmoji = crushSquares[i].innerHTML;
        const secondEmoji = crushSquares[i + 1].innerHTML;
        const thirdEmoji = crushSquares[i + 2].innerHTML;

        if (firstEmoji === secondEmoji && secondEmoji === thirdEmoji && !crushSquares[i].classList.contains('is-blank')) {
            // Patlama effekti
            crushSquares[i].classList.add('is-blank');
            crushSquares[i + 1].classList.add('is-blank');
            crushSquares[i + 2].classList.add('is-blank');
            crushAddScore(3);
            matchFound = true;
        }
    }
    return matchFound;
}

// Alt-alta 3 emojini yoxlamaq (Sütunlar üçün)
function crushCheckColumnForThree() {
    let matchFound = false;
    for (let i = 0; i < crushSquareCount - (crushWidth * 2); i++) {
        const firstEmoji = crushSquares[i].innerHTML;
        const secondEmoji = crushSquares[i + crushWidth].innerHTML;
        const thirdEmoji = crushSquares[i + crushWidth * 2].innerHTML;

        if (firstEmoji === secondEmoji && secondEmoji === thirdEmoji && !crushSquares[i].classList.contains('is-blank')) {
            // Patlama effekti
            crushSquares[i].classList.add('is-blank');
            crushSquares[i + crushWidth].classList.add('is-blank');
            crushSquares[i + crushWidth * 2].classList.add('is-blank');
            crushAddScore(3);
            matchFound = true;
        }
    }
    return matchFound;
}

// 4. Emojiləri Düşürmək və Yeni Emojiləri Yaratmaq

function crushMoveDown() {
    for (let i = 0; i < crushSquareCount - crushWidth; i++) {
        if (crushSquares[i + crushWidth].classList.contains('is-blank')) {
            crushSquares[i + crushWidth].innerHTML = crushSquares[i].innerHTML;
            crushSquares[i + crushWidth].classList.remove('is-blank');
            crushSquares[i].innerHTML = '';
            crushSquares[i].classList.add('is-blank');
        }
    }

    // Ən yuxarı sətirdəki boş yerləri yeni emojilərlə doldurun
    for (let i = 0; i < crushWidth; i++) {
        if (crushSquares[i].classList.contains('is-blank')) {
            let randomEmoji = Math.floor(Math.random() * crushEmojis.length);
            crushSquares[i].innerHTML = crushEmojis[randomEmoji];
            crushSquares[i].classList.remove('is-blank');
        }
    }
}

// 5. Oyun Dövrü (Game Loop)

function crushGameLoop() {
    crushMoveDown(); 
    
    let hasNewMatches = crushCheckRowForThree() || crushCheckColumnForThree();

    if (hasNewMatches) {
        setTimeout(crushGameLoop, 100);
    }
}


// Səhifə yüklənən kimi oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    crushCreateBoard();
    setInterval(crushGameLoop, 100);
});
