import mongoose, { Schema, Document } from 'mongoose';

export interface ResumeAnalysisDocument extends Document {
  atsScore: number;
  jobRole: string;
  industry: string;
  createdAt: Date;
}

const ResumeAnalysisSchema = new Schema(
  {
    atsScore: {
      type: Number,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ResumeAnalysisDocument>(
  'ResumeAnalysis',
  ResumeAnalysisSchema
);