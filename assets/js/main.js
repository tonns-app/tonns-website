let currentIndex = 0;
let autoSwitchInterval;
const section = document.getElementById("service");
const breakpoint = 700; // Grenze für den Auto-Switch

/**
 * Wechselt die aktive Card mit sanftem Wechsel.
 * @param {number} index - Der Index der zu aktivierenden Card.
 */
function setActiveCard(index) {
  index = parseInt(index, 10);
  const cards = document.querySelectorAll(".description-container");
  const buttons = document.querySelectorAll("#service-descriptions-menu button");
  const image = document.getElementById("service-image");

  if (!cards[index]) {
    console.error(`Fehler: Die Card mit Index ${index} existiert nicht.`);
    return;
  }

  // **Alle Cards verstecken & Buttons zurücksetzen**
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

  if (newImageSrc) {
    image.src = newImageSrc;
    image.alt = newImageAlt;
  }

  // **Text für mobile Darstellung aktualisieren**
  updateTextForScreenSize();

  currentIndex = index;
}

/**
 * Startet den automatischen Wechsel der Cards, wenn die Bildschirmbreite > 700px ist.
 */
function startAutoSwitch() {
  stopAutoSwitch();

  if (window.innerWidth > breakpoint) {
    autoSwitchInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % document.querySelectorAll(".description-container").length;
      setActiveCard(currentIndex);
    }, 1500);
  }
}

/**
 * Stoppt den automatischen Wechsel.
 */
function stopAutoSwitch() {
  clearInterval(autoSwitchInterval);
}

/**
 * Beobachtet, ob die Sektion sichtbar ist & ob die Bildschirmgröße groß genug ist.
 */
function handleVisibility(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && window.innerWidth > breakpoint) {
      startAutoSwitch();
    } else {
      stopAutoSwitch();
    }
  });
}

// **Intersection Observer für Sichtbarkeit**
const observer = new IntersectionObserver(handleVisibility, { threshold: 0.5 });
observer.observe(section);

/**
 * Stoppt den Auto-Switch, wenn ein Nutzer eine Card anklickt.
 */
document.querySelectorAll("#service-descriptions-menu button").forEach((button, index) => {
  button.addEventListener("click", () => {
    stopAutoSwitch();
    setActiveCard(index);
  });
});

/**
 * Passt den Text je nach Bildschirmgröße an (normale vs. mobile Beschreibung).
 */
function updateTextForScreenSize() {
  const texts = document.querySelectorAll(".responsive-text");

  texts.forEach((text) => {
    const shortText = text.getAttribute("data-short");
    const fullText = text.getAttribute("data-full");

    // **Nur ändern, wenn beide Attribute vorhanden sind**
    if (shortText && fullText) {
      text.textContent = window.innerWidth <= 800 ? shortText : fullText;
    } else {
      console.warn("Fehlendes `data-short` oder `data-full` Attribut bei:", text);
    }
  });
}

/**
 * Debounce-Funktion für `resize`, um unnötige Berechnungen zu vermeiden.
 */
let resizeTimeout;
function debounceResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateTextForScreenSize();
    stopAutoSwitch(); // Stoppe den Auto-Switch, wenn das Fenster verkleinert wird
    startAutoSwitch(); // Überprüfe, ob der Auto-Switch neu gestartet werden kann
  }, 200);
}

// **Text-Update beim Laden & bei Änderung der Fenstergröße mit Debounce**
document.addEventListener("DOMContentLoaded", () => {
  setActiveCard(0);
  updateTextForScreenSize();
  startAutoSwitch();
});
window.addEventListener("resize", debounceResize);
