// Visitor Statistics Tracking System
class VisitorStats {
    constructor() {
        this.storageKey = 'caited_visitor_stats';
        this.sessionKey = 'caited_session_tracked';
        this.stats = this.loadStats();
        this.countryNames = {
            'CM': 'Cameroun',
            'FR': 'France',
            'US': 'États-Unis',
            'CA': 'Canada',
            'GB': 'Royaume-Uni',
            'DE': 'Allemagne',
            'MA': 'Maroc',
            'TN': 'Tunisie',
            'DZ': 'Algérie',
            'SN': 'Sénégal',
            'CI': 'Côte d\'Ivoire',
            'ML': 'Mali',
            'BF': 'Burkina Faso',
            'NE': 'Niger',
            'TD': 'Tchad',
            'CF': 'République Centrafricaine',
            'CG': 'République du Congo',
            'CD': 'République Démocratique du Congo',
            'GQ': 'Guinée Équatoriale',
            'GA': 'Gabon',
            'ST': 'São Tomé et Príncipe',
            'AO': 'Angola',
            'ZM': 'Zambie',
            'ZW': 'Zimbabwe',
            'BW': 'Botswana',
            'NA': 'Namibie',
            'ZA': 'Afrique du Sud',
            'MZ': 'Mozambique',
            'MG': 'Madagascar',
            'MU': 'Maurice',
            'SC': 'Seychelles',
            'KE': 'Kenya',
            'UG': 'Ouganda',
            'TZ': 'Tanzanie',
            'RW': 'Rwanda',
            'BI': 'Burundi',
            'ET': 'Éthiopie',
            'SO': 'Somalie',
            'DJ': 'Djibouti',
            'ER': 'Érythrée',
            'GH': 'Ghana',
            'TG': 'Togo',
            'BJ': 'Bénin',
            'GW': 'Guinée-Bissau',
            'GN': 'Guinée',
            'SL': 'Sierra Leone',
            'LR': 'Liberia',
            'MR': 'Mauritanie',
            'EH': 'Sahara Occidental',
            'KM': 'Comores',
            'YT': 'Mayotte',
            'RE': 'Réunion',
            'MU': 'Maurice'
        };
        
        this.init();
    }

    init() {
        this.trackVisit();
        this.displayStats();
        
        // Log initial stats for verification
        console.log('Initial visitor stats:', this.stats);
        console.log('Only real visitor data will be counted from now on.');
    }

    // Get visitor's country using multiple methods
    async getVisitorCountry() {
        try {
            // Method 1: Try to get country from timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                const country = this.getCountryFromTimezone(timezone);
                if (country) return country;
            }

            // Method 2: Try IP geolocation (using a free service)
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (response.ok) {
                    const data = await response.json();
                    return data.country_code;
                }
            } catch (error) {
                console.log('IP geolocation failed:', error);
            }

            // Method 3: Browser language detection
            const language = navigator.language || navigator.userLanguage;
            const country = this.getCountryFromLanguage(language);
            if (country) return country;

            // Method 4: Default fallback
            return 'UNKNOWN';
        } catch (error) {
            console.log('Country detection failed:', error);
            return 'UNKNOWN';
        }
    }

    // Map timezone to country
    getCountryFromTimezone(timezone) {
        const timezoneToCountry = {
            'Africa/Douala': 'CM', // Cameroon
            'Africa/Lagos': 'NG', // Nigeria
            'Africa/Abidjan': 'CI', // Ivory Coast
            'Africa/Dakar': 'SN', // Senegal
            'Africa/Accra': 'GH', // Ghana
            'Africa/Bamako': 'ML', // Mali
            'Africa/Ouagadougou': 'BF', // Burkina Faso
            'Africa/Niamey': 'NE', // Niger
            'Africa/Ndjamena': 'TD', // Chad
            'Africa/Bangui': 'CF', // Central African Republic
            'Africa/Brazzaville': 'CG', // Republic of Congo
            'Africa/Kinshasa': 'CD', // Democratic Republic of Congo
            'Africa/Malabo': 'GQ', // Equatorial Guinea
            'Africa/Libreville': 'GA', // Gabon
            'Africa/Sao_Tome': 'ST', // São Tomé and Príncipe
            'Africa/Luanda': 'AO', // Angola
            'Africa/Maputo': 'MZ', // Mozambique
            'Africa/Antananarivo': 'MG', // Madagascar
            'Africa/Port_Louis': 'MU', // Mauritius
            'Africa/Kigali': 'RW', // Rwanda
            'Africa/Kampala': 'UG', // Uganda
            'Africa/Dar_es_Salaam': 'TZ', // Tanzania
            'Africa/Nairobi': 'KE', // Kenya
            'Africa/Addis_Ababa': 'ET', // Ethiopia
            'Africa/Johannesburg': 'ZA', // South Africa
            'Europe/Paris': 'FR', // France
            'Europe/London': 'GB', // UK
            'Europe/Berlin': 'DE', // Germany
            'America/New_York': 'US', // USA
            'America/Toronto': 'CA', // Canada
            'Africa/Casablanca': 'MA', // Morocco
            'Africa/Tunis': 'TN', // Tunisia
            'Africa/Algiers': 'DZ' // Algeria
        };
        
        return timezoneToCountry[timezone] || null;
    }

    // Map browser language to country
    getCountryFromLanguage(language) {
        const langToCountry = {
            'fr-CM': 'CM', 'fr': 'FR',
            'en-CM': 'CM', 'en': 'US',
            'ar-MA': 'MA', 'ar': 'MA',
            'ar-DZ': 'DZ', 'ar-TN': 'TN'
        };
        
        return langToCountry[language] || null;
    }

    // Track a new visit
    async trackVisit() {
        // Check if already tracked this session
        if (sessionStorage.getItem(this.sessionKey)) {
            return;
        }

        const country = await this.getVisitorCountry();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Initialize stats structure if not exists
        if (!this.stats.countries) {
            this.stats = {
                countries: {},
                totalVisits: 0,
                lastUpdated: null
            };
        }

        // Update country statistics
        if (!this.stats.countries[country]) {
            this.stats.countries[country] = {
                count: 0,
                name: this.countryNames[country] || country,
                flag: this.getCountryFlag(country),
                firstVisit: today
            };
        }

        this.stats.countries[country].count++;
        this.stats.totalVisits++;
        this.stats.lastUpdated = new Date().toISOString();

        // Save to localStorage
        this.saveStats();
        
        // Mark session as tracked
        sessionStorage.setItem(this.sessionKey, 'true');
    }

    // Get country flag emoji
    getCountryFlag(countryCode) {
        if (countryCode === 'UNKNOWN') return '🌍';
        
        const flags = {
            'CM': '🇨🇲', 'FR': '🇫🇷', 'US': '🇺🇸', 'CA': '🇨🇦',
            'GB': '🇬🇧', 'DE': '🇩🇪', 'MA': '🇲🇦', 'TN': '🇹🇳',
            'DZ': '🇩🇿', 'SN': '🇸🇳', 'CI': '🇨🇮', 'ML': '🇲🇱',
            'BF': '🇧🇫', 'NE': '🇳🇪', 'TD': '🇹🇩', 'CF': '🇨🇫',
            'CG': '🇨🇬', 'CD': '🇨🇩', 'GQ': '🇬🇶', 'GA': '🇬🇦',
            'ST': '🇸🇹', 'AO': '🇦🇴', 'ZM': '🇿🇲', 'ZW': '🇿🇼',
            'BW': '🇧🇼', 'NA': '🇳🇦', 'ZA': '🇿🇦', 'MZ': '🇲🇿',
            'MG': '🇲🇬', 'MU': '🇲🇺', 'SC': '🇸🇨', 'KE': '🇰🇪',
            'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼', 'BI': '🇧🇮',
            'ET': '🇪🇹', 'SO': '🇸🇴', 'DJ': '🇩🇯', 'ER': '🇪🇷',
            'GH': '🇬🇭', 'TG': '🇹🇬', 'BJ': '🇧🇯', 'GW': '🇬🇼',
            'GN': '🇬🇳', 'SL': '🇸🇱', 'LR': '🇱🇷', 'MR': '🇲🇷'
        };
        
        return flags[countryCode] || '🌍';
    }

    // Load statistics from localStorage
    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {
                countries: {},
                totalVisits: 0,
                lastUpdated: null
            };
        } catch (error) {
            console.error('Error loading visitor stats:', error);
            return {
                countries: {},
                totalVisits: 0,
                lastUpdated: null
            };
        }
    }

    // Save statistics to localStorage
    saveStats() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        } catch (error) {
            console.error('Error saving visitor stats:', error);
        }
    }

    // Sort countries by visit count
    getSortedCountries() {
        if (!this.stats.countries) return [];
        
        return Object.entries(this.stats.countries)
            .sort(([,a], [,b]) => b.count - a.count);
    }

    // Display statistics in the footer button
    displayStats() {
        const totalVisitsElement = document.getElementById('totalVisits');
        
        if (!totalVisitsElement) return;

        // Update total visits count in footer
        totalVisitsElement.textContent = this.stats.totalVisits.toLocaleString();
    }

    // Display statistics in the modal
    displayModalStats() {
        const modalTotalVisitsElement = document.getElementById('modalTotalVisits');
        const modalCountryStatsContainer = document.getElementById('modalCountryStats');
        
        if (!modalTotalVisitsElement || !modalCountryStatsContainer) return;

        // Show loading state
        modalCountryStatsContainer.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div><p class="mt-2 text-muted">Chargement des statistiques...</p></div>';
        modalTotalVisitsElement.textContent = '0';

        // Delay to show loading state
        setTimeout(() => {
            this.renderModalStats();
        }, 300);
    }

    // Render the statistics in the modal
    renderModalStats() {
        const modalTotalVisitsElement = document.getElementById('modalTotalVisits');
        const modalCountryStatsContainer = document.getElementById('modalCountryStats');
        
        if (!modalTotalVisitsElement || !modalCountryStatsContainer) return;

        // Update total visits
        modalTotalVisitsElement.textContent = this.stats.totalVisits.toLocaleString();

        // Sort countries by visit count
        const sortedCountries = this.getSortedCountries();
        
        if (sortedCountries.length === 0) {
            modalCountryStatsContainer.innerHTML = `
                <div class="text-center p-4">
                    <i class="bi bi-graph-down text-muted" style="font-size: 3rem;"></i>
                    <p class="mt-3 mb-0 text-muted">Aucune statistique disponible</p>
                    <small class="text-muted">Soyez le premier visiteur !</small>
                </div>
            `;
            return;
        }

        // Generate HTML for each country
        const statsHtml = sortedCountries.map(([countryCode, data], index) => {
            const percentage = this.stats.totalVisits > 0 ? 
                Math.round((data.count / this.stats.totalVisits) * 100) : 0;
            
            return `
                <div class="modal-country-item">
                    <div class="modal-country-flag">${data.flag}</div>
                    <div class="modal-country-info">
                        <div class="modal-country-name">${data.name}</div>
                        <div class="modal-country-details">${data.count} visite${data.count > 1 ? 's' : ''} • ${percentage}% du total</div>
                    </div>
                    <div class="modal-country-stats">
                        <span class="modal-percentage">${percentage}%</span>
                        <span class="modal-visit-count">${data.count}</span>
                        <span class="modal-rank">#${index + 1}</span>
                    </div>
                </div>
            `;
        }).join('');

        modalCountryStatsContainer.innerHTML = statsHtml;
        
        // Add animation
        const items = modalCountryStatsContainer.querySelectorAll('.modal-country-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Reset statistics (for testing)
    resetStats() {
        console.log('Resetting visitor statistics to zero...');
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        this.stats = {
            countries: {},
            totalVisits: 0,
            lastUpdated: null
        };
        
        // Force update displays
        this.displayStats();
        
        console.log('Statistics reset complete. Starting fresh with real visitor data only.');
    }

    // Get current statistics
    getStats() {
        return this.stats;
    }
}

// Initialize visitor statistics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.visitorStats = new VisitorStats();
    
    // Force clean up of any existing data (including sample data)
    setTimeout(() => {
        console.log('Cleaning up any existing data...');
        window.visitorStats.resetStats();
        
        // Update display after cleanup
        window.visitorStats.displayStats();
    }, 500);
    
    // Add event listener for stats button
    const statsButton = document.getElementById('statsButton');
    if (statsButton) {
        statsButton.addEventListener('click', () => {
            window.visitorStats.displayModalStats();
        });
    }
});