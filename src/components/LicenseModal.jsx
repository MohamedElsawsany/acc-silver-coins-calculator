import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LicenseModal = ({ show, onHide }) => {
    const { t } = useTranslation();

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <div className="modal-content license-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        <i className="fas fa-certificate me-2"></i>
                        {t('license.title')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="license-section">
                        <h5>
                            <i className="fas fa-info-circle"></i> {t('license.productInfo.title')}
                        </h5>
                        <p>
                            <strong>{t('license.productInfo.software')}</strong> {t('license.productInfo.softwareName')}
                        </p>
                        <p>
                            <strong>{t('license.productInfo.version')}</strong> {t('license.productInfo.versionNumber')}
                        </p>
                        <p>
                            <strong>{t('license.productInfo.copyright')}</strong> {t('license.productInfo.copyrightText')}
                        </p>
                        <p>
                            <strong>{t('license.productInfo.licenseType')}</strong> {t('license.productInfo.licenseTypeName')}
                        </p>
                    </div>

                    <div className="license-section">
                        <h5>
                            <i className="fas fa-user-check"></i> {t('license.userRights.title')}
                        </h5>
                        <ul>
                            <li>{t('license.userRights.use')}</li>
                            <li>{t('license.userRights.manage')}</li>
                            <li>{t('license.userRights.access')}</li>
                        </ul>
                    </div>

                    <div className="license-section">
                        <h5>
                            <i className="fas fa-ban"></i> {t('license.restrictions.title')}
                        </h5>
                        <ul>
                            <li>
                                <strong>{t('license.restrictions.noCopying')}</strong> {t('license.restrictions.noCopyingText')}
                            </li>
                            <li>
                                <strong>{t('license.restrictions.noDistribution')}</strong> {t('license.restrictions.noDistributionText')}
                            </li>
                            <li>
                                <strong>{t('license.restrictions.noReverseEngineering')}</strong> {t('license.restrictions.noReverseEngineeringText')}
                            </li>
                            <li>
                                <strong>{t('license.restrictions.noModification')}</strong> {t('license.restrictions.noModificationText')}
                            </li>
                            <li>
                                <strong>{t('license.restrictions.noCommercial')}</strong> {t('license.restrictions.noCommercialText')}
                            </li>
                        </ul>
                    </div>

                    <div className="license-section">
                        <h5>
                            <i className="fas fa-exclamation-triangle"></i> {t('license.legalNotice.title')}
                        </h5>
                        <p>{t('license.legalNotice.text')}</p>
                        <p>
                            <strong>{t('license.legalNotice.violations')}</strong>
                        </p>
                        <ul>
                            <li>{t('license.legalNotice.termination')}</li>
                            <li>{t('license.legalNotice.legal')}</li>
                            <li>{t('license.legalNotice.damages')}</li>
                        </ul>
                    </div>

                    <div className="license-section">
                        <h5>
                            <i className="fas fa-phone"></i> {t('license.contact.title')}
                        </h5>
                        <p>
                            <strong>{t('license.contact.support')}</strong> {t('license.contact.email')}
                        </p>
                        <p>
                            <strong>{t('license.contact.phone')}</strong> {t('license.contact.phoneNumber')}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {t('actions.close')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default LicenseModal;