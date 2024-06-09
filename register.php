<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    
    // Kullanıcı verilerini oku
    $users = file_exists('users.json') ? json_decode(file_get_contents('users.json'), true) : [];
    
    // Kullanıcı adı kontrolü
    foreach ($users as $user) {
        if ($user['username'] == $username) {
            echo "Bu kullanıcı adı zaten kullanılıyor.";
            exit();
        }
    }
    
    // Yeni kullanıcıyı ekle
    $users[] = ['username' => $username, 'password' => $password];
    file_put_contents('users.json', json_encode($users));
    
    echo "Kayıt başarılı!";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>
    <form method="POST" action="">
        <label>Username:</label>
        <input type="text" name="username" required>
        <br>
        <label>Password:</label>
        <input type="password" name="password" required>
        <br>
        <input type="submit" value="Register">
    </form>
</body>
</html>
