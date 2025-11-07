import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import $ from 'jquery';

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
    $('[data-i18n]').each(function() {
        const key = $(this).attr('data-i18n');
        $(this).text(i18next.t(key));
    });

    // Update elements with data-i18n-html attribute (for HTML content)
    $('[data-i18n-html]').each(function() {
        const key = $(this).attr('data-i18n-html');
        $(this).html(i18next.t(key));
    });

    // Update placeholders
    $('[data-i18n-placeholder]').each(function() {
        const key = $(this).attr('data-i18n-placeholder');
        $(this).attr('placeholder', i18next.t(key));
    });

    // Update title attributes
    $('[data-i18n-title]').each(function() {
        const key = $(this).attr('data-i18n-title');
        $(this).attr('title', i18next.t(key));
    });
}

// Function to change language
export function changeLanguage(lng) {
    return i18next.changeLanguage(lng).then(() => {
        // Update html lang attribute
        document.documentElement.lang = lng;
    }).catch((err) => {
        console.error('Error changing language:', err);
        throw err;
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
