function setActiveCard(index) {
  let buttons = document.querySelectorAll("#service-descriptions-menu button");

  // Alle Buttons deaktivieren (button-disable setzen)
  buttons.forEach((button) => button.classList.add("button-disable"));

  // Nur der aktive Button bleibt ohne "button-disable"
  buttons[index].classList.remove("button-disable");
}

// Standardmäßig den ersten Button aktiv setzen
document.addEventListener("DOMContentLoaded", function () {
  setActiveCard(0);
});
