function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    // Giriş işlemleri
    console.log('Giriş: E-posta: ' + email + ', Şifre: ' + password);
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
