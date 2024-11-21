document.addEventListener('DOMContentLoaded', function() {
    const weatherDiv = document.getElementById('weather');

    // Örnek bir site URL'si
    const weatherUrl = 'https://example.com/weather/baku'; // Gerçek bir hava durumu sitesi kullanmalısınız

    fetch(weatherUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Örnek veri alma (siteye bağlı olarak değişiklik gösterebilir)
            const temperature = doc.querySelector('.temperature').innerText;
            const description = doc.querySelector('.description').innerText;

            weatherDiv.innerHTML = `
                <h2>Weather in Baku</h2>
                <p>Temperature: ${temperature}</p>
                <p>Weather: ${description}</p>
            `;
        })
        .catch(error => {
            weatherDiv.innerHTML = `<p>Could not retrieve weather data.</p>`;
            console.error('Error fetching weather data:', error);
        });
});
