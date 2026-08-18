(function () {
  const choices = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const labels = { atlas: "蓝图计划", paper: "纸上工地", night: "夜间专注" };
  const themeMeta = { atlas: "#155eef", paper: "#b84f31", night: "#39c58b" };
  const saved = localStorage.getItem("ejian.theme");
  const queryTheme = new URLSearchParams(location.search).get("theme");
  const initial = Object.prototype.hasOwnProperty.call(labels, queryTheme) ? queryTheme : (Object.prototype.hasOwnProperty.call(labels, saved) ? saved : "atlas");

  function applyTheme(theme, persist) {
    document.body.dataset.theme = theme;
    if (persist !== false) localStorage.setItem("ejian.theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeMeta[theme]);
    choices.forEach((button) => {
      const active = button.dataset.themeChoice === theme;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const status = document.getElementById("design-status");
    if (status) status.textContent = "当前方案：" + labels[theme];
  }

  choices.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
  });
  applyTheme(initial, false);
})();
