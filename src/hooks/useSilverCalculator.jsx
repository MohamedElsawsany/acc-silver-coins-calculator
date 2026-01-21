import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { saleProducts } from '../data/products';
import { calculateItemPrice, calculateSilverPrice925, calculateGrandTotal, getStampEnduserValue } from '../utils/calculations';
import { parseNumber } from '../utils/formatters';
import { validateSilverPrice, validateQuantity } from '../utils/validators';
import { toast } from 'react-toastify';

export const useSilverCalculator = () => {
    const { t } = useTranslation();
    
    // Invoice information fields
    const [invoiceNo, setInvoiceNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [invoiceNoError, setInvoiceNoError] = useState('');
    const [customerNameError, setCustomerNameError] = useState('');
    
    const [silverPrice, setSilverPrice] = useState('');
    const [silverPrice925, setSilverPrice925] = useState('');
    const [transactionType, setTransactionType] = useState('sale');
    const [products, setProducts] = useState([
        { id: 1, productId: 0, quantity: '1', selectedProduct: null, stampEnduserValue: '', itemPrice: '', total: '' }
    ]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [silverPriceError, setSilverPriceError] = useState('');

    const grandTotal = calculateGrandTotal(
        products.map(p => ({ total: parseNumber(p.total) }))
    ).toString();

    useEffect(() => {
        if (products.length > 0 && selectedRows.size > 0) {
            const allSelected = products.every(p => selectedRows.has(p.id));
            setSelectAll(allSelected);
        } else if (selectedRows.size === 0) {
            setSelectAll(false);
        }
    }, [products, selectedRows]);

    // Invoice field handlers
    const updateInvoiceNo = useCallback((value) => {
        setInvoiceNo(value);
        if (value.trim()) {
            setInvoiceNoError('');
        }
    }, []);

    const updateSerialNo = useCallback((value) => {
        setSerialNo(value);
    }, []);

    const updateCustomerName = useCallback((value) => {
        setCustomerName(value);
        if (value.trim()) {
            setCustomerNameError('');
        }
    }, []);

    const updateCustomerPhone = useCallback((value) => {
        setCustomerPhone(value);
    }, []);

    // Validate invoice fields before printing
    const validateInvoiceFields = useCallback(() => {
        let isValid = true;
        
        if (!invoiceNo.trim()) {
            setInvoiceNoError(t('invoiceInfo.errors.invoiceNoRequired'));
            isValid = false;
        }
        
        if (!customerName.trim()) {
            setCustomerNameError(t('invoiceInfo.errors.customerNameRequired'));
            isValid = false;
        }
        
        return isValid;
    }, [invoiceNo, customerName, t]);

    // Reset form function
    const resetForm = useCallback(() => {
        setInvoiceNo('');
        setSerialNo('');
        setCustomerName('');
        setCustomerPhone('');
        setInvoiceNoError('');
        setCustomerNameError('');
        setSilverPrice('');
        setSilverPrice925('');
        setSilverPriceError('');
        setTransactionType('sale');
        setProducts([
            { id: 1, productId: 0, quantity: '1', selectedProduct: null, stampEnduserValue: '', itemPrice: '', total: '' }
        ]);
        setSelectedRows(new Set());
        setSelectAll(false);
    }, []);

    const updateSilverPrice = useCallback((value) => {
        let cleanValue = value.replace(/[^\d.]/g, '');
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (!cleanValue || cleanValue === '') {
            setSilverPrice('');
            setSilverPrice925('');
            setSilverPriceError('');
            setProducts(prevProducts => {
                return prevProducts.map(product => ({
                    ...product,
                    itemPrice: '',
                    total: ''
                }));
            });
            return;
        }

        const validation = validateSilverPrice(cleanValue || '0', t);
        const numericValue = parseFloat(cleanValue);
        let formattedValue = cleanValue;
        
        if (cleanValue.endsWith('.') && parts.length === 2 && parts[1] === '') {
            const formattedInteger = parseInt(parts[0]).toLocaleString('en-US');
            formattedValue = formattedInteger + '.';
        } else if (!isNaN(numericValue) && numericValue > 0) {
            const [integerPart, decimalPart] = cleanValue.split('.');
            const formattedInteger = parseInt(integerPart).toLocaleString('en-US');
            formattedValue = decimalPart !== undefined 
                ? `${formattedInteger}.${decimalPart}` 
                : formattedInteger;
        }

        setSilverPrice(formattedValue);

        if (cleanValue && !isNaN(cleanValue) && parseFloat(cleanValue) > 0) {
            if (!validation.valid) {
                setSilverPriceError(validation.error);
                toast.error(validation.error);
            } else {
                setSilverPriceError('');
                const price925 = calculateSilverPrice925(cleanValue);
                setSilverPrice925(price925.toString());
                
                setProducts(prevProducts => {
                    return prevProducts.map(product => {
                        if (product.selectedProduct) {
                            const stampValue = parseNumber(product.stampEnduserValue) > 0 
                                ? parseNumber(product.stampEnduserValue)
                                : getStampEnduserValue(product.selectedProduct, transactionType);
                            
                            if (product.quantity && parseNumber(product.quantity) > 0) {
                                try {
                                    const { itemPrice, total } = calculateItemPrice(
                                        product.selectedProduct,
                                        parseNumber(product.quantity),
                                        parseFloat(cleanValue),
                                        transactionType,
                                        price925,
                                        stampValue
                                    );
                                    return {
                                        ...product,
                                        itemPrice: itemPrice.toString(),
                                        total: total.toString()
                                    };
                                } catch (error) {
                                    console.error('Error calculating product:', error);
                                    return product;
                                }
                            }
                        }
                        return product;
                    });
                });
            }
        } else if (cleanValue) {
            setSilverPriceError(t('silverPrice.errors.required'));
        }
    }, [transactionType, t]);

    const recalculateAllProducts = useCallback((currentSilverPrice = silverPrice, currentTransactionType = transactionType) => {
        const price = parseNumber(currentSilverPrice);
        const price925 = calculateSilverPrice925(currentSilverPrice);

        setProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.selectedProduct) {
                    const newStampValue = getStampEnduserValue(product.selectedProduct, currentTransactionType);
                    
                    if (price > 0 && product.quantity) {
                        try {
                            const { itemPrice, total } = calculateItemPrice(
                                product.selectedProduct,
                                parseNumber(product.quantity),
                                price,
                                currentTransactionType,
                                price925,
                                newStampValue
                            );
                            return {
                                ...product,
                                stampEnduserValue: newStampValue.toString(),
                                itemPrice: itemPrice.toString(),
                                total: total.toString()
                            };
                        } catch (error) {
                            console.error('Error calculating product:', error);
                            toast.error(t('messages.calculationError'));
                            return {
                                ...product,
                                stampEnduserValue: newStampValue.toString()
                            };
                        }
                    } else {
                        return {
                            ...product,
                            stampEnduserValue: newStampValue.toString()
                        };
                    }
                }
                return product;
            });
        });
    }, [silverPrice, transactionType, t]);

    const handleTransactionTypeChange = useCallback((type) => {
        setTransactionType(type);
        recalculateAllProducts(silverPrice, type);
        const typeName = t(`transaction.${type}`);
        toast.info(t('transaction.typeChanged', { type: typeName }));
    }, [recalculateAllProducts, silverPrice, t]);

    const updateProduct = useCallback((id, field, value) => {
        setSilverPrice(currentSilverPrice => {
            setSilverPrice925(currentSilverPrice925 => {
                setProducts(prevProducts => {
                    const updatedProducts = prevProducts.map(product => {
                        if (product.id === id) {
                            const updated = { ...product, [field]: value };

                            if (field === 'productId') {
                                const productIndex = parseInt(value) - 1;
                                const selectedProduct = productIndex >= 0 ? saleProducts[productIndex] : null;
                                updated.selectedProduct = selectedProduct;
                                
                                if (selectedProduct) {
                                    updated.stampEnduserValue = getStampEnduserValue(selectedProduct, transactionType).toString();
                                } else {
                                    updated.stampEnduserValue = '';
                                    updated.itemPrice = '';
                                    updated.total = '';
                                }
                            }

                            if (field === 'quantity') {
                                if (value === '') {
                                    updated.quantity = '';
                                } else {
                                    const validation = validateQuantity(value, t);
                                    if (!validation.valid) {
                                        toast.warning(validation.error);
                                        return product;
                                    }
                                    const qty = parseInt(value);
                                    updated.quantity = (!isNaN(qty) && qty >= 1) ? qty.toString() : '';
                                }
                            }

                            if (field === 'stampEnduserValue') {
                                const numValue = parseFloat(value);
                                if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                                    updated.stampEnduserValue = value;
                                } else {
                                    return product;
                                }
                            }

                            const currentPrice = parseNumber(currentSilverPrice);
                            const currentPrice925 = parseNumber(currentSilverPrice925);
                            
                            if (updated.selectedProduct && updated.quantity && currentPrice > 0) {
                                try {
                                    const stampValue = parseNumber(updated.stampEnduserValue);
                                    const finalStampValue = stampValue > 0 
                                        ? stampValue 
                                        : getStampEnduserValue(updated.selectedProduct, transactionType);
                                    
                                    const { itemPrice, total } = calculateItemPrice(
                                        updated.selectedProduct,
                                        parseNumber(updated.quantity),
                                        currentPrice,
                                        transactionType,
                                        currentPrice925,
                                        finalStampValue
                                    );
                                    updated.itemPrice = itemPrice.toString();
                                    updated.total = total.toString();
                                } catch (error) {
                                    console.error('Error updating product:', error);
                                    toast.error(t('messages.calculationError'));
                                }
                            } else if ((field === 'quantity' && value === '') || (field === 'productId' && value === '0')) {
                                updated.itemPrice = '';
                                updated.total = '';
                            }

                            return updated;
                        }
                        return product;
                    });

                    return updatedProducts;
                });
                return currentSilverPrice925;
            });
            return currentSilverPrice;
        });
    }, [transactionType, t]);

    const addRow = useCallback(() => {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        setProducts(prev => [...prev, {
            id: newId,
            productId: 0,
            quantity: '1',
            selectedProduct: null,
            stampEnduserValue: '',
            itemPrice: '',
            total: ''
        }]);
        setSelectAll(false);
        toast.success(t('messages.rowAdded'));
    }, [products, t]);

    const removeSelectedRows = useCallback(() => {
        if (selectedRows.size === 0) {
            return false;
        }

        setProducts(prev => prev.filter(p => !selectedRows.has(p.id)));
        setSelectedRows(new Set());
        setSelectAll(false);
        toast.success(t('messages.rowsDeleted', { count: selectedRows.size }));
        return true;
    }, [selectedRows, t]);

    const toggleRowSelection = useCallback((id) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectAll) {
            setSelectedRows(new Set());
            setSelectAll(false);
        } else {
            setSelectedRows(new Set(products.map(p => p.id)));
            setSelectAll(true);
        }
    }, [selectAll, products]);

    return {
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
        resetForm
    };
};