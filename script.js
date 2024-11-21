document.addEventListener('DOMContentLoaded', function() {
    const weatherDiv = document.getElementById('weather');

    // Sabit hava durumu verileri
    const weatherData = {
        city: 'Baku',
        temperature: '15',
        description: 'Clear sky',
        country: 'Azerbaijan'
    };

    weatherDiv.innerHTML = `
        <h2>Weather in ${weatherData.city}, ${weatherData.country}</h2>
        <p>Temperature: ${weatherData.temperature} °C</p>
        <p>Weather: ${weatherData.description}</p>
    `;
});
