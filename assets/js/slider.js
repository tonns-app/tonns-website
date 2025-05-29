function equalizeCardHeights(scopeSelector) {
  const cards = document.querySelectorAll(`${scopeSelector} .swiper-slide .card`);
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.height = "auto";
  });

  const maxHeight = Math.max(...Array.from(cards).map((card) => card.offsetHeight));
  cards.forEach((card) => {
    card.style.height = `${maxHeight}px`;
  });
}

function observeCardVisibility(scopeSelector) {
  const cards = document.querySelectorAll(`${scopeSelector} .swiper-slide .card`);
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: document.querySelector(`${scopeSelector} .swiper`),
      threshold: 0.5,
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function initSwiperForSection(scopeSelector, initialSlideIndex = 0) {
  const container = document.querySelector(`${scopeSelector} .swiper`);
  const pagination = document.querySelector(`${scopeSelector} .swiper-pagination`);

  if (!container || !pagination) return;

  const swiperInstance = new window.Swiper(container, {
    slidesPerView: "auto",
    spaceBetween: 24,
    centeredSlides: true,
    parallax: true,
    initialSlide: initialSlideIndex,
    pagination: {
      el: pagination,
      clickable: true,
    },
    on: {
      init: () => {
        equalizeCardHeights(scopeSelector);
        observeCardVisibility(scopeSelector);
      },
      resize: () => {
        equalizeCardHeights(scopeSelector);
      },
    },
  });

  return swiperInstance;
}

function initAllSwipers() {
  const screenStartIndex = window.innerWidth < 1280 ? 0 : 1;

  // Initialisiere Swiper für alle Sektionen individuell
  initSwiperForSection("#customers", screenStartIndex);
  initSwiperForSection("#workflow", screenStartIndex);

}

window.addEventListener("load", initAllSwipers);
window.addEventListener("resize", initAllSwipers);
