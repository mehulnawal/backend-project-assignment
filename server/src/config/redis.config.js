import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => console.log("Redis Error", err));

(async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (error) {
        console.log("Redis connection failed");
    }
})();

export default redisClient;