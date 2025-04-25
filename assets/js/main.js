let currentIndex = 0;
let autoSwitchInterval;
const section = document.getElementById("service");
const breakpoint = 700; // Grenze für Auto-Switch

/**
 * Aktiviert die richtige Card oder zeigt alle Cards unter 700px.
 * @param {number} index - Der Index der zu aktivierenden Card.
 */
function setActiveCard(index) {
  index = parseInt(index, 10);
  const cards = document.querySelectorAll(".description-container");
  const buttons = document.querySelectorAll("#service-descriptions-menu button");
  const image = document.getElementById("service-image");

  // **Unter 700px: Alle Cards anzeigen & Auto-Switch stoppen**
  if (window.innerWidth <= breakpoint) {
    cards.forEach((card) => {
      card.classList.remove("hidden");
      card.classList.add("active");
    });
    buttons.forEach((button) => button.classList.add("button-disable"));
    return;
  }

  if (!cards[index]) {
    console.error(`Fehler: Die Card mit Index ${index} existiert nicht.`);
    return;
  }

  // **Über 700px: Alle Cards verstecken & Buttons zurücksetzen**
  cards.forEach((card) => {
    card.classList.remove("active");
    card.classList.add("hidden");
  });
  buttons.forEach((button) => button.classList.add("button-disable"));

  // **Neue Card aktivieren**
  const newCard = cards[index];
  newCard.classList.remove("hidden");
  newCard.classList.add("active");
  buttons[index].classList.remove("button-disable");

  // **Bild aktualisieren**
  const newImageSrc = newCard.dataset.image;
  const newImageAlt = newCard.dataset.title || "Service Bild";

  if (newImageSrc && image) {
    image.src = newImageSrc;
    image.alt = newImageAlt;
  }

  updateTextForScreenSize();
  currentIndex = index;
}


/**
 * Passt den Text je nach Bildschirmgröße an:
 * - `<= 700px`: Alle Cards werden untereinander angezeigt.
 * - `700px - 850px`: Zeigt `shortText`.
 * - `> 850px`: Zeigt `fullText`.
 */
function updateTextForScreenSize() {
  const texts = document.querySelectorAll(".responsive-text");

  texts.forEach((text) => {
    const shortText = text.getAttribute("data-short");
    const fullText = text.getAttribute("data-full");

    if (shortText && fullText) {
      if (window.innerWidth <= 700) {
        // **Unter 700px werden alle Cards gestapelt**
        text.textContent = fullText;
      } else if (window.innerWidth > 700 && window.innerWidth <= 850) {
        // **Zwischen 700px und 850px wird der `shortText` verwendet**
        text.textContent = shortText;
      } else {
        // **Über 850px wird `fullText` angezeigt**
        text.textContent = fullText;
      }
    } else {
      console.warn("Fehlendes `data-short` oder `data-full` Attribut bei:", text);
    }
  });
}

// **Initialisierung beim Laden & Resize**
document.addEventListener("DOMContentLoaded", () => {
  updateTextForScreenSize();
});
