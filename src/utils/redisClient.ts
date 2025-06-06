import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

let retryAttempts = 0;
const MAX_RETRIES = 3;

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        reconnectStrategy: (retries) => {
            if (retries >= MAX_RETRIES) {
                console.error(`Exceeded maximum retry attempts (${MAX_RETRIES}).`);
                return new Error("Retry limit reached");
            }
            retryAttempts++;
            console.log(`Retrying Redis connection... attempt ${retryAttempts}`);
            // Retry after 2^retries * 100 ms, e.g., 100, 200, 400, ...
            return Math.min(2 ** retries * 100, 2000);
        }
    },
});


client.on('error', (err) => {
    console.error('Redis client Error: ', err);
});

client.on('connect', () => {
    console.error('Redis connnected!');
    retryAttempts = 0;
});

client.on('end', () => {
    console.log('Redis connection ended');
});

const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Redis connected successfully');
        }
        return true;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
}

export { client, connectRedis };