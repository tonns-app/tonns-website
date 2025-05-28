document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    slidesPerView: "auto", // 👈 automatische Anzahl Karten
    spaceBetween: 16, // 👈 fixer Abstand in px
    centeredSlides: true, // 👉 optional true, wenn du mittige Karte willst
    initialSlide: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});
