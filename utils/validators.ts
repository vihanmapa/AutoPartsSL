export const validateVIN = (input: string): boolean => {
    if (!input) return false;

    // 1. Auto-Clean: Remove dashes, spaces, and convert to Uppercase
    // User input: "nhp10 - 12345" -> "NHP1012345"
    const clean = input.replace(/[\s-]/g, '').toUpperCase();

    // 2. Regex Rule: 
    // ^[A-Z0-9]  = Start with Letter or Number
    // {10,17}    = Must be between 10 and 17 characters long
    // $          = End of string (No hidden symbols)
    const regex = /^[A-Z0-9]{10,17}$/;

    return regex.test(clean);
};

export const formatVIN = (input: string): string => {
    return input.replace(/[\s-]/g, '').toUpperCase();
};
