// Teacher Modal Functionality
// Data for all teachers
const teachersData = {
    'bissa-emana': {
        name: 'Prof. Patricia BISSA EMANA',
        title: 'Présidente',
        specialty: 'Directrice ENS Yaoundé',
        institution: 'École Normale Supérieure, Université de Yaoundé I',
        email: 'patricia.bissa@ens-yaounde.cm',
        image: null, // No image available
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Directrice de l'École Normale Supérieure de Yaoundé, experte en administration universitaire et développement éducatif.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Administration universitaire</li>
                <li>Politiques éducatives</li>
                <li>Développement des institutions</li>
            </ul>
        `
    },
    'fouda': {
        name: 'Prof. Marcel L. FOUDA NDJODO',
        title: 'Co-Président',
        specialty: 'Responsable LITE',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'marcel.fouda@ens-yaounde.cm',
        website: 'https://scholar.google.com/marcel-fouda',
        linkedin: 'https://linkedin.com/in/marcel-fouda',
        image: 'images/fouda.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Professeur titulaire et responsable du Laboratoire d'Informatique et des Technologies Éducatives (LITE). Expert en informatique et technologies éducatives.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Technologies éducatives</li>
                <li>Informatique appliquée à l'éducation</li>
                <li>Recherche et développement</li>
                <li>Formation des enseignants</li>
            </ul>
        `
    },
    'ngnoulaye': {
        name: 'Janvier GNOULAYE',
        title: 'Membre',
        specialty: 'DITE, ENS, Université de Yaoundé 1',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'janvier.gnoulaye@ens-yaounde.cm',
        website: 'https://scholar.google.com/janvier-gnoulaye',
        linkedin: 'https://linkedin.com/in/janvier-gnoulaye',
        image: 'images/ngnoulaye.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Enseignant-chercheur au Département d'Informatique et des Technologies Éducatives de l'ENS.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Enseignement de l'informatique</li>
                <li>Pédagogie numérique</li>
                <li>Formation des enseignants</li>
            </ul>
        `
    },
    'tekouabou': {
        name: 'Stéphane C. K. TEKOUABOU',
        title: 'Membre',
        specialty: 'DITE, ENS, Université de Yaoundé 1',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'stephan.tekouabou@ens-yaounde.cm',
        website: 'https://scholar.google.com/stephan-tekouabou',
        linkedin: 'https://linkedin.com/in/stephan-tekouabou',
        image: 'images/tekouabou.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Enseignant-chercheur spécialisé dans les technologies éducatives et l'informatique.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Technologies éducatives</li>
                <li>Développement logiciel</li>
                <li>Innovation pédagogique</li>
            </ul>
        `
    },
    // Comité de Pilotage (provisoire)
    'bissa-emana-pilotage': {
        name: 'Prof. Patricia BISSA EMANA',
        title: 'Présidente',
        specialty: 'Directrice ENS Yaoundé',
        institution: 'École Normale Supérieure, Université de Yaoundé I',
        email: 'patricia.bissa@ens-yaounde.cm',
        image: null,
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Directrice de l'École Normale Supérieure de Yaoundé, experte en administration universitaire et développement éducatif.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Administration universitaire</li>
                <li>Politiques éducatives</li>
                <li>Développement des institutions</li>
            </ul>
        `
    },
    'fouda-pilotage': {
        name: 'Prof. Marcel L. FOUDA NDJODO',
        title: 'Co-Président',
        specialty: 'Responsable LITE',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'marcel.fouda@ens-yaounde.cm',
        website: 'https://scholar.google.com/marcel-fouda',
        linkedin: 'https://linkedin.com/in/marcel-fouda',
        image: 'images/fouda.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Professeur titulaire et responsable du Laboratoire d'Informatique et des Technologies Éducatives (LITE).</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Technologies éducatives</li>
                <li>Informatique appliquée à l'éducation</li>
                <li>Recherche et développement</li>
                <li>Formation des enseignants</li>
            </ul>
        `
    },
    'gnoulaye-pilotage': {
        name: 'Janvier GNOULAYE',
        title: 'Membre',
        specialty: 'DITE, ENS, Université de Yaoundé 1',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'janvier.gnoulaye@ens-yaounde.cm',
        website: 'https://scholar.google.com/janvier-gnoulaye',
        linkedin: 'https://linkedin.com/in/janvier-gnoulaye',
        image: 'images/ngnoulaye.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Enseignant-chercheur au Département d'Informatique et des Technologies Éducatives de l'ENS.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Enseignement de l'informatique</li>
                <li>Pédagogie numérique</li>
                <li>Formation des enseignants</li>
            </ul>
        `
    },
    'tekouabou-pilotage': {
        name: 'Stéphane C. K. TEKOUABOU',
        title: 'Membre',
        specialty: 'DITE, ENS, Université de Yaoundé 1',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'stephan.tekouabou@ens-yaounde.cm',
        website: 'https://scholar.google.com/stephan-tekouabou',
        linkedin: 'https://linkedin.com/in/stephan-tekouabou',
        image: 'images/tekouabou.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Biographie :</h6>
            <p class="small">Enseignant-chercheur spécialisé dans les technologies éducatives et l'informatique.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Technologies éducatives</li>
                <li>Développement logiciel</li>
                <li>Innovation pédagogique</li>
            </ul>
        `
    },
    // Conférenciers Principaux (Keynote Speakers)
    'fouda-keynote': {
        name: 'Prof. Marcel L. FOUDA NDJODO',
        title: 'Conférencier Principal',
        specialty: 'Expert en informatique et technologies éducatives',
        institution: 'Responsable LITE, ENS Yaoundé',
        email: 'marcel.fouda@ens-yaounde.cm',
        website: 'https://scholar.google.com/marcel-fouda',
        linkedin: 'https://linkedin.com/in/marcel-fouda',
        image: 'images/fouda.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Conférence :</h6>
            <p class="small">Conférencier principal sur les avancées en informatique et technologies éducatives pour le développement durable.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Intelligence artificielle en éducation</li>
                <li>Systèmes d'apprentissage adaptatifs</li>
                <li>EdTech et innovation pédagogique</li>
                <li>Recherche en technologies éducatives</li>
            </ul>
        `
    },
    'nkwenti-keynote': {
        name: 'Michael KWENTI',
        title: 'Conférencier Principal',
        specialty: 'Expert en informatique et technologies éducatives',
        institution: 'IT, MINBASE & Université de Yaoundé 1',
        email: 'michael.kwenti@ens-yaounde.cm',
        website: 'https://scholar.google.com/michael-kwenti',
        linkedin: 'https://linkedin.com/in/michael-kwenti',
        image: 'images/nkwenti.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Conférence :</h6>
            <p class="small">Conférencier principal spécialisé dans les technologies numériques pour l'éducation.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Systèmes d'information éducatifs</li>
                <li>Formation numérique</li>
                <li>Politiques éducatives numériques</li>
                <li>Innovation technologique</li>
            </ul>
        `
    },
    'tekouabou-keynote': {
        name: 'Stéphane C. K. TEKOUABOU',
        title: 'Conférencier Principal',
        specialty: 'Expert en informatique et technologies éducatives',
        institution: 'DITE, ENS, Université de Yaoundé 1',
        email: 'stephan.tekouabou@ens-yaounde.cm',
        website: 'https://scholar.google.com/stephan-tekouabou',
        linkedin: 'https://linkedin.com/in/stephan-tekouabou',
        image: 'images/tekouabou.jpeg',
        additionalInfo: `
            <h6 class="fw-bold mb-2">Conférence :</h6>
            <p class="small">Conférencier principal sur l'innovation technologique dans l'éducation.</p>
            <h6 class="fw-bold mb-2">Domaines d'expertise :</h6>
            <ul class="small">
                <li>Développement d'applications éducatives</li>
                <li>Interfaces homme-machine</li>
                <li>Expérience utilisateur en éducation</li>
                <li>Technologies émergentes</li>
            </ul>
        `
    }
};

// Function to populate modal with teacher data
function populateTeacherModal(teacherId) {
    const teacher = teachersData[teacherId];
    if (!teacher) {
        console.error('Teacher not found:', teacherId);
        return;
    }

    // Update modal title
    document.getElementById('teacherModalName').textContent = teacher.name;
    
    // Update modal content
    document.getElementById('teacherModalTitle').textContent = teacher.title;
    document.getElementById('teacherModalSpecialty').textContent = teacher.specialty;
    document.getElementById('teacherModalInstitution').textContent = teacher.institution;
    
    // Update image
    const imageContainer = document.getElementById('teacherModalImage');
    if (teacher.image) {
        imageContainer.innerHTML = `
            <img src="${teacher.image}" alt="${teacher.name}" class="img-fluid rounded" style="max-width: 200px;">
        `;
    } else {
        imageContainer.innerHTML = `
            <div class="teacher-photo-placeholder" style="width: 200px; height: 200px; margin: 0 auto;">
                <i class="bi bi-person-circle" style="font-size: 4rem;"></i>
                <small class="text-muted">Photo non disponible</small>
            </div>
        `;
    }
    
    // Update contact information
    let contactHtml = '';
    if (teacher.email) {
        contactHtml += `<p class="small mb-1"><i class="bi bi-envelope me-2"></i><a href="mailto:${teacher.email}">${teacher.email}</a></p>`;
    }
    if (teacher.website) {
        contactHtml += `<p class="small mb-1"><i class="bi bi-globe me-2"></i><a href="${teacher.website}" target="_blank">Site web</a></p>`;
    }
    if (teacher.linkedin) {
        contactHtml += `<p class="small mb-0"><i class="bi bi-linkedin me-2"></i><a href="${teacher.linkedin}" target="_blank">LinkedIn</a></p>`;
    }
    document.getElementById('teacherModalContact').innerHTML = contactHtml;
    
    // Update additional information
    document.getElementById('teacherModalAdditionalInfo').innerHTML = teacher.additionalInfo;
    
    // Update modal header color based on teacher type
    const modalHeader = document.querySelector('#teacherModal .modal-header');
    modalHeader.className = 'modal-header bg-primary text-white';
    if (teacherId.includes('keynote')) {
        modalHeader.className = 'modal-header bg-success text-white';
    }
}

// Add event listeners to all teacher detail buttons
document.addEventListener('DOMContentLoaded', function() {
    // Handle teacher detail button clicks
    const teacherButtons = document.querySelectorAll('.teacher-details');
    teacherButtons.forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.getAttribute('data-teacher-id');
            populateTeacherModal(teacherId);
        });
    });
    
    // Handle modal show event to ensure content is loaded
    const teacherModal = document.getElementById('teacherModal');
    if (teacherModal) {
        teacherModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const teacherId = button.getAttribute('data-teacher-id');
            populateTeacherModal(teacherId);
        });
    }
});