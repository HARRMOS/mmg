// ═══════════════════════════════════════════════════
// MMG Nettoyage — interactions
// ═══════════════════════════════════════════════════

// ── Menu mobile ──────────────────────────────────
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

burger.addEventListener("click", () => {
  const ouvert = navMenu.classList.toggle("ouvert");
  burger.setAttribute("aria-expanded", ouvert);
});

navMenu.querySelectorAll("a").forEach((lien) =>
  lien.addEventListener("click", () => {
    navMenu.classList.remove("ouvert");
    burger.setAttribute("aria-expanded", "false");
  })
);

// ── Ombre de la barre de navigation au scroll ────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("ombre", window.scrollY > 10);
}, { passive: true });

// ── Apparitions au défilement (avec décalage) ────
const observateur = new IntersectionObserver(
  (entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add("visible");
        observateur.unobserve(entree.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  // léger décalage en cascade pour les éléments proches
  el.style.setProperty("--d", `${(i % 4) * 0.08}s`);
  observateur.observe(el);
});

// ── Parallaxe douce sur le visuel du héro ────────
const art = document.querySelector(".hero-art");
const arch = document.querySelector(".arch");
const tag = document.querySelector(".tag");

if (window.matchMedia("(pointer: fine)").matches && art) {
  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    const r = art.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    arch.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    tag.style.translate = `${dx * -14}px ${dy * -10}px`;
  });
}

// ── Services : menu interactif + panneau ─────────
const services = [
  {
    titre: "Nettoyage de bureaux & de maisons",
    desc: "Entretien régulier ou ponctuel de vos locaux professionnels et de votre domicile. Nous nous adaptons à vos horaires pour ne jamais gêner votre activité.",
    tags: ["Sols & surfaces", "Sanitaires", "Dépoussiérage", "Entretien régulier"],
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70",
  },
  {
    titre: "Lavage de vitres",
    desc: "Vitres, baies vitrées et vitrines impeccables, sans aucune trace. Laissez entrer la lumière, on s'occupe du reste — encadrements et rebords compris.",
    tags: ["Vitres & baies vitrées", "Vitrines", "Sans traces", "Encadrements"],
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70",
  },
  {
    titre: "Nettoyage après travaux",
    desc: "Poussières fines, résidus de plâtre, traces de peinture : nous effaçons toute trace du chantier pour ne laisser place qu'au résultat.",
    tags: ["Poussières fines", "Résidus de plâtre", "Traces de peinture", "Finitions"],
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=70",
  },
  {
    titre: "Nettoyage de fin de chantier",
    desc: "Remise en état complète avant livraison : un espace propre, net et accueillant, prêt à être occupé dès le premier jour.",
    tags: ["Remise en état", "Avant livraison", "Contrôle final", "Prêt à occuper"],
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=70",
  },
  {
    titre: "Désinfection & remise en état",
    desc: "Désinfection en profondeur des surfaces de contact et remise à neuf de vos locaux, pour un environnement sain et sécurisé.",
    tags: ["Surfaces de contact", "Produits professionnels", "Remise à neuf", "Espaces sains"],
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=70",
  },
];

// préchargement des images pour des transitions fluides
services.forEach((s) => { const im = new Image(); im.src = s.img; });

const items = document.querySelectorAll(".srv-item");
const panneau = document.getElementById("srvPanel");
const pImg = document.getElementById("srvImg");
const pTitre = document.getElementById("srvTitre");
const pDesc = document.getElementById("srvDesc");
const pTags = document.getElementById("srvTags");

let fonduTimer = null;

function remplirPanneau(i) {
  const s = services[i];
  pImg.src = s.img;
  pImg.alt = s.titre;
  pTitre.textContent = s.titre;
  pDesc.textContent = s.desc;
  pTags.innerHTML = s.tags.map((t) => `<li>${t}</li>`).join("");
}

function activerService(i, avecScroll = false) {
  items.forEach((b, j) => b.classList.toggle("actif", i === j));
  clearTimeout(fonduTimer);
  panneau.classList.add("fondu");
  fonduTimer = setTimeout(() => {
    remplirPanneau(i);
    panneau.classList.remove("fondu");
    if (avecScroll && window.innerWidth <= 980) {
      panneau.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, 220);
}

items.forEach((bouton, i) => {
  bouton.addEventListener("click", () => activerService(i, true));
  bouton.addEventListener("mouseenter", () => {
    if (window.matchMedia("(pointer: fine)").matches) activerService(i);
  });
});

// contenu initial, sans fondu
remplirPanneau(0);

// ── Formulaire : ouvre un e-mail pré-rempli ──────
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const email = document.getElementById("email").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  const sujet = encodeURIComponent(`Demande de devis — ${service}`);
  const corps = encodeURIComponent(
    `Bonjour,\n\nJe souhaite obtenir un devis gratuit.\n\n` +
      `Nom / Société : ${nom}\n` +
      `Téléphone : ${tel}\n` +
      (email ? `E-mail : ${email}\n` : "") +
      `Service souhaité : ${service}\n\n` +
      `Ma demande :\n${message}\n\n` +
      `Cordialement,\n${nom}`
  );

  window.location.href = `mailto:moussamagassa2001@gmail.com?subject=${sujet}&body=${corps}`;
});
