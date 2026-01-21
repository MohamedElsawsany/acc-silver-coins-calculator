import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductRow from './ProductRow';
import { saleProducts } from '../data/products';

const ProductsTable = ({
    products,
    selectedRows,
    selectAll,
    transactionType,
    onToggleSelectAll,
    onToggleRowSelect,
    onUpdateProduct
}) => {
    const { t } = useTranslation();

    // Get the header label based on transaction type
    const getStampHeader = () => {
        switch (transactionType) {
            case 'sale':
                return t('transaction.stamp');
            case 'return':
                return t('transaction.cashback');
            case 'returnUnpacked':
                return t('transaction.cashbackUnpacked');
            default:
                return t('transaction.stamp');
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered text-center" id="invoiceProducts">
                <thead>
                    <tr>
                        <th width="6%">
                            <div className="checkbox-container">
                                <input
                                    id="checkAll"
                                    className="form-check-input"
                                    type="checkbox"
                                    title={t('table.selectAll')}
                                    checked={selectAll}
                                    onChange={onToggleSelectAll}
                                    aria-label={t('aria.selectAllProducts')}
                                />
                            </div>
                        </th>
                        <th width="25%"><i className="fas fa-box me-2"></i>{t('table.product')}</th>
                        <th width="10%"><i className="fas fa-sort-numeric-up me-2"></i>{t('table.qty')}</th>
                        <th width="12%"><i className="fas fa-tag me-2"></i>{getStampHeader()}</th>
                        <th width="20%"><i className="fas fa-dollar-sign me-2"></i>{t('table.itemPrice')}</th>
                        <th width="20%"><i className="fas fa-calculator me-2"></i>{t('table.total')}</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    {products.map(product => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            isSelected={selectedRows.has(product.id)}
                            onToggleSelect={onToggleRowSelect}
                            onUpdate={onUpdateProduct}
                            saleProducts={saleProducts}
                            transactionType={transactionType}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;