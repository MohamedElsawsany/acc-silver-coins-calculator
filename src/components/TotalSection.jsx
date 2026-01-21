import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatMoney, parseNumber } from '../utils/formatters';

const TotalSection = ({ grandTotal }) => {
    const { t } = useTranslation();

    return (
        <div className="total-section">
            <div className="row justify-content-end align-items-center">
                <div className="col-md-6 col-lg-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-receipt me-2"></i>{t('totals.grandTotal')}
                        </span>
                        <input
                            type="text"
                            className="form-control total-input"
                            readOnly
                            required
                            name="subTotal"
                            id="subTotal"
                            placeholder={t('totals.placeholder')}
                            value={formatMoney(parseNumber(grandTotal))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalSection;