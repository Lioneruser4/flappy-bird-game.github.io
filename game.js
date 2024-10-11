document.getElementById("spin-button").addEventListener("click", function() {
    const resultDiv = document.getElementById("result");
    const outcomes = ["Kazandınız!", "Kaybettiniz!", "Tekrar Deneyin!"];
    
    // Rastgele bir sonuç seç
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    const result = outcomes[randomIndex];
    
    // Sonucu ekrana yazdır
    resultDiv.textContent = result;
});
