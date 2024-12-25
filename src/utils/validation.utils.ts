export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[0-9]+@students\.uin-suska\.ac\.id$/;
    return emailRegex.test(email);
};

export const isValidNIM = (nim: string): boolean => {
    return /^\d{11}$/.test(nim);
};