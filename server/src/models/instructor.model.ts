import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

interface IInstructor extends Document {
    userid: Types.ObjectId;
    bio: string;
    skills: string[];
    experience: string[];
    headline: string;
    language: string;
    website: string;
    youtube: string;
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    github: string;
    domainOfExpertise: string;
    teachingExperience: number;
}

const instructorSchema = new Schema<IInstructor>({
    userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
    headline: { type: String, required: true },
    language: { type: String, required: true },
    bio: { type: String, required: true },
    skills: { type: [String], required: true },
    experience: { type: [String], required: true },
    website: { type: String, required: true },
    youtube: { type: String, required: true },
    twitter: { type: String, required: true },
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    domainOfExpertise: { type: String, required: true },
    teachingExperience: { type: Number, required: true },

});

export default mongoose.model<IInstructor>("Instructor", instructorSchema);