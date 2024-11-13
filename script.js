document.addEventListener('DOMContentLoaded', (event) => {
    fetchCoinData();
});

function fetchCoinData() {
    const coin = document.getElementById('coin').value;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCoinData(data);
        })
        .catch(error => {
            console.error('Error fetching coin data:', error);
        });
}

function displayCoinData(data) {
    const coinData = document.getElementById('coinData');
    const coin = document.getElementById('coin').value;
    const price = data[coin.toLowerCase()].usd;
    
    coinData.innerHTML = `<p>${coin} price: $${price}</p>`;

    checkPriceAlert(price);
}

function setPriceAlert() {
    const priceAlert = document.getElementById('priceAlert').value;
    localStorage.setItem('priceAlert', priceAlert);
    alert(`Price alert set at $${priceAlert}`);
}

function checkPriceAlert(currentPrice) {
    const priceAlert = localStorage.getItem('priceAlert');
    if (priceAlert && currentPrice <= priceAlert) {
        alert(`Price alert: ${currentPrice} is now at or below your set price of ${priceAlert}`);
        localStorage.removeItem('priceAlert'); // Alertten sonra temizler
    }
}
