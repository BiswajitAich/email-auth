import { generateOtp, hashOtp } from './utils/generateOtp';
import { sendEmail } from './utils/sendEmail';
import { storeHashedOtp, verifyOtp, cleanupExpiredOtps } from './utils/verifyOtp';
import { client, connectRedis } from './utils/redisClient';

// Main function to send OTP
export const sendOtpEmail = async (email: string, from?: string): Promise<{ success: boolean; message: string }> => {
    try {
        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);
                
        // Store hashed OTP in Redis
        await storeHashedOtp(email, hashedOtp);
        
        await sendEmail(email, otp, from);

        return {
            success: true,
            message: 'OTP sent successfully',
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return {
            success: false,
            message: 'Failed to send OTP'
        };
    }
};

// Main function to verify OTP
export const verifyOtpCode = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
        const isValid = await verifyOtp(email, otp);
        
        if (isValid) {
            return {
                success: true,
                message: 'OTP verified successfully'
            };
        } else {
            return {
                success: false,
                message: 'Invalid or expired OTP'
            };
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return {
            success: false,
            message: 'Failed to verify OTP'
        };
    }
};

// Graceful shutdown
export const closeRedisConnection = async (): Promise<void> => {
    try {
        await client.quit();
        console.log('Redis connection closed');
    } catch (error) {
        console.error('Error closing Redis connection:', error);
    }
};

export { 
//     sendEmail, 
//     generateOtp, 
//     verifyOtp, 
//     hashOtp, 
//     storeHashedOtp, 
    cleanupExpiredOtps,
//     connectRedis,
//     client as redisClient
};