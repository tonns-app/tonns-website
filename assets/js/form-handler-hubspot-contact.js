document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-text");
    const checkbox = document.getElementById("agree-checkbox-contact");

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const isCheckboxChecked = checkbox.checked;

    const isEmailValid = emailInput.checkValidity(); // nutze native Validierung
    const isMessageValid = message.length > 0;

    // Debug-Ausgaben
    console.log("📧 E-Mail:", email, "| Valid:", isEmailValid);
    console.log("💬 Nachricht:", message, "| Vorhanden:", isMessageValid);
    console.log("☑️ Checkbox:", isCheckboxChecked);

    if (isEmailValid && isMessageValid && isCheckboxChecked) {
      console.log("✅ gesendet");
    } else {
      console.warn("❌ Formular nicht vollständig oder fehlerhaft.");
    }
  });
});
