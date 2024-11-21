document.addEventListener('DOMContentLoaded', function() {
    // Hava Durumu Bilgileri
    const weatherDiv = document.getElementById('weather');
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

    // Çerezleri Temizleme
    document.cookie.split(";").forEach((c) => {
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    });

    // Yerel Depolamayı Temizleme
    localStorage.clear();
    sessionStorage.clear();
});

// Reklam İzle Butonu
function openAd() {
    window.open("https://www.profitablecpmrate.com/egfxjt4z5?key=d21222c51bdd4afd5a0ecf97c6716982", '_blank', 'noreferrer,noopener');
}
