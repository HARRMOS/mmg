// ═══════════════════════════════════════════════════
// MMG Nettoyage — interactions
// ═══════════════════════════════════════════════════

// ── Thèmes ───────────────────────────────────────
const fontsLink = document.getElementById("themeFonts");
const themesBtn = document.getElementById("themesBtn");
const themesPanel = document.getElementById("themesPanel");
const themeBtns = document.querySelectorAll(".themes-list button");
const fontUrl = (q) => `https://fonts.googleapis.com/css2?${q}&display=swap`;

const applyTheme = (name) => {
  document.documentElement.dataset.theme = name;
  fontsLink.href = fontUrl(window.MMG_FONTS[name]);
  themeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === name)));
  try { localStorage.setItem("mmg-theme-v3", name); } catch (e) {}
};

themeBtns.forEach((b) => b.addEventListener("click", () => applyTheme(b.dataset.theme)));
themeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === document.documentElement.dataset.theme)));

// charge toutes les polices à la première ouverture, pour l'aperçu des noms
let previewLoaded = false;
const setPanel = (open) => {
  themesPanel.hidden = !open;
  themesBtn.setAttribute("aria-expanded", String(open));
  if (open && !previewLoaded) {
    previewLoaded = true;
    const all = document.createElement("link");
    all.rel = "stylesheet";
    all.href = fontUrl(Object.values(window.MMG_FONTS).join("&"));
    document.head.appendChild(all);
  }
};
themesBtn.addEventListener("click", () => setPanel(themesPanel.hidden));
document.addEventListener("click", (e) => {
  if (!document.getElementById("themes").contains(e.target)) setPanel(false);
});

// ── Menu mobile ──────────────────────────────────
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { setMenu(false); setPanel(false); }
});

// ── Lien actif dans le menu ──────────────────────
const links = [...menu.querySelectorAll('a[href^="#"]:not(.menu-devis)')];
const obs = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${en.target.id}`));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main > section").forEach((s) => obs.observe(s));

// ── Service → présélection dans le formulaire ────
const select = document.getElementById("service");
document.querySelectorAll("[data-service]").forEach((a) =>
  a.addEventListener("click", () => { select.value = a.dataset.service; })
);

// ── Formulaire : ouvre un e-mail pré-rempli ──────
const form = document.getElementById("contactForm");
const formErr = document.getElementById("formErr");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = document.getElementById("nom");
  const tel = document.getElementById("tel");
  const message = document.getElementById("message");
  const email = document.getElementById("email").value.trim();

  const required = [nom, tel, select, message];
  const missing = required.filter((f) => !f.value.trim());
  required.forEach((f) => f.classList.toggle("invalid", missing.includes(f)));
  if (missing.length) {
    formErr.textContent = "Merci de remplir les champs obligatoires (*).";
    missing[0].focus();
    return;
  }
  formErr.textContent = "";

  const sujet = encodeURIComponent(`Demande de devis — ${select.value}`);
  const corps = encodeURIComponent(
    `Bonjour,\n\nJe souhaite obtenir un devis gratuit.\n\n` +
      `Nom / Société : ${nom.value.trim()}\n` +
      `Téléphone : ${tel.value.trim()}\n` +
      (email ? `E-mail : ${email}\n` : "") +
      `Service souhaité : ${select.value}\n\n` +
      `Ma demande :\n${message.value.trim()}\n\n` +
      `Cordialement,\n${nom.value.trim()}`
  );
  window.location.href = `mailto:moussamagassa2001@gmail.com?subject=${sujet}&body=${corps}`;
});

form.querySelectorAll("input, select, textarea").forEach((f) =>
  f.addEventListener("input", () => f.classList.remove("invalid"))
);
