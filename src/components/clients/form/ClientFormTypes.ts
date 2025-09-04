
import { z } from 'zod';
import { StoreCategory, StoreStatus, ShopStatus } from '@/types';

export const clientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().optional(),
  status: z.enum(['active', 'inactive'] as const),
  isShop: z.boolean().default(false),
  category: z.enum(['A', 'B', 'C'] as const).optional(),
  shopStatus: z.enum(['open', 'closed', 'busy'] as const).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  source: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'] as const).default('medium'),
  // Communication preferences
  preferredContactMethod: z.enum(['email', 'phone', 'text', 'mail'] as const).default('email').optional(),
  emailNotifications: z.boolean().default(true).optional(),
  mailingList: z.boolean().default(false).optional(),
  priceListUpdates: z.boolean().default(true).optional(),
  promotionalEmails: z.boolean().default(false).optional(),
  // Email communication history
  lastEmailSent: z.string().optional(),
  lastEmailResponse: z.string().optional(),
  emailHistory: z.array(
    z.object({
      subject: z.string(),
      sentDate: z.string(),
      status: z.enum(['sent', 'opened', 'clicked', 'responded', 'bounced'] as const),
    })
  ).optional().default([]),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export interface ClientFormProps {
  initialData?: any; // Using any here to maintain compatibility
  onSubmit: (data: Omit<any, 'id'>) => void; // Using any to maintain compatibility
}

export type ClientPriority = 'low' | 'medium' | 'high';

export type PreferredContactMethod = 'email' | 'phone' | 'text' | 'mail';

export type EmailStatus = 'sent' | 'opened' | 'clicked' | 'responded' | 'bounced';

export interface EmailHistoryItem {
  subject: string;
  sentDate: string;
  status: EmailStatus;
}

export const CLIENT_SOURCES = [
  'Referral',
  'Website',
  'Cold Call',
  'Trade Show',
  'Partner',
  'Social Media',
  'Email Campaign',
  'Other'
];

// Client communication templates
export const CLIENT_EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to our service',
    body: 'Thank you for choosing our business. We look forward to working with you.'
  },
  priceUpdate: {
    subject: 'Price List Update',
    body: 'We have updated our price list. Please find the latest prices attached.'
  },
  followUp: {
    subject: 'Following up on your recent order',
    body: 'We wanted to check in regarding your recent order and ensure everything is satisfactory.'
  },
  promotion: {
    subject: 'Special offer just for you',
    body: 'As a valued customer, we are pleased to offer you a special discount on your next order.'
  }
};
