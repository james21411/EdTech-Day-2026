// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Countdown Timer
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
        document.getElementById('countdown').innerHTML = '<div class="col-12"><h4 class="text-success">L\'événement a commencé !</h4></div>';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Scroll to registration function
function scrollToRegistration() {
    const registrationSection = document.getElementById('inscription');
    if (registrationSection) {
        window.scrollTo({
            top: registrationSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Form submission handlers
document.getElementById('expositionForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Demande de stand envoyée avec succès ! Nous vous contacterons dans les 48h.');
    bootstrap.Modal.getInstance(document.getElementById('expositionModal')).hide();
});

document.getElementById('hackathonForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Inscription au Hackathon envoyée avec succès !');
    bootstrap.Modal.getInstance(document.getElementById('hackathonModal')).hide();
});

document.getElementById('sponsorForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Demande de partenariat envoyée avec succès !');
    bootstrap.Modal.getInstance(document.getElementById('sponsorModal')).hide();
});

document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Message envoyé avec succès !');
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
});

// Ticket registration function
function registerTicket(type) {
    const ticketTypes = {
        'student': 'Étudiant (15 000 FCFA)',
        'professional': 'Professionnel (50 000 FCFA)',
        'company': 'Entreprise (200 000 FCFA)'
    };

    alert(`Inscription au forfait ${ticketTypes[type]} enregistrée ! Vous allez être redirigé vers la page de paiement.`);
    // In a real implementation, this would redirect to a payment page
}

// Language Translation Functions

// Toggle language switcher
function toggleLanguageSwitcher() {
    const switcher = document.getElementById('fallbackLanguageSwitcher');
    switcher.classList.toggle('show');
}

// Switch language (fallback function)
function switchLanguage(lang) {
    const notice = document.getElementById('translationNotice');
    notice.classList.add('show');

    // Update active language in switcher
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
    });

    if (lang === 'fr') {
        document.querySelector('.language-option:nth-child(1)').classList.add('active');
    } else {
        document.querySelector('.language-option:nth-child(2)').classList.add('active');
    }

    // Hide switcher after selection
    document.getElementById('fallbackLanguageSwitcher').classList.remove('show');

    // In a real implementation, this would trigger actual translation
    // For now, we just show the notice
}

// Hide translation notice
function hideTranslationNotice() {
    document.getElementById('translationNotice').classList.remove('show');
}

// Initialize Google Translate
window.onload = function () {
    // Check if Google Translate is loaded
    setTimeout(() => {
        const googleTranslateElement = document.querySelector('.goog-te-gadget');
        if (!googleTranslateElement) {
            // Google Translate failed to load, show fallback
            document.getElementById('fallbackLanguageSwitcher').classList.add('show');
        }
    }, 2000);

    // Show translation notice when page loads in a different language
    const currentLang = document.documentElement.lang;
    const browserLang = navigator.language || navigator.userLanguage;

    if (currentLang !== browserLang.substring(0, 2)) {
        setTimeout(() => {
            document.getElementById('translationNotice').classList.add('show');
        }, 3000);
    }
};

// Close language switcher when clicking outside
document.addEventListener('click', function (event) {
    const switcher = document.getElementById('fallbackLanguageSwitcher');
    const toggleBtn = document.querySelector('[onclick="toggleLanguageSwitcher()"]');

    if (switcher.classList.contains('show') &&
        !switcher.contains(event.target) &&
        !toggleBtn.contains(event.target)) {
        switcher.classList.remove('show');
    }
});

/* ==========================================
   LOGIQUE ÉDITION 2025
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Mapping des modales 2025
    const buttons2025 = document.querySelectorAll('.edition-2025 .actualite-card .btn-outline-primary');
    const modalIds2025 = [
        'modal-creation',
        'modal-debat-ia',
        'modal-debat-integration',
        'modal-demo-evaluation',
        'modal-demo-lecon',
        'modal-vainqueurs'
    ];

    buttons2025.forEach((button, index) => {
        if (index < modalIds2025.length) {
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', `#${modalIds2025[index]}`);
            // Empêcher le comportement par défaut du lien
            button.addEventListener('click', (e) => e.preventDefault());
        }
    });

    // Animation d'entrée pour les modales (appliquée à toutes pour la cohérence)
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            const modalContent = this.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.7)';
                modalContent.style.opacity = '0';

                setTimeout(() => {
                    modalContent.style.transition = 'all 0.3s ease';
                    modalContent.style.transform = 'scale(1)';
                    modalContent.style.opacity = '1';
                }, 10);
            }
        });
    });
    // Logic for "Voir plus d'actualités" button
    const btnShowMore = document.getElementById('btn-show-more-news');
    const extraNewsCards = document.querySelectorAll('.news-card-extra');

    if (btnShowMore) {
        btnShowMore.addEventListener('click', function () {
            let isHidden = true;

            extraNewsCards.forEach(card => {
                if (card.classList.contains('d-none')) {
                    card.classList.remove('d-none');
                    // Trigger AOS refresh for revealed cards
                    if (window.AOS) {
                        AOS.refresh();
                    }
                } else {
                    card.classList.add('d-none');
                    isHidden = false;
                }
            });

            // Update button text and icon
            if (isHidden) {
                this.innerHTML = '<i class="bi bi-dash-circle me-2"></i>Voir moins d\'actualités';
            } else {
                this.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Voir plus d\'actualités';
                // Scroll back up to the stats section or top of news if hiding
                document.getElementById('actualites').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});
