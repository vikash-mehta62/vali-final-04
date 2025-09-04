
/**
 * Calendar integration types
 */

export interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  authUrl: string;
  requiresAuth: boolean;
  supportsImport: boolean;
  supportsExport: boolean;
}

export const calendarProviders: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: 'calendar',
    color: '#4285F4',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    requiresAuth: true,
    supportsImport: true,
    supportsExport: true
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    icon: 'mail',
    color: '#0078D4',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    requiresAuth: true,
    supportsImport: true,
    supportsExport: true
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: 'calendar',
    color: '#FF3B30',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    requiresAuth: true,
    supportsImport: true,
    supportsExport: true
  },
  {
    id: 'custom',
    name: 'Custom iCal',
    icon: 'calendar',
    color: '#6B7280',
    authUrl: '',
    requiresAuth: false,
    supportsImport: true,
    supportsExport: true
  }
];

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  description?: string;
  attendees?: string[];
  organizer?: string;
  url?: string;
  color?: string;
  recurrence?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  source?: string;
  sourceId?: string;
}

export interface CalendarExportOptions {
  format: 'ical' | 'google' | 'outlook' | 'csv';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAttendees?: boolean;
  includeDescription?: boolean;
  includePrivateEvents?: boolean;
}

export interface CalendarImportOptions {
  format: 'ical' | 'google' | 'outlook' | 'csv';
  overwriteExisting?: boolean;
  categorize?: boolean;
  defaultCategory?: string;
}

export interface CalendarIntegrationConfig {
  provider: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date;
  syncFrequency: 'manual' | 'hourly' | 'daily' | 'realtime';
  lastSync?: Date;
  calendarsToSync?: string[];
  exportEvents?: boolean;
  importEvents?: boolean;
}

export const defaultCalendarConfig: CalendarIntegrationConfig = {
  provider: 'custom',
  syncFrequency: 'manual',
  exportEvents: true,
  importEvents: true
};
