import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

// Custom language detector that prioritizes localStorage
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
    name: 'customDetector',
    lookup() {
        // Try to get from localStorage first
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            return savedLang;
        }
        // Fallback to browser language
        return navigator.language || navigator.userLanguage || 'en';
    },
    cacheUserLanguage(lng) {
        localStorage.setItem('language', lng);
    }
});

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            ar: {
                translation: arTranslations
            }
        },
        fallbackLng: 'en',
        detection: {
            order: ['customDetector', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

// Set HTML dir attribute based on language
i18n.on('languageChanged', (lng) => {
    const dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
    localStorage.setItem('language', lng);
});

// Set initial direction
const initialLang = i18n.language || 'en';
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;