/* Navbar */
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header");
  const trigger = document.querySelector("#opener, .audience-hero");
  const checkbox = document.getElementById("openSidebarMenu");
  const mobileLinks = document.querySelectorAll("#sidebarMenu a");

  // Transparent nur über dem Hero; sonst weiße Navbar (sichtbar auf hellem Hintergrund)
  if (trigger) {
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
        rootMargin: "-80px 0px 0px 0px",
      }
    );
    observer.observe(trigger);
  } else {
    nav.classList.remove("transparent");
    nav.classList.add("scrolled");
  }

  // Mobile-Menü automatisch schließen bei Klick auf einen Link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      checkbox.checked = false;
    });
  });

  // Scroll-Reveals für Catcher & Sections
  const revealNodes = document.querySelectorAll(".reveal, .reveal-in");
  if (revealNodes.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );

    revealNodes.forEach((node, index) => {
      if (node.classList.contains("reveal-in")) {
        window.setTimeout(() => node.classList.add("is-visible"), 120 + index * 40);
      } else {
        revealObserver.observe(node);
      }
    });
  }
});



/* Accordion: nativer <details>-FAQ im Footer – optional nur eines offen */
document.addEventListener("DOMContentLoaded", () => {
  const faq = document.getElementById("faq");
  if (!faq) return;

  const items = faq.querySelectorAll("details.faq-item");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
});




