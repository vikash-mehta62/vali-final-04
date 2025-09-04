
import { Activity } from '../types';
import { activities } from './mockData';

export const getRecentActivities = (count: number = 5): Activity[] => {
  return [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
};
