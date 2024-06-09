<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Kullanıcı verilerini oku
    $users = file_exists('users.json') ? json_decode(file_get_contents('users.json'), true) : [];
    
    foreach ($users as $user) {
        if ($user['username'] == $username && password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            header("Location: forum.php");
            exit();
        }
    }
    
    echo "Geçersiz kullanıcı adı veya şifre.";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    <form method="POST" action="">
        <label>Username:</label>
        <input type="text" name="username" required>
        <br>
        <label>Password:</label>
        <input type="password" name="password" required>
        <br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
