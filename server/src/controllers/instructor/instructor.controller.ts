import { Request, Response } from "express";
import User from "../../models/user.model.ts";
import Instructor from "../../models/instructor.model.ts";
export const createProfile = async (req: Request, res: Response) => {
    try {
        const { headline, language, bio, skills, experience, website, youtube, twitter, facebook, instagram, linkedin, github, domainOfExpertise, teachingExperience } = req.body;
        const user = req.user as any;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userData = await User.findById(user.sub);
        if (!userData) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const instructorData = await Instructor.findOne({ userid: user.sub });
        if (instructorData) {
            res.status(400).json({ message: "Profile already exists" });
            return;
        }

        const instructor = await Instructor.create({
            userid: user.sub,
            headline,
            language,
            bio,
            skills,
            experience: String(experience),
            website,
            youtube,
            twitter,
            facebook,
            instagram,
            linkedin,
            github,
            domainOfExpertise,
            teachingExperience
        });

        // Update user role to instructor
        await User.findByIdAndUpdate(user.sub, { role: "instructor" });

        res.status(201).json({ message: "Profile created successfully", instructor });
        return;

    } catch (error: any) {
        console.log(error, "error in create profile");
        res.status(500).json({ message: "Internal server error", detail: error.message });
        return;

    }
};
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userData = await User.findById(user.sub);
        if (!userData) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const instructor = await Instructor.findOne({ userid: user.sub });
        if (!instructor) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.status(200).json({ instructor });
        return;
    } catch (error: any) {
        console.log(error, "error in get profile");
        res.status(500).json({ message: "Internal server error", detail: error.message });
        return;
    }
};