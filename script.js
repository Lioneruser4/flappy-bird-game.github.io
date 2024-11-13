document.addEventListener('DOMContentLoaded', (event) => {
    fetchCoinData();
});

function fetchCoinData() {
    const coin = document.getElementById('coin').value;
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCoinData(data);
            displayCoinGraph(data);
        })
        .catch(error => {
            console.error('Error fetching coin data:', error);
        });
}

function displayCoinData(data) {
    const coinData = document.getElementById('coinData');
    const coin = document.getElementById('coin').value;
    const price = data.prices[data.prices.length - 1][1];

    coinData.innerHTML = `<p>${coin} price: $${price}</p>`;

    checkPriceAlert(price);
}

function displayCoinGraph(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price in USD',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
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
