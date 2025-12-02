import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  heading: string;
  description: string;
  average_duration: number;
  imageurl?: string;
  category: mongoose.Types.ObjectId;
  modules: mongoose.Types.ObjectId[];
  lessons: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    average_duration: { type: Number, required: true, min: 0 },
    imageurl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICourse>('Course', courseSchema);


