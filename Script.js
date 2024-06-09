const player = document.getElementById('player');

document.addEventListener('keydown', (event) => {
  const key = event.key;
  const step = 10;

  switch (key) {
    case 'ArrowUp':
      player.style.top = `${parseFloat(player.style.top) - step}px`;
      break;
    case 'ArrowDown':
      player.style.top = `${parseFloat(player.style.top) + step}px`;
      break;
    case 'ArrowLeft':
      player.style.left = `${parseFloat(player.style.left) - step}px`;
      break;
    case 'ArrowRight':
      player.style.left = `${parseFloat(player.style.left) + step}px`;
      break;
  }
});
