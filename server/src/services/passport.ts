import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/user.model.ts";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "../config/index.ts";

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(done);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                provider: "google",
                providerId,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value,
                lastLogin: new Date(),
                role: "student",
                isActive: true,

            });
        }
        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}));

export default passport;