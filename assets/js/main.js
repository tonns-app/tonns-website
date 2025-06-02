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




