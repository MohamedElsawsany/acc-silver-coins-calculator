import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import InvoiceInfoSection from "./components/InvoiceInfoSection";
import SilverPriceSection from "./components/SilverPriceSection";
import TransactionTypeSelector from "./components/TransactionTypeSelector";
import ProductsTable from "./components/ProductsTable";
import TotalSection from "./components/TotalSection";
import LicenseModal from "./components/LicenseModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { useSilverCalculator } from "./hooks/useSilverCalculator";
import { printInvoice } from "./utils/printUtils";
import { parseNumber } from "./utils/formatters";

function App() {
  const { t, i18n } = useTranslation();
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const {
    // Invoice info
    invoiceNo,
    serialNo,
    customerName,
    customerPhone,
    invoiceNoError,
    customerNameError,
    updateInvoiceNo,
    updateSerialNo,
    updateCustomerName,
    updateCustomerPhone,
    validateInvoiceFields,
    
    // Silver calculator
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
    resetForm,
  } = useSilverCalculator();

  const handleRemoveRows = () => {
    const success = removeSelectedRows();
    if (!success) {
      toast.warning(t('messages.selectToDelete'));
    }
  };

  const handlePrint = () => {
    // Validate invoice fields
    if (!validateInvoiceFields()) {
      toast.error(t('messages.printValidationError'));
      return;
    }

    // Validate that we have at least one product with data
    const validProducts = products.filter(p => 
      p.selectedProduct && 
      parseNumber(p.quantity) > 0 && 
      parseNumber(p.total) > 0
    );

    if (validProducts.length === 0) {
      toast.error(t('messages.noProductsToPrint'));
      return;
    }

    // Prepare invoice data
    const invoiceData = {
      invoice_no: invoiceNo,
      serial_no: serialNo || null,
      customer_name: customerName,
      customer_phone: customerPhone || '',
      created_date: new Date().toISOString(),
      total_price: parseNumber(grandTotal),
      items: validProducts.map(product => ({
        item_name: product.selectedProduct.name,
        item_karat: product.selectedProduct.karat,
        item_weight: product.selectedProduct.weight,
        item_quantity: parseNumber(product.quantity),
        item_price: parseNumber(product.itemPrice),
        item_total_price: parseNumber(product.total)
      }))
    };

    // Print the invoice
    printInvoice(invoiceData);

    // Reset the form after printing
    toast.success(t('messages.invoicePrinted'));
    
    // Reset all fields after a short delay to allow the print dialog to open
    setTimeout(() => {
      resetForm();
      toast.info(t('messages.formReset'));
    }, 500);
  };

  // Determine RTL based on current language
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

                <InvoiceInfoSection
                  invoiceNo={invoiceNo}
                  serialNo={serialNo}
                  customerName={customerName}
                  customerPhone={customerPhone}
                  invoiceNoError={invoiceNoError}
                  customerNameError={customerNameError}
                  onInvoiceNoChange={updateInvoiceNo}
                  onSerialNoChange={updateSerialNo}
                  onCustomerNameChange={updateCustomerName}
                  onCustomerPhoneChange={updateCustomerPhone}
                />

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
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handlePrint}
                      >
                        <i className="fas fa-print me-2"></i>{t('actions.print')}
                      </button>
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