import { hashOtp } from "./generateOtp";
import { client, connectRedis } from "./redisClient";

interface StoredOtp {
    hash: string;
    expiresAt: number;
}


const storeHashedOtp = async (email: string, hash: string): Promise<void> => {
    try {
        await connectRedis();

        const otpData: StoredOtp = {
            hash,
            expiresAt: Date.now() + 5 * 60 * 1000, //5 min
        };

        // Store in Redis with TTL of 5 minutes (300 seconds)
        await client.set(`otp:${email}`, JSON.stringify(otpData), {
            EX: 300 
        });
        console.log(`OTP stored for email: ${email}`);

    } catch (error) {
        console.error('Error storing OTP in redis: ', (error as Error));
        throw new Error('Failed to store OTP!')
    }
}

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
        await connectRedis();

        const storedData = await client.get(`otp:${email}`);

        if (!storedData) {
            console.log(`No OTP found for email: ${email}`);
            return false;
        }

        const entry: StoredOtp = JSON.parse(storedData);

        if (Date.now() > entry.expiresAt) {
            console.log(`OTP expired for email: ${email}`);
            await client.del(`otp:${email}`);
            return false;
        }

        const providedHash = hashOtp(otp);
        const isValid = providedHash === entry.hash;

        if (isValid) {
            await client.del(`otp:${email}`);
            console.log(`OTP verified and deleted for email: ${email}`);
        }

        return isValid;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};

const cleanupExpiredOtps = async (): Promise<void> => {
    try {
        await connectRedis();

        const keys = await client.keys('otp:*');

        for (const key of keys) {
            const data = await client.get(key);
            if (data) {
                const entry: StoredOtp = JSON.parse(data);
                if (Date.now() > entry.expiresAt) {
                    await client.del(key);
                    console.log(`Cleaned up expired OTP: ${key}`);
                }
            }
        }
    } catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
    }
};

export { storeHashedOtp, verifyOtp, cleanupExpiredOtps };