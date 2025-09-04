
import { z } from 'zod';

/**
 * Schema for validating email form inputs
 */
export const emailFormSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  // Additional fields for integration with product/inventory
  relatedProductId: z.string().optional(),
  relatedClientId: z.string().optional(),
  relatedOrderId: z.string().optional(),
  templateId: z.string().optional(),
});

/**
 * Type definition for email form values
 */
export type EmailFormValues = z.infer<typeof emailFormSchema>;

/**
 * Configuration options for sending emails
 */
export interface EmailSendOptions {
  /** Webhook URL for sending emails */
  webhookUrl?: string;
  /** Success callback function */
  onSuccess?: () => void;
  /** Error callback function */
  onError?: (error: Error) => void;
  /** Whether to show toast notifications */
  showNotifications?: boolean;
  /** Custom email domain */
  fromDomain?: string;
  /** From email address */
  fromEmail?: string;
  /** From name */
  fromName?: string;
  /** Track email in CRM */
  trackInCRM?: boolean;
  /** Related entity data */
  relatedData?: {
    entityType: 'product' | 'client' | 'order' | 'invoice';
    entityId: string;
    entityName?: string;
  };
}

/**
 * Email domain configuration
 */
export interface DomainConfig {
  /** Domain name (e.g., example.com) */
  domain: string;
  /** Whether the domain is verified */
  verified: boolean;
  /** Default sender name */
  defaultSenderName: string;
  /** Whether the domain is the default for sending */
  isDefault: boolean;
  /** Date when the domain was added */
  addedOn: string;
}

/**
 * Email template configuration
 */
export interface EmailTemplate {
  /** Template name */
  name: string;
  /** Template subject */
  subject: string;
  /** Template message */
  message: string;
  /** Template category */
  category?: 'order' | 'invoice' | 'marketing' | 'notification' | 'other';
  /** Variables that can be used in this template */
  variables?: string[];
}

/**
 * Available email templates
 */
export const emailTemplates: Record<string, EmailTemplate> = {
  invoice: {
    name: 'Invoice',
    subject: 'Your Invoice',
    message: 'Please find attached your invoice.',
    category: 'invoice',
    variables: ['invoiceNumber', 'dueDate', 'totalAmount']
  },
  order: {
    name: 'Order Confirmation',
    subject: 'Your Order Confirmation',
    message: 'Thank you for your order. Here are the details:',
    category: 'order',
    variables: ['orderNumber', 'orderDate', 'itemCount']
  },
  deal: {
    name: 'Deal Information',
    subject: 'Regarding our deal',
    message: 'I wanted to follow up on our deal:',
    category: 'marketing',
    variables: ['dealName', 'expiryDate', 'contactName']
  },
  quote: {
    name: 'Price Quote',
    subject: 'Price Quote',
    message: 'Here is the price quote you requested:',
    category: 'marketing',
    variables: ['quoteNumber', 'validUntil', 'totalAmount']
  },
  followUp: {
    name: 'Follow Up',
    subject: 'Following up on our conversation',
    message: 'I wanted to follow up on our recent conversation.',
    category: 'notification',
    variables: ['lastContactDate', 'nextSteps']
  },
  priceList: {
    name: 'Price List Update',
    subject: 'Updated Price List',
    message: 'We have updated our price list. Please find the new price list attached.',
    category: 'marketing',
    variables: ['effectiveDate', 'productCount']
  },
  productAvailability: {
    name: 'Product Availability',
    subject: 'Product Availability Update',
    message: 'We wanted to inform you about the availability of products you might be interested in.',
    category: 'notification',
    variables: ['productName', 'availableQuantity', 'nextDeliveryDate']
  }
};

/**
 * Default email domains
 */
export const defaultEmailDomains: DomainConfig[] = [
  {
    domain: 'gmail.com',
    verified: true,
    defaultSenderName: 'Business CRM',
    isDefault: true,
    addedOn: new Date().toISOString(),
  }
];
