import mongoose, { Document, Model, Schema } from 'mongoose';

export interface AnalyticsEventAttrs {
  userId: string;
  eventType: string;
  industry: string;
  jobRole: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  createdAt?: Date;
}

export interface AnalyticsEventDoc extends Document, AnalyticsEventAttrs {
  createdAt: Date;
}

export interface AnalyticsEventModel extends Model<AnalyticsEventDoc> {
  build(attrs: AnalyticsEventAttrs): AnalyticsEventDoc;
}

const analyticsEventSchema = new Schema<AnalyticsEventDoc, AnalyticsEventModel>(
  {
    userId: { type: String, required: true, index: true },
    eventType: { type: String, required: true, index: true },
    industry: { type: String, required: true, index: true },
    jobRole: { type: String, required: true, index: true },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    matchedKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  {
    timestamps: false,
  }
);

analyticsEventSchema.statics.build = (attrs: AnalyticsEventAttrs) => {
  return new AnalyticsEvent(attrs);
};

analyticsEventSchema.index({ createdAt: 1 });
analyticsEventSchema.index({ userId: 1 });
analyticsEventSchema.index({ eventType: 1 });
analyticsEventSchema.index({ industry: 1 });
analyticsEventSchema.index({ jobRole: 1 });

const AnalyticsEvent = mongoose.model<AnalyticsEventDoc, AnalyticsEventModel>(
  'AnalyticsEvent',
  analyticsEventSchema
);

export default AnalyticsEvent;
