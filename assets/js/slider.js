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

  if (swiperInstances[scopeSelector]) {
    swiperInstances[scopeSelector].destroy(true, true);
  }

  const instance = new window.Swiper(container, {
    slidesPerView: "auto",
    spaceBetween: 24,
    centeredSlides: true,
    parallax: true,
    speed: 1000,
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

function initCityCarousel() {
  const container = document.querySelector("#city-carousel");
  if (!container || typeof window.Swiper !== "function") return;

  const pagination = container.querySelector(".swiper-pagination");
  const key = "#city-carousel";

  if (swiperInstances[key]) {
    swiperInstances[key].destroy(true, true);
  }

  const instance = new window.Swiper(container, {
    slidesPerView: 1.15,
    spaceBetween: 14,
    centeredSlides: false,
    loop: true,
    loopAdditionalSlides: 3,
    speed: 900,
    grabCursor: true,
    watchOverflow: false,
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: pagination
      ? {
          el: pagination,
          clickable: true,
        }
      : undefined,
    breakpoints: {
      640: {
        slidesPerView: 2.1,
        spaceBetween: 16,
      },
      960: {
        slidesPerView: 3.1,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 3.4,
        spaceBetween: 22,
      },
    },
  });

  swiperInstances[key] = instance;

  // Autoplay nach Init aktiv erzwingen (hilft bei Lazy-Reveal / späten Layouts)
  if (instance.autoplay) {
    instance.autoplay.start();
  }
}

function initAllSwipers() {
  const screenStartIndex = window.innerWidth < 1280 ? 0 : 1;

  initSwiperForSection("#customers", screenStartIndex);
  initSwiperForSection("#workflow", screenStartIndex);
  initCityCarousel();
}

function debounce(fn, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

window.addEventListener("load", initAllSwipers);
window.addEventListener("resize", debounce(() => {
  // City-Carousel nicht bei jedem Resize neu bauen (unterbricht Autoplay)
  const screenStartIndex = window.innerWidth < 1280 ? 0 : 1;
  initSwiperForSection("#customers", screenStartIndex);
  initSwiperForSection("#workflow", screenStartIndex);
}, 200));
