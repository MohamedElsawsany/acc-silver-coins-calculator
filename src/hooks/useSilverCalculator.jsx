import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { saleProducts } from '../data/products';
import { calculateItemPrice, calculateSilverPrice925, calculateGrandTotal, getStampEnduserValue } from '../utils/calculations';
import { parseNumber } from '../utils/formatters';
import { validateSilverPrice, validateQuantity } from '../utils/validators';
import { toast } from 'react-toastify';

export const useSilverCalculator = () => {
    const { t } = useTranslation();
    const [silverPrice, setSilverPrice] = useState('');
    const [silverPrice925, setSilverPrice925] = useState('');
    const [transactionType, setTransactionType] = useState('sale');
    const [products, setProducts] = useState([
        { id: 1, productId: 0, quantity: '1', selectedProduct: null, stampEnduserValue: '', itemPrice: '', total: '' }
    ]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [silverPriceError, setsilverPriceError] = useState('');

    // Simple derived value - recalculates on every render (fast enough for simple arithmetic)
    const grandTotal = calculateGrandTotal(
        products.map(p => ({ total: parseNumber(p.total) }))
    ).toString();

    // ✅ FIX: Sync selectAll state when products or selectedRows change
    useEffect(() => {
        if (products.length > 0 && selectedRows.size > 0) {
            const allSelected = products.every(p => selectedRows.has(p.id));
            setSelectAll(allSelected);
        } else if (selectedRows.size === 0) {
            setSelectAll(false);
        }
    }, [products.length, selectedRows.size]); // Only depend on length/size to avoid over-triggering

    const updateSilverPrice = useCallback((value) => {
        // Remove non-numeric characters except decimal point
        let cleanValue = value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }

        // ✅ FIX: If field is completely empty, clear everything
        if (!cleanValue || cleanValue === '') {
            setSilverPrice('');
            setSilverPrice925('');
            setsilverPriceError('');
            
            // Clear all product calculations
            setProducts(prevProducts => {
                return prevProducts.map(product => ({
                    ...product,
                    itemPrice: '',
                    total: ''
                }));
            });
            return;
        }

        // Validate before updating - ✅ PASS t FUNCTION
        const validation = validateSilverPrice(cleanValue || '0', t);

        // ✅ FIX: Format with commas as user types, but preserve trailing decimal
        const numericValue = parseFloat(cleanValue);
        let formattedValue = cleanValue;
        
        // Preserve trailing decimal point for better UX
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
                setsilverPriceError(validation.error);
                toast.error(validation.error);
            } else {
                setsilverPriceError('');
                const price925 = calculateSilverPrice925(cleanValue);
                setSilverPrice925(price925.toString());
                
                // Force recalculation with the new silver price for all products
                setProducts(prevProducts => {
                    return prevProducts.map(product => {
                        if (product.selectedProduct) {
                            const stampValue = parseNumber(product.stampEnduserValue) > 0 
                                ? parseNumber(product.stampEnduserValue)
                                : getStampEnduserValue(product.selectedProduct, transactionType);
                            
                            // Calculate if we have quantity
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
            setsilverPriceError(t('silverPrice.errors.required'));
        }
    }, [transactionType, t]);

    const recalculateAllProducts = useCallback((currentSilverPrice = silverPrice, currentTransactionType = transactionType) => {
        const price = parseNumber(currentSilverPrice);
        const price925 = calculateSilverPrice925(currentSilverPrice);

        setProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.selectedProduct) {
                    // Update stampEnduserValue based on transaction type
                    const newStampValue = getStampEnduserValue(product.selectedProduct, currentTransactionType);
                    
                    // If we have silver price and quantity, calculate everything
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
                        // Even without silver price, update the stamp value
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
        
        // Get translated type name
        const typeName = t(`transaction.${type}`);
        toast.info(t('transaction.typeChanged', { type: typeName }));
    }, [recalculateAllProducts, silverPrice, t]);

    // ✅ MAIN FIX: Use state setter function pattern to access latest state
    const updateProduct = useCallback((id, field, value) => {
        // Access latest state values using the functional update pattern
        setSilverPrice(currentSilverPrice => {
            setSilverPrice925(currentSilverPrice925 => {
                setProducts(prevProducts => {
                    const updatedProducts = prevProducts.map(product => {
                        if (product.id === id) {
                            const updated = { ...product, [field]: value };

                            // ✅ FIX: Better product ID handling
                            if (field === 'productId') {
                                const productIndex = parseInt(value) - 1;
                                const selectedProduct = productIndex >= 0 ? saleProducts[productIndex] : null;
                                updated.selectedProduct = selectedProduct;
                                
                                // Update stampEnduserValue when product changes
                                if (selectedProduct) {
                                    updated.stampEnduserValue = getStampEnduserValue(selectedProduct, transactionType).toString();
                                } else {
                                    updated.stampEnduserValue = '';
                                    // Clear calculations if product is cleared
                                    updated.itemPrice = '';
                                    updated.total = '';
                                }
                            }

                            // ✅ FIX: Better quantity validation and handling - PASS t FUNCTION
                            if (field === 'quantity') {
                                // Allow empty string for clearing the field
                                if (value === '') {
                                    updated.quantity = '';
                                } else {
                                    const validation = validateQuantity(value, t);
                                    if (!validation.valid) {
                                        toast.warning(validation.error);
                                        return product; // Don't update if invalid
                                    }
                                    const qty = parseInt(value);
                                    updated.quantity = (!isNaN(qty) && qty >= 1) ? qty.toString() : '';
                                }
                            }

                            // Handle stampEnduserValue field update
                            if (field === 'stampEnduserValue') {
                                // Allow user to edit this field
                                const numValue = parseFloat(value);
                                if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                                    updated.stampEnduserValue = value;
                                } else {
                                    return product; // Don't update if invalid
                                }
                            }

                            // ✅ CRITICAL FIX: Use current state values to avoid closure issues
                            const currentPrice = parseNumber(currentSilverPrice);
                            const currentPrice925 = parseNumber(currentSilverPrice925);
                            
                            // Recalculate if we have all necessary data
                            if (updated.selectedProduct && updated.quantity && currentPrice > 0) {
                                try {
                                    // Use the updated stamp value if it exists and is valid, otherwise get default
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
                                // Clear prices when quantity is cleared or product is deselected
                                updated.itemPrice = '';
                                updated.total = '';
                            }

                            return updated;
                        }
                        return product;
                    });

                    return updatedProducts;
                });
                
                // Return the same value to not update silverPrice925
                return currentSilverPrice925;
            });
            
            // Return the same value to not update silverPrice
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
        // ✅ FIX: Reset select all when adding new row
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
        toggleSelectAll
    };
};