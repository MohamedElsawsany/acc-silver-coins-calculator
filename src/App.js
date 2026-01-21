import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import SilverPriceSection from "./components/SilverPriceSection";
import TransactionTypeSelector from "./components/TransactionTypeSelector";
import ProductsTable from "./components/ProductsTable";
import TotalSection from "./components/TotalSection";
import LicenseModal from "./components/LicenseModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { useSilverCalculator } from "./hooks/useSilverCalculator";

function App() {
  const { t, i18n } = useTranslation();
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const {
    silverPrice,
    silverPrice925,
    transactionType,
    products,
    selectedRows,
    selectAll,
    grandTotal,
    silverPriceError,
    updateSilverPrice,
    handleTransactionTypeChange,
    updateProduct,
    addRow,
    removeSelectedRows,
    toggleRowSelection,
    toggleSelectAll,
  } = useSilverCalculator();

  const handleRemoveRows = () => {
    const success = removeSelectedRows();
    if (!success) {
      toast.warning(t('messages.selectToDelete'));
    }
  };

  // ✅ FIX: Determine RTL based on current language
  const isRTL = i18n.language === 'ar';

  return (
    <ErrorBoundary>
      <div className="container-fluid main-container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card main-card fade-in">
              <Header onShowLicense={() => setShowLicenseModal(true)} />

              <div className="card-body">
                <div className="copyright-notice">
                  <i className="fas fa-copyright"></i>
                  <strong>
                    {" "}
                    {t('copyright.text')}
                  </strong>{" "}
                  {t('copyright.notice')}
                  <button
                    className="btn btn-link btn-sm p-0 ms-2"
                    onClick={() => setShowLicenseModal(true)}
                  >
                    {t('copyright.viewLicense')}
                  </button>
                </div>

                <SilverPriceSection
                  silverPrice={silverPrice}
                  silverPrice925={silverPrice925}
                  silverPriceError={silverPriceError}
                  onSilverPriceChange={updateSilverPrice}
                />

                <div className="products-section">
                  <h4 className="section-title">
                    <i className="fas fa-shopping-cart"></i>
                    {t('products.title')}
                  </h4>

                  <TransactionTypeSelector
                    selectedType={transactionType}
                    onTypeChange={handleTransactionTypeChange}
                  />

                  <ProductsTable
                    products={products}
                    selectedRows={selectedRows}
                    selectAll={selectAll}
                    transactionType={transactionType}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleRowSelect={toggleRowSelection}
                    onUpdateProduct={updateProduct}
                  />

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="d-flex gap-2 btn-group-mobile">
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={handleRemoveRows}
                        >
                          <i className="fas fa-trash me-2"></i>{t('products.deleteSelected')}
                        </button>
                        <button
                          className="btn btn-success"
                          type="button"
                          onClick={addRow}
                        >
                          <i className="fas fa-plus me-2"></i>{t('products.addRow')}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        {t('products.helpText')}
                      </small>
                    </div>
                  </div>
                </div>

                <TotalSection grandTotal={grandTotal} />
              </div>
            </div>
          </div>
        </div>

        <div className="watermark">
          {t('watermark')}
        </div>

        <LicenseModal
          show={showLicenseModal}
          onHide={() => setShowLicenseModal(false)}
        />

        {/* ✅ FIX: Toast Container with RTL support */}
        <ToastContainer
          position={isRTL ? "top-left" : "top-right"}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={isRTL}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;