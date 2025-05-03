import crypto from 'crypto';

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

export { generateOtp, hashOtp };