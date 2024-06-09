// Kayıt olma işlevselliği
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Kullanıcı oluşturma başarılı
        var user = userCredential.user;
        console.log("Kullanıcı oluşturuldu:", user);
        // Kullanıcı adını kaydetme
        user.updateProfile({
            displayName: username
        }).then(() => {
            console.log("Kullanıcı adı güncellendi:", username);
        }).catch((error) => {
            console.error("Kullanıcı adı güncellenirken hata oluştu:", error);
        });
    })
    .catch((error) => {
        // Hata durumunda
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error("Kayıt olma sırasında bir hata oluştu:", errorMessage);
    });
});
// Kayıt olma işlevselliği
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Kullanıcı oluşturma başarılı
        var user = userCredential.user;
        console.log("Kullanıcı oluşturuldu:", user);
        // Kullanıcı adını kaydetme
        user.updateProfile({
            displayName: username
        }).then(() => {
            console.log("Kullanıcı adı güncellendi:", username);
        }).catch((error) => {
            console.error("Kullanıcı adı güncellenirken hata oluştu:", error);
        });
    })
    .catch((error) => {
        // Hata durumunda
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error("Kayıt olma sırasında bir hata oluştu:", errorMessage);
    });
});
