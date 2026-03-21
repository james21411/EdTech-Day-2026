// API Integration for Conference Website

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Admin authentication with backend API
async function authenticateAdminAPI(username, password) {
    // Show loading state
    const loginBtn = document.getElementById("adminLoginBtn");
    const originalText = loginBtn.textContent;
    loginBtn.textContent = "Connexion...";
    loginBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Successful login
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUser", JSON.stringify(data.user));
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("adminModal"));
            modal.hide();
            
            // Show admin panel
            showAdminPanel();
            
            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            document.getElementById("adminUsername").value = "";
            document.getElementById("adminPassword").value = "";
            
            // Load admin data
            loadAdminData();
        } else {
            // Failed login
            showAdminError(data.error || "Nom d'utilisateur ou mot de passe incorrect");
            
            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showAdminError("Erreur de connexion au serveur");
        
        // Reset button
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
}

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem("adminToken");
    if (token) {
        // Verify token is still valid
        verifyAdminToken(token);
    }
}

// Verify admin token
async function verifyAdminToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showAdminPanel();
        } else {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
        }
    } catch (error) {
        console.error('Token verification error:', error);
    }
}

// Load admin data
async function loadAdminData() {
    try {
        // Load registrations
        const regResponse = await fetch(`${API_BASE_URL}/admin/registrations`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        
        if (regResponse.ok) {
            const registrations = await regResponse.json();
            renderRegistrationsTable(registrations);
        }
        
        // Load submissions
        const subResponse = await fetch(`${API_BASE_URL}/admin/submissions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        
        if (subResponse.ok) {
            const submissions = await subResponse.json();
            renderSubmissionsTable(submissions);
        }
        
        // Load settings
        const settingsResponse = await fetch(`${API_BASE_URL}/admin/settings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        
        if (settingsResponse.ok) {
            const settings = await settingsResponse.json();
            populateSettingsForm(settings);
        }
        
    } catch (error) {
        console.error('Load admin data error:', error);
    }
}

// Render registrations table
function renderRegistrationsTable(registrations) {
    const tbody = document.getElementById("registrationsTable");
    if (!tbody) return;
    
    tbody.innerHTML = registrations.map(reg => `
        <tr>
            <td>${reg.first_name} ${reg.last_name}</td>
            <td>${reg.email}</td>
            <td>${reg.category}</td>
            <td>${new Date(reg.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewRegistration('${reg.id}')">Voir</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRegistration('${reg.id}')">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// Render submissions table
function renderSubmissionsTable(submissions) {
    const tbody = document.getElementById("submissionsTable");
    if (!tbody) return;
    
    tbody.innerHTML = submissions.map(sub => `
        <tr>
            <td>${sub.title}</td>
            <td>${sub.authors}</td>
            <td>${sub.submission_type}</td>
            <td><span class="badge bg-${getStatusColor(sub.status)}">${sub.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewSubmission('${sub.id}')">Voir</button>
                <button class="btn btn-sm btn-warning" onclick="updateSubmissionStatus('${sub.id}', 'accepted')">Accepter</button>
                <button class="btn btn-sm btn-danger" onclick="updateSubmissionStatus('${sub.id}', 'rejected')">Rejeter</button>
            </td>
        </tr>
    `).join('');
}

// Get status color for badges
function getStatusColor(status) {
    switch (status) {
        case 'accepted': return 'success';
        case 'rejected': return 'danger';
        case 'under_review': return 'warning';
        default: return 'secondary';
    }
}

// Populate settings form
function populateSettingsForm(settings) {
    settings.forEach(setting => {
        const element = document.getElementById(setting.key);
        if (element) {
            element.value = setting.value || '';
        }
    });
}

// Save settings
async function saveSettings(e) {
    e.preventDefault();
    
    const settings = [
        { key: 'site_title', value: document.getElementById('siteTitle').value },
        { key: 'conference_dates', value: document.getElementById('conferenceDates').value },
        { key: 'site_description', value: document.getElementById('siteDescription').value }
    ];
    
    try {
        for (const setting of settings) {
            await fetch(`${API_BASE_URL}/admin/settings/${setting.key}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify({
                    value: setting.value
                })
            });
        }
        
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
        
    } catch (error) {
        console.error('Save settings error:', error);
        showAdminError("Erreur lors de l'enregistrement des paramètres");
    }
}

// View registration details
function viewRegistration(id) {
    alert(`Fonctionnalité en développement - ID: ${id}`);
}

// Delete registration
async function deleteRegistration(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
        return;
    }
    
    try {
        await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        
        // Reload data
        loadAdminData();
    } catch (error) {
        console.error('Delete registration error:', error);
        showAdminError("Erreur lors de la suppression de l'inscription");
    }
}

// View submission details
function viewSubmission(id) {
    alert(`Fonctionnalité en développement - ID: ${id}`);
}

// Update submission status
async function updateSubmissionStatus(id, status) {
    try {
        await fetch(`${API_BASE_URL}/admin/submissions/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({
                status: status
            })
        });
        
        // Reload data
        loadAdminData();
    } catch (error) {
        console.error('Update submission status error:', error);
        showAdminError("Erreur lors de la mise à jour du statut");
    }
}

// Submit registration to API
async function submitRegistrationToAPI(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                institution: data.institution,
                category: data.category,
                days_attending: data.days,
                comments: data.comments
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            const successMessage = document.createElement("div");
            successMessage.className = "alert alert-success";
            successMessage.innerHTML = `<strong>Inscription réussie !</strong><br>Merci de vous être inscrit à la conférence. Montant à payer: ${result.payment_amount} FCFA`;
            
            const form = document.getElementById("registrationForm");
            form.parentNode.insertBefore(successMessage, form);
            
            // Reset form
            form.reset();
            
            // Remove success message after 10 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 10000);
        } else {
            throw new Error(result.error || "Erreur lors de l'inscription");
        }
    } catch (error) {
        console.error('Registration error:', error);
        showFormErrors([error.message]);
    }
}

// Submit submission to API
async function submitSubmissionToAPI(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: data.title,
                abstract: data.abstract,
                authors: data.authors,
                email: data.email,
                institution: data.institution,
                submission_type: data.submission_type,
                keywords: data.keywords
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            const successMessage = document.createElement("div");
            successMessage.className = "alert alert-success";
            successMessage.innerHTML = `<strong>Soumission réussie !</strong><br>Merci d'avoir soumis votre article. ID: ${result.submission.id}`;
            
            // Remove success message after 10 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 10000);
        } else {
            throw new Error(result.error || "Erreur lors de la soumission");
        }
    } catch (error) {
        console.error('Submission error:', error);
        showFormErrors([error.message]);
    }
}

// Initialize API integration
document.addEventListener("DOMContentLoaded", function() {
    // Replace the original submitRegistration function
    const originalSubmitRegistration = window.submitRegistration;
    window.submitRegistration = function(data) {
        submitRegistrationToAPI(data);
    };
    
    // Check admin authentication
    checkAdminAuth();
});