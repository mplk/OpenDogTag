import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import deTranslation from '../locales/de.json';

const resources = {
    en: {
        translation: enTranslation
    },
    de: {
        translation: deTranslation
    }
};

const i18nextPromise = i18next
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'de'],
        debug: false,
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupQuerystring: 'lng',
            lookupLocalStorage: 'i18nextLng'
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;
export { i18nextPromise };

// Function to update all translations in the DOM
export function updateContent() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });

    // Update elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        element.innerHTML = i18next.t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18next.t(key);
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = i18next.t(key);
    });
}

// Function to change language
export function changeLanguage(lng) {
    i18next.changeLanguage(lng, (err) => {
        if (err) {
            console.error('Error changing language:', err);
            return;
        }
        updateContent();
        // Update html lang attribute
        document.documentElement.lang = lng;
    });
}

// Function to get current language
export function getCurrentLanguage() {
    return i18next.language;
}

// Function to translate with interpolation
export function translate(key, options = {}) {
    return i18next.t(key, options);
}
