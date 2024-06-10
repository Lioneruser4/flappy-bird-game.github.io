function register() {
    var username = document.getElementById('register-username').value;
    var password = document.getElementById('register-password').value;
    // Burada kayıt işlemlerini yapabilirsiniz
    console.log('Kayıt: Kullanıcı Adı: ' + username + ', Şifre: ' + password);
}

function login() {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    // Burada giriş işlemlerini yapabilirsiniz
    console.log('Giriş: Kullanıcı Adı: ' + username + ', Şifre: ' + password);
}

function logout() {
    // Burada çıkış işlemlerini yapabilirsiniz
    console.log('Çıkış Yapıldı');
}
