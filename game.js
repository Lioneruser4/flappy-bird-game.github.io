var $inner = document.querySelector('.inner'),
    $spin = document.getElementById('spin'),
    $reset = document.getElementById('reset'),
    $data = document.querySelector('.data'),
    $mask = document.querySelector('.mask'),
    maskDefault = 'Place Your Bets',
    timer = 9000;

var red = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

$reset.style.display = 'none';
$mask.textContent = maskDefault;

$spin.addEventListener('click', function() {
    var randomNumber = Math.floor(Math.random() * 36),
        color = null;

    $inner.setAttribute('data-spinto', randomNumber);
    document.querySelector(`li:nth-child(${randomNumber + 1}) input`).checked = true;

    this.style.display = 'none';
    $reset.classList.add('disabled');
    $reset.disabled = true;
    $reset.style.display = 'inline-block';

    setTimeout(function() {
        $reset.classList.remove('disabled');
        $reset.disabled = false;
    }, timer);
});

$reset.addEventListener('click', function() {
    $inner.style.transform = 'rotate(0deg)';
    $mask.textContent = maskDefault;
    $spin.style.display = 'inline-block';
    this.style.display = 'none';
});
