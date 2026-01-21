import React from 'react';
import { useTranslation } from 'react-i18next';

const InvoiceInfoSection = ({ 
    invoiceNo, 
    serialNo, 
    customerName, 
    customerPhone,
    onInvoiceNoChange,
    onSerialNoChange,
    onCustomerNameChange,
    onCustomerPhoneChange,
    invoiceNoError,
    customerNameError
}) => {
    const { t } = useTranslation();

    return (
        <div className="mb-4">
            <h4 className="section-title">
                <i className="fas fa-file-invoice"></i>
                {t('invoiceInfo.title')}
            </h4>

            <div className="row">
                <div className="col-md-6">
                    <div className={`input-group ${invoiceNoError ? 'has-error' : ''}`}>
                        <span className="input-group-text">
                            <i className="fas fa-hashtag me-2"></i>{t('invoiceInfo.invoiceNo')}
                        </span>
                        <input
                            type="text"
                            className={`form-control ${invoiceNoError ? 'is-invalid' : ''}`}
                            required
                            id="invoiceNo"
                            name="invoiceNo"
                            autoComplete="off"
                            placeholder={t('invoiceInfo.placeholderInvoiceNo')}
                            value={invoiceNo}
                            onChange={(e) => onInvoiceNoChange(e.target.value)}
                            aria-invalid={invoiceNoError ? 'true' : 'false'}
                            aria-describedby={invoiceNoError ? 'invoiceNoError' : undefined}
                        />
                    </div>
                    {invoiceNoError && (
                        <div 
                            id="invoiceNoError"
                            className="error-message" 
                            style={{ display: 'block' }}
                            role="alert"
                        >
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {invoiceNoError}
                        </div>
                    )}
                </div>
                
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-barcode me-2"></i>{t('invoiceInfo.serialNo')}
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            id="serialNo"
                            name="serialNo"
                            autoComplete="off"
                            placeholder={t('invoiceInfo.placeholderSerialNo')}
                            value={serialNo}
                            onChange={(e) => onSerialNoChange(e.target.value)}
                            aria-label={t('invoiceInfo.serialNo')}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <div className={`input-group ${customerNameError ? 'has-error' : ''}`}>
                        <span className="input-group-text">
                            <i className="fas fa-user me-2"></i>{t('invoiceInfo.customerName')}
                        </span>
                        <input
                            type="text"
                            className={`form-control ${customerNameError ? 'is-invalid' : ''}`}
                            required
                            id="customerName"
                            name="customerName"
                            autoComplete="off"
                            placeholder={t('invoiceInfo.placeholderCustomerName')}
                            value={customerName}
                            onChange={(e) => onCustomerNameChange(e.target.value)}
                            aria-invalid={customerNameError ? 'true' : 'false'}
                            aria-describedby={customerNameError ? 'customerNameError' : undefined}
                        />
                    </div>
                    {customerNameError && (
                        <div 
                            id="customerNameError"
                            className="error-message" 
                            style={{ display: 'block' }}
                            role="alert"
                        >
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {customerNameError}
                        </div>
                    )}
                </div>
                
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-phone me-2"></i>{t('invoiceInfo.customerPhone')}
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            id="customerPhone"
                            name="customerPhone"
                            autoComplete="off"
                            placeholder={t('invoiceInfo.placeholderCustomerPhone')}
                            value={customerPhone}
                            onChange={(e) => onCustomerPhoneChange(e.target.value)}
                            aria-label={t('invoiceInfo.customerPhone')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceInfoSection;