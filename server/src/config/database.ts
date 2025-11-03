import mongoose from "mongoose";

const connectDB = async () => {
    const mongguri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;
    try {
        const conn = await mongoose.connect(mongguri as string);

        console.log(
            `[Database] MongoDB Connected Successfully: ${conn.connection.host}`
        );
    } catch (error) {
        console.error(`[Database] Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
};

export default connectDB;
