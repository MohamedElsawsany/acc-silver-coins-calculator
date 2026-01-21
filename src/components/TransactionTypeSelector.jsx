import React from 'react';
import { useTranslation } from 'react-i18next';

const TransactionTypeSelector = ({ selectedType, onTypeChange }) => {
    const { t } = useTranslation();

    const types = [
        { value: 'sale', icon: 'fa-shopping-bag', label: t('transaction.sale') },
        { value: 'return', icon: 'fa-undo-alt', label: t('transaction.return') },
        { value: 'returnUnpacked', icon: 'fa-exchange-alt', label: t('transaction.returnUnpacked') }
    ];

    return (
        <div className="transaction-type-container">
            {types.map(type => (
                <label
                    key={type.value}
                    className={`radio-wrapper ${selectedType === type.value ? 'selected' : ''}`}
                >
                    <input
                        type="radio"
                        name="transactionType"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={(e) => onTypeChange(e.target.value)}
                    />
                    <span className="custom-radio"></span>
                    <i className={`fas ${type.icon} radio-icon`}></i>
                    <span className="radio-label">{type.label}</span>
                </label>
            ))}
        </div>
    );
};

export default TransactionTypeSelector;