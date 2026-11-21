import { initNavigation, scrollToTop } from "./navigation.js";
import { initLaboratorio } from "./laboratorio.js";

initNavigation();
initLaboratorio();

document.querySelectorAll('[data-action="back-to-top"]').forEach((button) => {
  button.addEventListener("click", scrollToTop);
});
