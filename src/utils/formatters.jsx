export const formatMoney = (value) => {
    if (isNaN(value) || value === null || value === undefined) return '0.00';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};

// ✅ FIX: Improved parseNumber with better edge case handling
export const parseNumber = (value) => {
    // Handle explicit null, undefined, or empty string
    if (value === null || value === undefined || value === '') return 0;
    
    // If already a number, return it
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    
    // Convert to string and remove commas, then parse
    const numStr = value.toString().replace(/,/g, '');
    const parsed = parseFloat(numStr);
    
    return isNaN(parsed) ? 0 : parsed;
};

// Note: debounce function removed as it's not used anywhere in the codebase
// If you need it in the future, here's the implementation:
/*
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
*/