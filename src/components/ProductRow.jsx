import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { formatMoney, parseNumber } from '../utils/formatters';

const ProductRow = memo(({ product, isSelected, onToggleSelect, onUpdate, saleProducts, transactionType }) => {
    const { t } = useTranslation();

    // Transform products into react-select options
    const productOptions = saleProducts.map((p, index) => ({
        value: index + 1,
        label: p.name,
        product: p
    }));

    // Find selected option
    const selectedOption = productOptions.find(opt => opt.value === parseInt(product.productId)) || null;

    // Get the label for the stamp field based on transaction type
    const getStampLabel = () => {
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

    // Custom styles for react-select with RTL support - SILVER THEME
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '2px solid #C0C0C0',
            borderRadius: '8px',
            padding: '4px',
            fontSize: '1rem',
            minHeight: '45px',
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(192, 192, 192, 0.25)' : 'none',
            '&:hover': {
                borderColor: '#C0C0C0'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? '#C0C0C0' 
                : state.isFocused 
                ? '#F0F0F0' 
                : 'white',
            color: state.isSelected ? 'white' : '#000',
            padding: '10px 15px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            textAlign: document.documentElement.dir === 'rtl' ? 'right' : 'left',
            '&:active': {
                backgroundColor: '#C0C0C0'
            }
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid #C0C0C0'
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '300px',
            borderRadius: '8px'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000'
        }),
        input: (provided) => ({
            ...provided,
            color: '#000'
        })
    };

    const handleSelectChange = (selectedOption) => {
        onUpdate(product.id, 'productId', selectedOption ? selectedOption.value.toString() : '0');
    };

    return (
        <tr className="slide-in">
            <td>
                <div className="checkbox-container">
                    <input
                        className="itemRow form-check-input"
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        aria-label={t('aria.selectRow', { id: product.id })}
                    />
                </div>
            </td>
            <td>
                <Select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    options={productOptions}
                    styles={customStyles}
                    placeholder={t('products.selectProduct')}
                    isClearable
                    isSearchable
                    isRtl={document.documentElement.dir === 'rtl'}
                    noOptionsMessage={() => t('products.noProducts')}
                    aria-label={t('aria.selectProduct')}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="productQty[]"
                    required
                    className="form-control qty"
                    autoComplete="off"
                    placeholder={t('products.quantity')}
                    min="1"
                    value={product.quantity}
                    onChange={(e) => onUpdate(product.id, 'quantity', e.target.value)}
                    aria-label={t('aria.productQuantity')}
                    style={{ textAlign: 'center' }}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="stampEnduser[]"
                    className="form-control"
                    autoComplete="off"
                    placeholder={getStampLabel()}
                    value={product.stampEnduserValue}
                    onChange={(e) => onUpdate(product.id, 'stampEnduserValue', e.target.value)}
                    aria-label={getStampLabel()}
                    title={`${t('actions.edit')} ${getStampLabel()}`}
                    style={{ textAlign: 'center' }}
                />
            </td>
            <td>
                <input
                    type="text"
                    required
                    name="productPrice[]"
                    className="form-control total-input"
                    autoComplete="off"
                    readOnly
                    value={product.itemPrice ? formatMoney(parseNumber(product.itemPrice)) : ''}
                    aria-label={t('aria.itemPrice')}
                />
            </td>
            <td>
                <input
                    readOnly
                    type="text"
                    name="totalQtyProductPrice[]"
                    required
                    className="form-control price total-input"
                    autoComplete="off"
                    value={product.total ? formatMoney(parseNumber(product.total)) : ''}
                    aria-label={t('aria.totalPrice')}
                />
            </td>
        </tr>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.productId === nextProps.product.productId &&
        prevProps.product.quantity === nextProps.product.quantity &&
        prevProps.product.stampEnduserValue === nextProps.product.stampEnduserValue &&
        prevProps.product.itemPrice === nextProps.product.itemPrice &&
        prevProps.product.total === nextProps.product.total &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.transactionType === nextProps.transactionType
    );
});

ProductRow.displayName = 'ProductRow';

export default ProductRow;