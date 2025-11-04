import jwt, { type SignOptions } from "jsonwebtoken";
import User, { type IUser } from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string || "7d";

const generateToken = (user: IUser) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] });
};


export const AuthServices = {
    async register({ name, email, password, provider = "local", googleId }: any) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists with this email.");
        }

        const saltRounds = await bcrypt.genSalt(10);

        const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : null;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider,
            googleId: googleId || null,
            role: null, // can assign a default role via Role model if needed
        });

        return user;
    },
}
