// ============================================================
//  MOTEUR I18N OFFLINE - EdTech Day Yaoundé 2026
//  Gère le changement de langue FR ↔ EN sans connexion internet
//  Les textes sont chargés depuis js/fr.js et js/en.js
// ============================================================

// ── 1. ÉTAT DE LA LANGUE ─────────────────────────────────────
let currentLang = localStorage.getItem('edtech_lang') || 'fr';

// ── 2. FONCTION DE TRADUCTION ────────────────────────────────
function t(key) {
    const dict = currentLang === 'en' ? TRANSLATIONS_EN : TRANSLATIONS_FR;
    return dict[key] || key;
}

// ── 3. APPLIQUER LES TRADUCTIONS ─────────────────────────────
function applyTranslations() {
    // Mettre à jour la langue du document
    document.documentElement.lang = currentLang;
    document.title = t('page.title');

    // Mettre à jour tous les éléments avec data-i18n (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = t(key);
    });

    // Mettre à jour les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Mettre à jour les titres (title attribute)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.getAttribute('data-i18n-title'));
    });

    // Mettre à jour le bouton actif dans le switcher
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.remove('active');
    });
    const activeOpt = document.querySelector(`.language-option[data-lang="${currentLang}"]`);
    if (activeOpt) activeOpt.classList.add('active');

    // Mettre à jour le bouton countdown si événement démarré
    const cdEl = document.getElementById('countdown');
    if (cdEl && cdEl.querySelector('.text-success')) {
        cdEl.innerHTML = `<div class="col-12"><h4 class="text-success">${t('countdown.started')}</h4></div>`;
    }

    // Mettre à jour le texte du bouton "voir plus"
    const btnMore = document.getElementById('btn-show-more-news');
    if (btnMore) {
        const isExpanded = !document.querySelector('.news-card-extra.d-none');
        btnMore.innerHTML = isExpanded
            ? `<i class="bi bi-dash-circle me-2"></i>${t('actu.less.btn')}`
            : `<i class="bi bi-plus-circle me-2"></i>${t('actu.more.btn')}`;
    }
}

// ── 4. CHANGER DE LANGUE ──────────────────────────────────────
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('edtech_lang', lang);
    applyTranslations();

    // Fermer le panneau switcher
    document.getElementById('fallbackLanguageSwitcher').classList.remove('show');
}

// ── 5. TOGGLE DU PANNEAU ──────────────────────────────────────
function toggleLanguageSwitcher() {
    document.getElementById('fallbackLanguageSwitcher').classList.toggle('show');
}

// Cacher la notice de traduction
function hideTranslationNotice() {
    document.getElementById('translationNotice')?.classList.remove('show');
}

// ── 6. COUNTDOWN ─────────────────────────────────────────────
function updateCountdown() {
    const eventDate = new Date('June 8, 2026 09:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('countdown').innerHTML =
            `<div class="col-12"><h4 class="text-success">${t('countdown.started')}</h4></div>`;
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ── 7. SCROLL FLUIDE ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// ── 8. NAV ACTIVE AU SCROLL ───────────────────────────────────
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.clientHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
});

// ── 9. SCROLL VERS INSCRIPTION ───────────────────────────────
function scrollToRegistration() {
    const el = document.getElementById('inscription');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
}

// ── 10. TICKETS ───────────────────────────────────────────────
function registerTicket(type) {
    const keys = {
        'student': 'ticket.alert.student',
        'professional': 'ticket.alert.professional',
        'company': 'ticket.alert.company'
    };
    const typeLabel = t(keys[type]);
    const msg = t('ticket.alert.msg').replace('{type}', typeLabel);
    alert(msg);
}

// ── 11. FERMER LE SWITCHER EN CLIQUANT AILLEURS ───────────────
document.addEventListener('click', function (event) {
    const switcher = document.getElementById('fallbackLanguageSwitcher');
    if (!switcher || !switcher.classList.contains('show')) return;

    // Il peut y avoir plusieurs boutons FR/EN (mobile + desktop)
    const toggleBtns = document.querySelectorAll('[onclick="toggleLanguageSwitcher()"]');
    const clickedAToggle = Array.from(toggleBtns).some(btn => btn.contains(event.target));

    // Fermer seulement si le clic est en dehors du panneau ET en dehors de tous les boutons
    if (!switcher.contains(event.target) && !clickedAToggle) {
        switcher.classList.remove('show');
    }
});

// ── 12. DOMCONTENTLOADED ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Initialiser AOS
    AOS.init({ duration: 800, once: true, offset: 100 });

    // Appliquer les traductions au chargement
    applyTranslations();

    // Formulaires
    document.getElementById('expositionForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('modal.expo.alert'));
        bootstrap.Modal.getInstance(document.getElementById('expositionModal'))?.hide();
    });

    document.getElementById('hackathonForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('modal.hack.alert'));
        bootstrap.Modal.getInstance(document.getElementById('hackathonModal'))?.hide();
    });

    document.getElementById('sponsorForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('modal.sponsor.alert'));
        bootstrap.Modal.getInstance(document.getElementById('sponsorModal'))?.hide();
    });

    document.getElementById('contactForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('modal.contact.alert'));
        bootstrap.Modal.getInstance(document.getElementById('contactModal'))?.hide();
    });

    // Animations modales
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            const content = this.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(0.7)';
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'all 0.3s ease';
                    content.style.transform = 'scale(1)';
                    content.style.opacity = '1';
                }, 10);
            }
        });
    });

    // Bouton "Voir plus d'actualités"
    const btnShowMore = document.getElementById('btn-show-more-news');
    const extraCards = document.querySelectorAll('.news-card-extra');

    if (btnShowMore) {
        btnShowMore.addEventListener('click', function () {
            let isHidden = true;
            extraCards.forEach(card => {
                if (card.classList.contains('d-none')) {
                    card.classList.remove('d-none');
                    if (window.AOS) AOS.refresh();
                } else {
                    card.classList.add('d-none');
                    isHidden = false;
                }
            });
            this.innerHTML = isHidden
                ? `<i class="bi bi-dash-circle me-2"></i>${t('actu.less.btn')}`
                : `<i class="bi bi-plus-circle me-2"></i>${t('actu.more.btn')}`;

            if (!isHidden) {
                document.getElementById('actualites')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mapping modales 2025
    const buttons2025 = document.querySelectorAll('.edition-2025 .actualite-card .btn-outline-primary');
    const modalIds2025 = [
        'modal-creation', 'modal-debat-ia', 'modal-debat-integration',
        'modal-demo-evaluation', 'modal-demo-lecon', 'modal-vainqueurs'
    ];
    buttons2025.forEach((button, index) => {
        if (index < modalIds2025.length) {
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', `#${modalIds2025[index]}`);
            button.addEventListener('click', e => e.preventDefault());
        }
    });
});
