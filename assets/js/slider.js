const swiperInstances = {};

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

  // Vorherige Instanz zerstören
  if (swiperInstances[scopeSelector]) {
    swiperInstances[scopeSelector].destroy(true, true);
  }

    const instance = new window.Swiper(container, {
    slidesPerView: "auto",
    spaceBetween: 24,
    centeredSlides: true,
    parallax: true,
    speed: 2000,
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

  swiperInstances[scopeSelector] = instance;
}

function initAllSwipers() {
  const screenStartIndex = window.innerWidth < 1280 ? 0 : 1;

  initSwiperForSection("#customers", screenStartIndex);
  initSwiperForSection("#workflow", screenStartIndex);
  initSwiperForSection("#city", screenStartIndex);
}

// Debounce für Resize-Event
function debounce(fn, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

window.addEventListener("load", initAllSwipers);
window.addEventListener("resize", debounce(initAllSwipers, 200));
