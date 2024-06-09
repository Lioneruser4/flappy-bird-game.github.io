<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['message'])) {
    $message = $_POST['message'];
    $username = $_SESSION['username'];

    // Mesajları oku
    $messages = file_exists('messages.json') ? json_decode(file_get_contents('messages.json'), true) : [];

    // Yeni mesajı ekle
    $messages[] = ['username' => $username, 'message' => $message, 'created_at' => date('Y-m-d H:i:s')];
    file_put_contents('messages.json', json_encode($messages));
}

// Mesajları oku
$messages = file_exists('messages.json') ? json_decode(file_get_contents('messages.json'), true) : [];
?>

<!DOCTYPE html>
<html>
<head>
    <title>Forum</title>
</head>
<body>
    <h2>Welcome, <?php echo $_SESSION['username']; ?></h2>
    <form method="POST" action="">
        <label>Message:</label>
        <textarea name="message" required></textarea>
        <br>
        <input type="submit" value="Post">
    </form>

    <h3>Messages</h3>
    <?php
    foreach ($messages as $msg) {
        echo "<p><strong>" . htmlspecialchars($msg['username']) . ":</strong> " . htmlspecialchars($msg['message']) . "<br><small>" . $msg['created_at'] . "</small></p>";
    }
    ?>
</body>
</html>
