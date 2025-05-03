import { hashOtp } from "./generateOtp";

interface StoredOtp {
    hash: string;
    expiresAt: number;
}

const otpStore = new Map<string, StoredOtp>();

const storeHashedOtp = (email: string, hash: string) => {
    otpStore.set(email, {
        hash,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });
}

const verifyOtp = (email: string, otp: string): boolean => {
    const entry = otpStore.get(email);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;

    const providedHash = hashOtp(otp);
    return providedHash === entry.hash;
}

export { storeHashedOtp, verifyOtp };