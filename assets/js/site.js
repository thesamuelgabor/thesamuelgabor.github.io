/* Shared behaviour: theme toggle, header state, scroll reveal, current-section nav. */
(() => {
  const root = document.documentElement;
  const store = {
    get() { try { return localStorage.getItem("theme"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("theme", v); } catch (e) {} },
  };

  // Theme toggle
  const btn = document.querySelector(".theme-btn");
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const label = () => btn && btn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  if (btn) {
    label();
    btn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      const apply = () => { root.dataset.theme = next; store.set(next); label(); };
      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(apply);
      } else apply();
    });
  }

  // Header hairline once the page has scrolled
  const head = document.querySelector(".site-head");
  if (head) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => head.classList.toggle("scrolled", !e.isIntersecting)).observe(sentinel);
  }

  // Scroll reveal
  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  // Highlight the nav link for the section in view (home page only)
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const seen = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const current = sections.find((s) => seen.get(s.id));
      links.forEach((a) => a.removeAttribute("aria-current"));
      if (current) map.get(current.id).setAttribute("aria-current", "location");
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // Start the hero entrance once fonts are ready (or after a short cap), so nothing jumps
  const go = () => requestAnimationFrame(() => root.classList.add("ready"));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]).then(go);
  } else go();
})();
