let lastScrollTop = 0;
const header = document.querySelector("header");
const offset = 100;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > offset) {
    if (currentScroll > lastScrollTop) {
      header.classList.add("hidden-navbar");
    } else {
      header.classList.remove("hidden-navbar");
    }
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
