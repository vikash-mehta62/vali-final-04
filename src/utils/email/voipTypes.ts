
/**
 * VoIP integration types and configurations
 * Provides types and default configurations for VoIP communication services
 */

export interface VoipProvider {
  id: string;
  name: string;
  domain: string;
  requiresAuth: boolean;
  supportsRecording: boolean;
  supportsVideoCall: boolean;
  maxParticipants: number;
}

export interface VoipCallOptions {
  provider: string;
  recipientNumber: string;
  callerId?: string;
  recordCall?: boolean;
  duration?: number;
  scheduleTime?: Date;
  isVideoCall?: boolean;
}

export interface VoipIntegrationConfig {
  defaultProvider: string;
  apiKey?: string;
  accountSid?: string;
  authToken?: string;
  defaultCallerId?: string;
  recordCalls: boolean;
  webhookUrl?: string;
}

export const defaultVoipConfig: VoipIntegrationConfig = {
  defaultProvider: 'twilio',
  recordCalls: false,
};

export const voipProviders: VoipProvider[] = [
  {
    id: 'twilio',
    name: 'Twilio',
    domain: 'sip.twilio.com',
    requiresAuth: true,
    supportsRecording: true,
    supportsVideoCall: true,
    maxParticipants: 25
  },
  {
    id: 'vonage',
    name: 'Vonage (Nexmo)',
    domain: 'sip.nexmo.com',
    requiresAuth: true,
    supportsRecording: true,
    supportsVideoCall: true,
    maxParticipants: 20
  },
  {
    id: 'plivo',
    name: 'Plivo',
    domain: 'sip.plivo.com',
    requiresAuth: true,
    supportsRecording: true,
    supportsVideoCall: false,
    maxParticipants: 10
  },
  {
    id: 'zoom',
    name: 'Zoom Phone',
    domain: 'sipbroker.zoom.us',
    requiresAuth: true,
    supportsRecording: true,
    supportsVideoCall: true,
    maxParticipants: 100
  },
  {
    id: 'custom',
    name: 'Custom SIP',
    domain: '',
    requiresAuth: true,
    supportsRecording: false,
    supportsVideoCall: false,
    maxParticipants: 2
  }
];
