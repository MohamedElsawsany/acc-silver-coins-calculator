import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ onShowLicense }) => {
    const { t} = useTranslation();

    return (
        <div className="card-header">
            {/* License info - right in RTL, left in LTR */}
            <div className="license-info" onClick={onShowLicense}>
                <i className="fas fa-shield-alt"></i>
                <span className="license-badge">{t('header.licensed')}</span>
            </div>
            
            {/* Language Switcher - left in RTL, right in LTR */}
            <div className="header-language-switcher">
                <LanguageSwitcher />
            </div>
            
            <h2><i className="fas fa-coins me-3"></i>{t('header.title')}</h2>
            <p>{t('header.subtitle')}</p>
        </div>
    );
};

export default Header;