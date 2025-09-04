
/**
 * Email and Communication Utilities
 * Centralized exports for all communication-related functions and types
 */

// Email functionality
import { validateEmail, validateEmailList, isValidEmailDomain, parseEmailAddresses } from './emailValidator';
import { 
  EmailFormValues, 
  EmailSendOptions, 
  emailFormSchema,
  EmailTemplate,
  emailTemplates,
  DomainConfig,
  defaultEmailDomains
} from './emailTypes';
import { 
  sendEmail, 
  verifyEmailDomain, 
  sendPriceListEmail, 
  sendInvoiceEmail 
} from './emailSender';

// Inventory email utilities
import {
  sendProductPriceUpdateEmail,
  sendPriceListTemplateEmail,
  sendProductAvailabilityEmail
} from './inventoryEmailUtils';

// Calendar integration
import {
  CalendarProvider,
  calendarProviders,
  CalendarEvent,
  CalendarExportOptions,
  CalendarImportOptions,
  CalendarIntegrationConfig,
  defaultCalendarConfig
} from './calendarTypes';

// VoIP integration
import { 
  VoipProvider, 
  voipProviders,
  VoipCallOptions,
  VoipIntegrationConfig,
  defaultVoipConfig
} from './voipTypes';

// Export all utilities and types
export {
  // Email exports
  validateEmail,
  validateEmailList,
  isValidEmailDomain,
  parseEmailAddresses,
  sendEmail,
  verifyEmailDomain,
  sendPriceListEmail,
  sendInvoiceEmail,
  emailFormSchema,
  emailTemplates,
  defaultEmailDomains,
  
  // Inventory email utilities
  sendProductPriceUpdateEmail,
  sendPriceListTemplateEmail,
  sendProductAvailabilityEmail,
  
  // Calendar exports
  calendarProviders,
  defaultCalendarConfig,
  
  // VoIP exports
  voipProviders,
  defaultVoipConfig,
  
  // Type exports
  type EmailFormValues,
  type EmailSendOptions,
  type EmailTemplate,
  type DomainConfig,
  type CalendarProvider,
  type CalendarEvent,
  type CalendarExportOptions,
  type CalendarImportOptions,
  type CalendarIntegrationConfig,
  type VoipProvider,
  type VoipCallOptions,
  type VoipIntegrationConfig
};
