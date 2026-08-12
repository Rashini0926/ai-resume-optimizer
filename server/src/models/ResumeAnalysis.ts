import mongoose, { Document, Schema } from 'mongoose';

export interface ResumeAnalysisDocument extends Document {
  userId: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  jobRole: string;
  industry: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeAnalysisSchema = new Schema<ResumeAnalysisDocument>(
  {
    userId: { type: String, required: true, default: 'anonymous', index: true },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    matchedKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    jobRole: { type: String, required: true, default: 'General', index: true },
    industry: { type: String, required: true, default: 'General', index: true },
  },
  { timestamps: true }
);

ResumeAnalysisSchema.index({ createdAt: -1 });

export default mongoose.model<ResumeAnalysisDocument>(
  'ResumeAnalysis',
  ResumeAnalysisSchema
);
