import { Request, Response } from "express";
import passport from "../../services/passport.ts";
import { createTokenForUser, rotateRefreshToken } from "../../services/auth.services.ts";
import RefreshToken from "../../models/refreshToken.ts";


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