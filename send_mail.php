<?php
$recipient = 'info@tonns.app'; // Deine Zieladresse

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
    $body = "Neue Nachricht über das Kontaktformular:\n\n";
    $body .= "Absender-E-Mail: $sender\n\n";
    $body .= "Nachricht:\n$message";

    $headers = "From: kontaktformular\r\n";
    $headers .= "Reply-To: $sender\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

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
