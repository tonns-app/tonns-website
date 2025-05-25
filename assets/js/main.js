const breakpoint = 700; // Grenze für Auto-Switch

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



/* Navbar */
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header");
  const trigger = document.querySelector("#opener");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        nav.classList.add("transparent");
        nav.classList.remove("scrolled");
      } else {
        nav.classList.remove("transparent");
        nav.classList.add("scrolled");
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px 0px 0px 0px" // frühzeitiges Auslösen oberhalb der Navbar
    }
  );

  observer.observe(trigger);
});



