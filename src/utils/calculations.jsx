import { parseNumber } from './formatters';

export const getStampEnduserValue = (product, transactionType) => {
    switch (transactionType) {
        case 'sale':
            return product.stampEnduser;
        case 'return':
            return product.cashback;
        case 'returnUnpacked':
            return product.cashbackunpacking;
        default:
            return product.stampEnduser;
    }
};

export const calculateItemPrice = (product, quantity, silverPrice999, transactionType, silverPrice925, customStampValue = null) => {
    if (!product || quantity <= 0 || silverPrice999 <= 0) {
        return { itemPrice: 0, total: 0 };
    }

    const weight = product.weight;
    const karat = product.karat;
    
    // Use custom stamp value if provided, otherwise get from product based on transaction type
    const stampEnduser = customStampValue !== null && customStampValue > 0 
        ? customStampValue 
        : getStampEnduserValue(product, transactionType);
    
    // Determine which silver price to use based on karat
    let pricePerGram;
    if (karat === 999) {
        pricePerGram = silverPrice999 + stampEnduser;
    } else if (karat === 925) {
        pricePerGram = silverPrice925 + stampEnduser;
    } else {
        // Default fallback
        pricePerGram = silverPrice999 + stampEnduser;
    }
    
    const itemPrice = pricePerGram * weight;
    const total = itemPrice * quantity;

    return { itemPrice, total };
};

export const calculateSilverPrice925 = (silverPrice999) => {
    const price = parseNumber(silverPrice999);
    if (price > 0) {
        return price * (925 / 999);
    }
    return 0;
};

export const calculateGrandTotal = (products) => {
    return products.reduce((sum, product) => {
        if (product.total) {
            return sum + product.total;
        }
        return sum;
    }, 0);
};