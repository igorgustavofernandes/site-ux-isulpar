export function scrollToTop() {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  window.scrollTo({ top: 0, behavior });
}

export function initNavigation() {
  const tabList = document.querySelector('[role="tablist"]');
  const skipLink = document.querySelector(".skip-link");

  if (!tabList) {
    return;
  }

  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));

  function updateSkipLink(selectedTab) {
    if (skipLink) {
      skipLink.href = `#${selectedTab.getAttribute("aria-controls")}`;
    }
  }

  function updateTabListOverflow() {
    const lastTab = tabs[tabs.length - 1];
    const tabListRect = tabList.getBoundingClientRect();
    const lastTabRect = lastTab.getBoundingClientRect();
    const visibleRight = tabListRect.left + tabList.clientLeft + tabList.clientWidth;
    const contentRight = lastTabRect.right + tabList.scrollLeft;

    tabList.classList.toggle(
      "menu-abas--rolavel",
      contentRight > visibleRight + 1
    );
  }

  function activateTab(selectedTab) {
    tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));

      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("ativo", selected);
      panel.hidden = !selected;
      panel.classList.toggle("ativa", selected);
    });

    updateSkipLink(selectedTab);
    scrollToTop();
  }

  const initiallySelectedTab = tabs.find(
    (tab) => tab.getAttribute("aria-selected") === "true"
  );

  if (initiallySelectedTab) {
    updateSkipLink(initiallySelectedTab);
  }

  updateTabListOverflow();
  window.addEventListener("resize", updateTabListOverflow);

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');

    if (tab && tabList.contains(tab)) {
      activateTab(tab);
    }
  });

  tabList.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(event.target);

    if (currentIndex === -1) {
      return;
    }

    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
}