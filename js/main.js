import { initNavigation, scrollToTop } from "./navigation.js";

initNavigation();

document.querySelectorAll('[data-action="back-to-top"]').forEach((button) => {
  button.addEventListener("click", scrollToTop);
});
