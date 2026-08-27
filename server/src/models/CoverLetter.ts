import mongoose, { Document, Schema } from 'mongoose';
export type CoverLetterTone = 'Professional' | 'Enthusiastic' | 'Formal' | 'Friendly';
export interface CoverLetterDocument extends Document { userId: mongoose.Types.ObjectId; resumeId: mongoose.Types.ObjectId; jobDescription: string; tone: CoverLetterTone; content: string; createdAt: Date; updatedAt: Date; }
const CoverLetterSchema = new Schema<CoverLetterDocument>({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, resumeId: { type: Schema.Types.ObjectId, ref: 'ResumeAnalysis', required: true }, jobDescription: { type: String, required: true, trim: true, maxlength: 20000 }, tone: { type: String, required: true, enum: ['Professional', 'Enthusiastic', 'Formal', 'Friendly'] }, content: { type: String, required: true, trim: true, maxlength: 20000 } }, { timestamps: true });
CoverLetterSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model<CoverLetterDocument>('CoverLetter', CoverLetterSchema);
