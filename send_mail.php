<?php
$recipient = 'contact@ricki-weigel.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sender = isset($_POST['sender']) ? trim($_POST['sender']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if (empty($sender) || empty($message)) {
        http_response_code(400);
        echo "Bitte fülle alle Felder korrekt aus.";
        exit;
    }

    if (!filter_var($sender, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Ungültige E-Mail-Adresse.";
        exit;
    }

    $subject = "Kontaktanfrage von tonns.app";
    $headers = "From: $sender\r\nReply-To: $sender\r\n";
    $body = "Nachricht von: $sender\n\n" . htmlspecialchars($message);

    if (mail($recipient, $subject, $body, $headers)) {
        echo "E-Mail erfolgreich gesendet.";
    } else {
        http_response_code(500);
        echo "Fehler beim Senden der E-Mail.";
    }
} else {
    http_response_code(405);
    echo "Nur POST erlaubt.";
}
