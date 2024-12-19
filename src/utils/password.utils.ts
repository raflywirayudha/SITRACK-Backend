import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateDefaultPassword = (): string => {
    return Math.random().toString(36).slice(-8);
}