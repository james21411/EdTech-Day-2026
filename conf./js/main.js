// Main JavaScript file for Conference Website - VERSION DEBUG

// Define data at the beginning
const conferenceData = {
    "title": "Conférence Internationale sur les Avancées en Informatique et Technologies Éducatives",
    "subtitle": "Pour le Développement Durable",
    "dates": "08-10 Juin 2026",
    "location": "Université de Yaoundé I, Yaoundé, Cameroun",
    "theme": "Innover dans le domaine de l'informatique et des technologies éducatives pour un avenir durable",
    "organizers": {
        "lite": "Laboratoire d'Informatique et des Technologies Éducatives",
        "scnef": "Société Camerounaise du Numérique pour l'Éducation et la Formation"
    },
    "registrationDeadline": "2026-05-15",
    "submissionDeadline": "2026-03-01"
};

// Countdown timer
function updateCountdown() {
    const conferenceDate = new Date("2026-06-08T09:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = conferenceDate - now;
    
    // Get DOM elements
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, "0");
        hoursElement.textContent = hours.toString().padStart(2, "0");
        minutesElement.textContent = minutes.toString().padStart(2, "0");
        secondsElement.textContent = seconds.toString().padStart(2, "0");
    } else {
        document.getElementById("countdown").innerHTML = "<div class='col-12'><h4>La conférence a commencé !</h4></div>";
    }
}

// Initialize countdown when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Wait a bit to ensure everything is loaded
    setTimeout(() => {
        updateCountdown(); // Initial call
        setInterval(updateCountdown, 1000); // Update every second
    }, 100);
});

// DEBUG: Fonction pour logger les messages
function debugLog(message) {
    console.log('🔍 DEBUG:', message);
    const logDiv = document.getElementById('debug-log');
    if (logDiv) {
        const timestamp = new Date().toLocaleTimeString();
        logDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: "smooth"
            });
        }
    });
});

// Scroll to registration function
function scrollToRegistration() {
    const registrationSection = document.getElementById("inscription");
    if (registrationSection) {
        window.scrollTo({
            top: registrationSection.offsetTop - 70,
            behavior: "smooth"
        });
    }
}

// Registration form handling
document.getElementById("registrationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        institution: document.getElementById("institution").value,
        category: document.getElementById("category").value,
        days: [],
        comments: document.getElementById("comments").value,
        terms: document.getElementById("terms").checked
    };
    
    // Collect selected days
    if (document.getElementById("day1Check").checked) formData.days.push("day1");
    if (document.getElementById("day2Check").checked) formData.days.push("day2");
    if (document.getElementById("day3Check").checked) formData.days.push("day3");
    
    // Validate form
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    // Submit form data
    submitRegistration(formData);
});

// Form validation
function validateRegistrationForm(data) {
    const errors = [];
    
    if (!data.firstName.trim()) {
        errors.push("Le prénom est requis");
    }
    
    if (!data.lastName.trim()) {
        errors.push("Le nom est requis");
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push("L'email est invalide");
    }
    
    if (!data.institution.trim()) {
        errors.push("L'institution est requise");
    }
    
    if (!data.category) {
        errors.push("Veuillez sélectionner une catégorie");
    }
    
    if (data.days.length === 0) {
        errors.push("Veuillez sélectionner au moins un jour de participation");
    }
    
    if (!data.terms) {
        errors.push("Vous devez accepter les conditions générales");
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form errors
function showFormErrors(errors) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "alert alert-danger";
    errorContainer.innerHTML = "<strong>Erreurs de validation :</strong><ul>" + 
        errors.map(error => `<li>${error}</li>`).join("") + 
        "</ul>";
    
    const form = document.getElementById("registrationForm");
    form.parentNode.insertBefore(errorContainer, form);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

// Submit registration data
function submitRegistration(data) {
    // Show loading state
    const submitBtn = document.querySelector("#registrationForm button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Envoi en cours...";
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, this would be an actual API call
        console.log("Registration data:", data);
        
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className = "alert alert-success";
        successMessage.innerHTML = "<strong>Inscription réussie !</strong><br>Merci de vous être inscrit à la conférence. Vous recevrez un email de confirmation sous peu.";
        
        const form = document.getElementById("registrationForm");
        form.parentNode.insertBefore(successMessage, form);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
        
    }, 2000);
}

// Admin login functionality - VERSION DEBUG
document.getElementById("adminLoginBtn").addEventListener("click", function() {
    debugLog('🎯 Admin login button clicked!');
    
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    
    debugLog(`👤 Username: ${username}`);
    debugLog(`🔑 Password: ${password}`);
    
    if (!username || !password) {
        debugLog('❌ Username or password missing');
        showAdminError("Veuillez saisir un nom d'utilisateur et un mot de passe");
        return;
    }
    
    debugLog('🔄 Calling authenticateAdmin...');
    // Call the API authentication function
    authenticateAdmin(username, password);
});

// Admin authentication - uses API integration
function authenticateAdmin(username, password) {
    debugLog('📡 authenticateAdmin called with:', { username, password });
    
    // Call the real API authentication function from api-integration.js
    if (typeof authenticateAdminAPI === 'function') {
        debugLog('✅ authenticateAdminAPI function found');
        authenticateAdminAPI(username, password);
    } else {
        debugLog('❌ authenticateAdminAPI function NOT found!');
        showAdminError("Erreur: Fonction d'authentification non disponible");
    }
}

// Show admin error
function showAdminError(message) {
    debugLog(`❌ Admin error: ${message}`);
    
    const modalBody = document.querySelector("#adminModal .modal-body");
    if (!modalBody) {
        debugLog('❌ Modal body not found');
        return;
    }
    
    const errorContainer = document.createElement("div");
    errorContainer.className = "alert alert-danger mt-3";
    errorContainer.textContent = message;
    
    // Remove existing error if any
    const existingError = modalBody.querySelector(".alert-danger");
    if (existingError) {
        existingError.remove();
    }
    
    modalBody.appendChild(errorContainer);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 3000);
}

// Check if admin is authenticated
function checkAdminAuth() {
    debugLog('🔍 checkAdminAuth called');
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (isAuthenticated) {
        showAdminPanel();
    }
}

// Show admin panel
function showAdminPanel() {
    debugLog('👁️ showAdminPanel called');
    
    // Store admin session in localStorage
    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem('adminUsername', 'admin');

}

// Create admin panel
function createAdminPanel() {
    const adminPanel = document.createElement("div");
    adminPanel.id = "adminPanel";
    adminPanel.className = "admin-panel";
    adminPanel.style.display = "none";
    
    adminPanel.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3>Tableau de Bord Administrateur</h3>
                    <div>
                        <span class="badge bg-success me-2">Connecté</span>
                        <button class="btn btn-outline-secondary btn-sm" id="logoutBtn">Déconnexion</button>
                    </div>
                </div>
            </div>
        </div>
        
        <ul class="nav nav-tabs mb-4" id="adminTabs">
            <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#contentManagement">Gestion Contenu</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#registrations">Inscriptions</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#submissions">Soumissions</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#settings">Paramètres</button>
            </li>
        </ul>
        
        <div class="tab-content">
            <div class="tab-pane fade show active" id="contentManagement">
                <div class="row">
                    <div class="col-md-6">
                        <div class="admin-card">
                            <h5>Gestion des Sections</h5>
                            <p>Modifiez le contenu de chaque section du site web.</p>
                            <button class="btn btn-admin" onclick="openContentEditor()">Modifier le Contenu</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="admin-card">
                            <h5>Gestion des Images</h5>
                            <p>Gérez les images utilisées sur le site web.</p>
                            <button class="btn btn-admin" onclick="openImageManager()">Gérer les Images</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tab-pane fade" id="registrations">
                <div class="admin-card">
                    <h5>Liste des Inscriptions</h5>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Catégorie</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="registrationsTable">
                                <!-- Data will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="tab-pane fade" id="submissions">
                <div class="admin-card">
                    <h5>Liste des Soumissions</h5>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Auteur</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="submissionsTable">
                                <!-- Data will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="tab-pane fade" id="settings">
                <div class="admin-card">
                    <h5>Paramètres du Site</h5>
                    <form id="settingsForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Titre du Site</label>
                                    <input type="text" class="form-control" id="siteTitle" value="Conférence IA & TE 2026">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Dates de la Conférence</label>
                                    <input type="text" class="form-control" id="conferenceDates" value="08-10 Juin 2026">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" id="siteDescription" rows="3">Conférence internationale sur les avancées en informatique et technologies éducatives pour le développement durable</textarea>
                        </div>
                        <button type="submit" class="btn btn-admin">Enregistrer les Modifications</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Insert admin panel after the hero section
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
        heroSection.parentNode.insertBefore(adminPanel, heroSection.nextSibling);
    }
    
    // Add event listeners
    setTimeout(() => {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logoutAdmin);
            debugLog('✅ Logout button event listener attached');
        }
        
        const settingsForm = document.getElementById("settingsForm");
        if (settingsForm) {
            settingsForm.addEventListener("submit", saveSettings);
            debugLog('✅ Settings form event listener attached');
        }
    }, 100);
}

// Add admin navigation
function addAdminNavigation() {
    debugLog('➕ addAdminNavigation called');
    // Add admin button to navigation
    const navItems = document.querySelector(".navbar-nav");
    if (!navItems) {
        debugLog('❌ Navbar not found');
        return;
    }
    
    const adminNavItem = document.createElement("li");
    adminNavItem.className = "nav-item ms-2";
    adminNavItem.innerHTML = '<button class="btn btn-outline-primary btn-sm" onclick="toggleAdminPanel()">Espace Admin</button>';
    
    // Check if admin button already exists
    if (!document.querySelector(".navbar-nav .btn-outline-primary")) {
        navItems.appendChild(adminNavItem);
        debugLog('✅ Admin button added to navigation');
    }
}

// Toggle admin panel
function toggleAdminPanel() {
    debugLog('👁️ toggleAdminPanel called');
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
        const isVisible = adminPanel.style.display === "block";
        adminPanel.style.display = isVisible ? "none" : "block";
        debugLog(`📱 Admin panel toggled: ${adminPanel.style.display}`);
    } else {
        debugLog('❌ Admin panel not found');
    }
}

// Logout admin
function logoutAdmin() {
    debugLog('👋 logoutAdmin called');
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUsername");
    
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
        adminPanel.style.display = "none";
    }
    
    // Remove admin button from navigation
    const adminBtn = document.querySelector(".btn-outline-primary");
    if (adminBtn) {
        adminBtn.parentNode.remove();
    }
    
    debugLog('✅ Logout completed');
}

// Open content editor
function openContentEditor() {
    alert("Éditeur de contenu - Cette fonctionnalité nécessiterait une intégration avec une base de données pour fonctionner pleinement.");
}

// Open image manager
function openImageManager() {
    alert("Gestionnaire d'images - Cette fonctionnalité nécessiterait une intégration avec un système de stockage pour fonctionner pleinement.");
}

// Save settings
function saveSettings(e) {
    e.preventDefault();
    
    const settings = {
        title: document.getElementById("siteTitle").value,
        dates: document.getElementById("conferenceDates").value,
        description: document.getElementById("siteDescription").value
    };
    
    // In a real application, this would save to a database
    console.log("Settings saved:", settings);
    
    // Show success message
    const form = document.getElementById("settingsForm");
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success mt-3";
    successMessage.textContent = "Paramètres enregistrés avec succès !";
    
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Initialize admin check when page loads - DISABLED
// document.addEventListener("DOMContentLoaded", function() {
//     debugLog('📄 DOMContentLoaded - Page fully loaded');
//
//     // Add debug log div if it doesn't exist
//     if (!document.getElementById('debug-log')) {
//         const debugDiv = document.createElement('div');
//         debugDiv.id = 'debug-log';
//         debugDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 300px; height: 200px; background: rgba(0,0,0,0.8); color: white; padding: 10px; overflow-y: auto; z-index: 9999; font-family: monospace; font-size: 12px;';
//         document.body.appendChild(debugDiv);
//     }
//
//     checkAdminAuth();
//
//     // Add admin login button to footer or navigation - DISABLED
//     // const footer = document.querySelector(".footer");
//     // if (footer) {
//     //     const adminLink = document.createElement("div");
//     //     adminLink.className = "mt-3 text-center";
//     //     adminLink.innerHTML = '<a href="#" class="text-white" data-bs-toggle="modal" data-bs-target="#adminModal">Espace Administrateur</a>';
//     //     footer.querySelector(".container .row").appendChild(adminLink);
//     //     debugLog('✅ Admin link added to footer');
//     // } else {
//     //     debugLog('⚠️ Footer not found');
//     // }
//
//     // Test if adminLoginBtn exists
//     const loginBtn = document.getElementById('adminLoginBtn');
//     if (loginBtn) {
//         debugLog('✅ adminLoginBtn found and ready');
//     } else {
//         debugLog('❌ adminLoginBtn NOT found - modal may not be loaded yet');
//     }
// });

// Keyboard shortcuts for admin - DISABLED
// document.addEventListener("keydown", function(e) {
//     // Ctrl + Alt + A to open admin panel
//     if (e.ctrlKey && e.altKey && e.key === "a") {
//         if (localStorage.getItem("adminAuthenticated") === "true") {
//             toggleAdminPanel();
//         } else {
//             const modal = new bootstrap.Modal(document.getElementById("adminModal"));
//             modal.show();
//         }
//     }
// });

// Responsive navigation fix
window.addEventListener("resize", function() {
    const navbar = document.querySelector(".navbar");
    if (window.innerWidth > 992) {
        navbar.classList.remove("fixed-top");
    } else {
        navbar.classList.add("fixed-top");
    }
});

// Lazy loading for images
document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = document.querySelectorAll("img[loading='lazy']");
    
    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
});

// Accessibility improvements
document.addEventListener("DOMContentLoaded", function() {
    // Add ARIA labels to navigation
    const nav = document.querySelector(".navbar");
    if (nav) {
        nav.setAttribute("aria-label", "Navigation principale");
    }
    
    // Add skip link for screen readers
    const skipLink = document.createElement("a");
    skipLink.href = "#accueil";
    skipLink.textContent = "Aller au contenu principal";
    skipLink.className = "sr-only sr-only-focusable";
    skipLink.style.position = "absolute";
    skipLink.style.left = "-9999px";
    skipLink.style.top = "auto";
    skipLink.style.width = "1px";
    skipLink.style.height = "1px";
    skipLink.style.overflow = "hidden";
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Remove skip link styles when focused
    skipLink.addEventListener("focus", function() {
        this.style.left = "10px";
        this.style.width = "auto";
        this.style.height = "auto";
        this.style.overflow = "visible";
    });
});

// Performance optimizations
(function() {
    // Debounce function for scroll events
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle scroll events
    const handleScroll = debounce(function() {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 100) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }, 100);
    
    window.addEventListener("scroll", handleScroll);
})();