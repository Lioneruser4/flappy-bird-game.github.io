function register() {
    var username = document.getElementById('register-username').value;
    var password = document.getElementById('register-password').value;
    // Kayıt işlemleri
    console.log('Kayıt: Kullanıcı Adı: ' + username + ', Şifre: ' + password);
    // Kayıt olduktan sonra giriş formunu göster
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    // Giriş işlemleri
    console.log('Giriş: Kullanıcı Adı: ' + username + ', Şifre: ' + password);
    // Giriş yaptıktan sonra profil formunu göster
    document.getElementById('profile').style.display = 'block';
}

function logout() {
    // Çıkış işlemleri
    console.log('Çıkış Yapıldı');
    // Profil formunu gizle ve giriş formunu göster
    document.getElementById('profile').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}
