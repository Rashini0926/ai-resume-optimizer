import { Response } from 'express';
import AnalyticsEvent, { AnalyticsEventAttrs } from '../models/AnalyticsEvent';
import { AuthRequest } from '../middleware/auth';

export const analyticsSummary = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const stats = await AnalyticsEvent.aggregate([
      {
        $match: { userId: req.user!.id },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          averageAtsScore: { $avg: '$atsScore' },
        },
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          averageAtsScore: { $round: ['$averageAtsScore', 2] },
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({ data: stats });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
};

export const analyticsTrends = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const events = await AnalyticsEvent.aggregate([
      {
        $match: { userId: req.user!.id },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          averageAtsScore: { $avg: '$atsScore' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] },
          averageAtsScore: { $round: ['$averageAtsScore', 2] },
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    return res.status(200).json({ data: events });
  } catch (error) {
    console.error('Analytics trends error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics trends' });
  }
};

export const analyticsByUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (userId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only access your own analytics' });
    }

    const events = await AnalyticsEvent.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({ data: events });
  } catch (error) {
    console.error('Analytics by user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user analytics events' });
  }
};

export const createAnalyticsEvent = async (attrs: AnalyticsEventAttrs): Promise<void> => {
  const event = AnalyticsEvent.build(attrs);
  await event.save();
};
