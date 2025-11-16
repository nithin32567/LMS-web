import { Request, Response } from "express";
import passport from "../../services/passport.ts";
import { createTokenForUser, rotateRefreshToken } from "../../services/auth.services.ts";
import RefreshToken from "../../models/refreshToken.ts";
import validateEmail from "../../utils/validateEmail.ts";
import generateOTP from "../../utils/generateOtp.ts";
import { sendOtpEmail } from "../../services/otp-service.ts";
import User from "../../models/user.model.ts";


export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] })
// console.log(googleAuth, "google auth");
export const googleCallback = async (req: Request, res: Response, next: any) => {

    passport.authenticate("google", { session: false }, async (err, user: any) => {
        try {

            if (err || !user) {
                console.log(err, "error");
                // console.log(user, "user");
                return res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
            }
            const { accessToken, refreshToken } = await createTokenForUser(user);
            // console.log(accessToken, refreshToken, "access and refresh token");
            // console.log(user, "user in the auth controller");

            res.cookie("jid", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.redirect(`${process.env.CLIENT_URL}/auth`);
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.jid;
        // console.log("token", token);
        if (!token) return res.status(401).json({ message: "No refresh token" });
        const { accessToken, refreshToken } = await rotateRefreshToken(token);
        res.cookie("jid", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken });
    } catch (err: any) {
        return res.status(401).json({ message: "Could not refresh", detail: err.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    if (token) {
        await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
    }
    res.clearCookie("jid", { path: "/" });
    res.json({ ok: true });
};
// signup with email and otp
export const signupWithEmailAndOtp = async (req: Request, res: Response) => {
    try {
        const { name, email }: { name: string, email: string } = req.body;
        const valid = validateEmail(email as string);
        if (!valid) {
            res.status(400).json({ message: "Invalid email" });
            return
        }
        const otp = await generateOTP();
        const emailSent = await sendOtpEmail(email, otp);
        if (!emailSent) {
            res.status(400).json({ message: "Failed to send OTP to email" });
            return
        }
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    otp,
                    otpExpiresAt
                },
                $setOnInsert: {
                    name,
                    email,
                    otpVerified: false
                }
            },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "OTP sent to email" });
        return
    } catch (error: any) {
        console.log(error, "error in signup with email and otp");
        res.status(500).json({ message: "Internal server error", detail: error.message });
        return
    }
}
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return
        }
        if (user.otp !== otp) {
            res.status(400).json({ message: "Invalid OTP" });
            return
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            res.status(400).json({ message: "OTP expired" });
            return
        }
        user.otpVerified = true;
        user.otp = "";
        user.otpExpiresAt = null;
        user.inactiveSince = null;
        user.isActive = true;
        user.provider = "local";
        user.role = "student";
        user.avatar = "";
        await user.save();

        const { accessToken, refreshToken } = await createTokenForUser(user);
        res.cookie("jid", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "OTP verified", accessToken, user: user.toObject() });
        return

    } catch (error: any) {
        console.log(error, "error in verify otp");
        res.status(500).json({ message: "Internal server error", detail: error.message });
        return
    }
}