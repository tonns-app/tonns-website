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


/* Accordion-Funktionalität */
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#faq .faq-item");

  items.forEach((item, index) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      items.forEach((el, i) => {
        if (i === index) {
          el.classList.toggle("active");
        } else {
          el.classList.remove("active");
        }
      });
    });
  });
});

/* Kontakt Email */


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const inputs = form.querySelectorAll(".input");

  // pro Feld merken, ob es benutzt wurde
  const touchedMap = new WeakMap();

  inputs.forEach((input) => {
    touchedMap.set(input, false);

    input.addEventListener("input", () => {
      touchedMap.set(input, true);
      validateInput(input);
    });

    input.addEventListener("blur", () => {
      touchedMap.set(input, true);
      validateInput(input);
    });
  });

  function validateInput(input) {
    const isTouched = touchedMap.get(input);
    input.classList.remove("valid", "invalid");

    if (isTouched && input.value.trim() !== "") {
      if (input.checkValidity()) {
        input.classList.add("valid");
      } else {
        input.classList.add("invalid");
      }
    }
  }

  form.addEventListener("submit", (e) => {
    let valid = true;

    inputs.forEach((input) => {
      touchedMap.set(input, true);
      validateInput(input);

      if (!input.checkValidity()) {
        valid = false;
      }
    });

    if (!valid) e.preventDefault();
  });
});




