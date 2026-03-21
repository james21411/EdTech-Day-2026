-- Conference IA&TE 2025 Database Schema
-- PostgreSQL database schema for the conference website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for admin authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conference_settings table for website content management
CREATE TABLE conference_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'text',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create speakers table
CREATE TABLE speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    institution VARCHAR(200),
    bio TEXT,
    photo_url VARCHAR(500),
    is_keynote BOOLEAN DEFAULT false,
    order_priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create committees table
CREATE TABLE committees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    institution VARCHAR(200),
    bio TEXT,
    photo_url VARCHAR(500),
    committee_type VARCHAR(50) NOT NULL, -- 'steering', 'scientific', 'organizing'
    order_priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create program_schedule table
CREATE TABLE program_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_number INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    speaker_id UUID REFERENCES speakers(id),
    session_type VARCHAR(50), -- 'plenary', 'parallel', 'workshop', 'ceremony'
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    abstract TEXT,
    authors TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    institution VARCHAR(200),
    submission_type VARCHAR(50), -- 'full_paper', 'short_paper', 'poster'
    keywords TEXT,
    file_url VARCHAR(500),
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'under_review'
    reviewer_comments TEXT,
    score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'student', 'professional', 'group'
    days_attending TEXT, -- JSON array of selected days
    comments TEXT,
    payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
    payment_amount DECIMAL(10,2),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sponsors table
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    sponsor_type VARCHAR(50), -- 'gold', 'silver', 'bronze', 'partner'
    description TEXT,
    order_priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create images table for content management
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    alt_text VARCHAR(500),
    description TEXT,
    usage_context VARCHAR(100), -- where the image is used
    file_size INTEGER,
    mime_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create content_blocks table for dynamic content
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200),
    content TEXT,
    block_type VARCHAR(50), -- 'text', 'html', 'markdown'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_speakers_is_keynote ON speakers(is_keynote);
CREATE INDEX idx_speakers_order_priority ON speakers(order_priority);
CREATE INDEX idx_committees_type ON committees(committee_type);
CREATE INDEX idx_committees_order_priority ON committees(order_priority);
CREATE INDEX idx_schedule_day ON program_schedule(day_number);
CREATE INDEX idx_schedule_time ON program_schedule(start_time);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_category ON registrations(category);
CREATE INDEX idx_sponsors_type ON sponsors(sponsor_type);
CREATE INDEX idx_sponsors_priority ON sponsors(order_priority);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conference_settings_updated_at BEFORE UPDATE ON conference_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_speakers_updated_at BEFORE UPDATE ON speakers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_program_schedule_updated_at BEFORE UPDATE ON program_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON content_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@conference-iate2025.cm', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default conference settings
INSERT INTO conference_settings (key, value, type, description) VALUES 
('site_title', 'Conférence IA & TE 2025', 'text', 'Titre principal du site'),
('site_subtitle', 'Avancées en Informatique et Technologies Éducatives pour le Développement Durable', 'text', 'Sous-titre du site'),
('conference_dates', '08-10 Juin 2025', 'text', 'Dates de la conférence'),
('conference_location', 'Université de Yaoundé I, Yaoundé, Cameroun', 'text', 'Lieu de la conférence'),
('theme', 'Innover dans le domaine de l'informatique et des technologies éducatives pour un avenir durable', 'text', 'Thème de la conférence'),
('registration_deadline', '2025-05-15', 'date', 'Date limite dinscription'),
('submission_deadline', '2025-03-01', 'date', 'Date limite de soumission'),
('student_fee', '25000', 'number', 'Frais dinscription étudiant'),
('professional_fee', '75000', 'number', 'Frais dinscription professionnel'),
('contact_email', 'info@conference-iate2025.cm', 'email', 'Email de contact'),
('contact_phone', '+237 6 XX XX XX XX', 'text', 'Téléphone de contact');

-- Insert sample speakers
INSERT INTO speakers (name, title, institution, bio, is_keynote, order_priority) VALUES 
('Dr. Amina Diallo', 'Directrice de Recherche', 'Université de Genève', 'Spécialiste en intelligence artificielle éducative et apprentissage adaptatif. Auteur de plus de 50 publications sur lIA en éducation.', true, 1),
('Prof. Kwame Nkrumah', 'Professeur Titulaire', 'Université du Ghana', 'Expert en blockchain pour l éducation et certification numérique. Membre du comité scientifique de plusieurs conférences internationales.', true, 2),
('Dr. Sophie Martin', 'Chercheuse Senior', 'EPFL Suisse', 'Pionnière en réalité virtuelle et augmentée pour l éducation immersive. Lauréate du prix UNESCO pour l innovation éducative 2023.', true, 3),
('Prof. Jean Ndongo', 'Directeur du département', 'Université de Yaoundé I', 'Directeur du département d Informatique et Technologies Éducatives', false, 4),
('Dr. Fatoumata Bâ', 'Spécialiste', 'Université Cheikh Anta Diop', 'Spécialiste en éducation inclusive et technologies adaptatives', false, 5);

-- Insert sample committees
INSERT INTO committees (name, position, institution, bio, committee_type, order_priority) VALUES 
('Pr. Albert Nkodo', 'Président', 'Université de Yaoundé I', 'Directeur du Laboratoire LITE, Université de Yaoundé I', 'steering', 1),
('Dr. Chantal Mvogo', 'Vice-Présidente', 'Ministère des Postes et Télécommunications', 'Présidente de la SCNEF, Ministère des Postes et Télécommunications', 'steering', 2),
('Pr. Samuel Eto o', 'Membre', 'Université de Yaoundé I', 'Doyen de la Faculté des Sciences, Université de Yaoundé I', 'steering', 3),
('Dr. Martine Owona', 'Membre', 'MINESEC', 'Directrice de l Innovation Pédagogique, MINESEC', 'steering', 4),
('Pr. Jean Ndongo', 'Président', 'Université de Yaoundé I', 'Président du comité scientifique', 'scientific', 1),
('Pr. Amina Diallo', 'Membre', 'Université de Genève', 'Membre international du comité scientifique', 'scientific', 2),
('Dr. Armand Fouda', 'Coordinateur', 'Université de Yaoundé I', 'Coordinateur du comité d organisation', 'organizing', 1),
('Mme. Grace Ngo', 'Coordinatrice Adjointe', 'Université de Yaoundé I', 'Coordinatrice adjointe du comité d organisation', 'organizing', 2);

-- Insert sample program schedule
INSERT INTO program_schedule (day_number, start_time, end_time, title, description, session_type, location) VALUES 
(1, '08:30:00', '09:30:00', 'Accueil et enregistrement des participants', 'Hall principal de l Université de Yaoundé', 'ceremony', 'Hall Principal'),
(1, '09:30:00', '10:30:00', 'Cérémonie d ouverture', 'Discours d ouverture par les autorités universitaires et gouvernementales', 'ceremony', 'Amphithéâtre'),
(1, '10:30:00', '12:00:00', 'Conférence plénière : L IA au service de l éducation durable', 'Dr. Amina Diallo, Université de Genève', 'plenary', 'Amphithéâtre'),
(1, '14:00:00', '16:00:00', 'Sessions parallèles : Recherches en TE', 'Présentations de recherches sur les technologies éducatives et développement durable', 'parallel', 'Salles de conférence'),
(1, '16:30:00', '18:00:00', 'Atelier pratique : Conception de cours en ligne', 'Introduction aux outils de création de contenus éducatifs numériques', 'workshop', 'Laboratoire informatique'),
(2, '09:00:00', '10:30:00', 'Conférence plénière : Blockchain pour l éducation certifiée', 'Prof. Kwame Nkrumah, Université du Ghana', 'plenary', 'Amphithéâtre'),
(2, '11:00:00', '13:00:00', 'Table ronde : Politiques éducatives à l ère du numérique', 'Ministres, décideurs et experts discutent des politiques pour l éducation numérique', 'panel', 'Salle de conférence'),
(2, '14:30:00', '16:30:00', 'Événement EdTech Day : Démonstrations de solutions', 'Présentation des dernières innovations en technologies éducatives par des startups', 'demonstration', 'Espace exposition'),
(2, '17:00:00', '18:30:00', 'Session posters et networking', 'Présentation de recherches sous forme de posters et échanges informels', 'poster', 'Hall d exposition'),
(3, '09:00:00', '10:30:00', 'Conférence plénière : Réalité virtuelle pour l apprentissage immersif', 'Dr. Sophie Martin, École Polytechnique Fédérale de Lausanne', 'plenary', 'Amphithéâtre'),
(3, '11:00:00', '13:00:00', 'Sessions parallèles : Intelligence artificielle en éducation', 'Applications de l IA pour l adaptation des apprentissages et l évaluation', 'parallel', 'Salles de conférence'),
(3, '14:30:00', '16:00:00', 'Atelier : Éducation aux médias et littératie numérique', 'Stratégies pour développer les compétences numériques critiques', 'workshop', 'Laboratoire informatique'),
(3, '16:30:00', '18:00:00', 'Cérémonie de clôture et remise des prix', 'Synthèse des travaux, annonce des meilleures présentations et mot de clôture', 'ceremony', 'Amphithéâtre');

-- Insert sample sponsors
INSERT INTO sponsors (name, website_url, sponsor_type, description, order_priority) VALUES 
('Ministère de l Éducation', 'https://www.education.gouv.cm', 'gold', 'Ministère en charge de l éducation nationale', 1),
('UNESCO', 'https://fr.unesco.org', 'gold', 'Organisation des Nations Unies pour l éducation, la science et la culture', 2),
('Orange Cameroun', 'https://www.orange.cm', 'silver', 'Opérateur de télécommunications', 3),
('MTN Cameroun', 'https://www.mtn.cm', 'silver', 'Opérateur de télécommunications', 4),
('Université de Yaoundé I', 'https://www.univ-yaounde1.cm', 'partner', 'Université hôte de la conférence', 5);

-- Insert sample content blocks
INSERT INTO content_blocks (block_key, title, content, block_type) VALUES 
('about_description', 'À propos de la Conférence', 'Cette conférence internationale réunit des experts, chercheurs, éducateurs et professionnels du monde entier pour discuter des dernières avancées en informatique et technologies éducatives et leur rôle dans la promotion du développement durable.', 'html'),
('theme_description', 'Thème de la Conférence', 'Innover dans le domaine de l informatique et des technologies éducatives pour un avenir durable', 'text'),
('submission_guidelines', 'Instructions aux Auteurs', '<ul><li>Les soumissions doivent être originales et non publiées ailleurs</li><li>Format : PDF conforme au modèle Springer LNCS</li><li>Langues : Français ou Anglais</li><li>Soumission via EasyChair : lien à venir</li></ul>', 'html'),
('registration_info', 'Informations sur l Inscription', 'Réservez votre place dès maintenant pour participer à cet événement international. Tarifs spéciaux pour les étudiants et groupes.', 'html');

-- Grant permissions (adjust as needed for your PostgreSQL setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;