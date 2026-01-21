import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatMoney, parseNumber } from '../utils/formatters';

const SilverPriceSection = ({ silverPrice, silverPrice925, silverPriceError, onSilverPriceChange }) => {
    const { t } = useTranslation();

    return (
        <div className="mb-4">
            <h4 className="section-title">
                <i className="fas fa-chart-line"></i>
                {t('silverPrice.title')}
            </h4>

            <div className="row">
                <div className="col-md-6">
                    <div className={`input-group ${silverPriceError ? 'has-error' : ''}`}>
                        <span className="input-group-text">
                            <i className="fas fa-coins me-2"></i>{t('silverPrice.price999k')}
                        </span>
                        <input
                            type="text"
                            className={`form-control ${silverPriceError ? 'is-invalid' : ''}`}
                            required
                            id="silverPrice"
                            name="silverPrice"
                            autoComplete="off"
                            placeholder={t('silverPrice.placeholder999k')}
                            value={silverPrice}
                            onChange={(e) => onSilverPriceChange(e.target.value)}
                            aria-invalid={silverPriceError ? 'true' : 'false'}
                            aria-describedby={silverPriceError ? 'silverPriceError' : undefined}
                        />
                    </div>
                    {silverPriceError && (
                        <div 
                            id="silverPriceError"
                            className="error-message" 
                            style={{ display: 'block' }}
                            role="alert"
                        >
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {silverPriceError}
                        </div>
                    )}
                </div>
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-crown me-2"></i>{t('silverPrice.price925k')}
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            readOnly
                            id="silverPrice925"
                            name="silverPrice925"
                            placeholder={t('silverPrice.placeholder925k')}
                            value={silverPrice925 ? formatMoney(parseNumber(silverPrice925)) : ''}
                            aria-label={t('aria.autoCalculated')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SilverPriceSection;