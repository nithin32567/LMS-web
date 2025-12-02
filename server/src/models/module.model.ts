import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  title: string;
  description: string;
  course: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  order: number;
  createdBy: mongoose.Types.ObjectId;
}

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    order: { type: Number, required: true, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IModule>('Module', moduleSchema);


