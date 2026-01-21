import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                title={t('language.switchTo', { language: t('language.english') })}
            >
                <i className="fas fa-language me-1"></i>
                EN
            </button>
            <button
                className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}
                onClick={() => changeLanguage('ar')}
                title={t('language.switchTo', { language: t('language.arabic') })}
            >
                <i className="fas fa-language me-1"></i>
                AR
            </button>
        </div>
    );
};

export default LanguageSwitcher;