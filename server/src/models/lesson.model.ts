import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  content: string;
  module: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  order: number;
  duration?: number;
  videoUrl?: string;
  createdBy: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, required: true, default: 0 },
    duration: { type: Number, min: 0 },
    videoUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);


