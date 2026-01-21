export const validateSilverPrice = (price, t) => {
    const numericValue = parseFloat(price.replace(/,/g, ''));
    
    if (isNaN(numericValue)) {
        return { valid: false, error: t('silverPrice.errors.invalid') };
    }
    
    if (numericValue <= 0) {
        return { valid: false, error: t('silverPrice.errors.tooLow') };
    }
    
    if (numericValue > 100000) {
        return { valid: false, error: t('silverPrice.errors.tooHigh') };
    }
    
    return { valid: true, error: null };
};

export const validateQuantity = (quantity, t) => {
    const num = parseInt(quantity);
    
    if (isNaN(num)) {
        return { valid: false, error: t('validation.quantity.invalid') };
    }
    
    if (num < 1) {
        return { valid: false, error: t('validation.quantity.min') };
    }
    
    if (num > 9999) {
        return { valid: false, error: t('validation.quantity.max') };
    }
    
    return { valid: true, error: null };
};

export const sanitizeNumericInput = (value, maxLength = 15) => {
    return value.replace(/[^\d.]/g, '').slice(0, maxLength);
};