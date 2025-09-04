
import React from 'react';
import { Mail, Calendar, Phone, Check, Settings, AlertTriangle } from 'lucide-react';

const EmailCommunicationGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Email & Communication Tools</h2>
      <p className="text-muted-foreground">
        Our integrated communication tools allow you to manage all customer and partner interactions
        through email, calendar, and VoIP systems, directly from within the application.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Core Communication Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              Email System
            </h4>
            <p className="text-blue-600 text-sm">
              Send, receive, and manage emails using templates, automated workflows,
              and tracking features. Integrates with your existing email services.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar Integration
            </h4>
            <p className="text-blue-600 text-sm">
              Schedule meetings, manage appointments, and sync with external calendar
              providers. Includes reminder notifications and availability management.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2" />
              VoIP Integration
            </h4>
            <p className="text-blue-600 text-sm">
              Make and receive calls directly from the application. Record calls, add
              notes, and track all communication in customer interaction histories.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Email Management</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium">Email Templates</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage reusable email templates for common communications like order confirmations,
              shipping notifications, follow-ups, and marketing messages. Templates support variable placeholders
              for personalization (e.g., {"{{customer_name}}"}, {"{{order_number}}"}) and can include your branding elements.
            </p>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium">Email Validation</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Our system automatically validates email addresses for format correctness and deliverability.
              For bulk emails, it checks for potential issues with email lists and helps maintain good sender
              reputation by following best practices.
            </p>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium">Domain Configuration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your business email domains for improved deliverability and branding. The system
              supports SPF, DKIM, and DMARC settings to ensure your emails are properly authenticated and
              less likely to be filtered as spam.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Calendar Management</h3>
        <p className="text-muted-foreground">
          Our calendar integration helps you manage appointments and schedule follow-ups with customers,
          partners, and team members.
        </p>
        
        <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
          <h4 className="font-medium text-purple-700 mb-2">Calendar Features</h4>
          <ul className="text-purple-600 text-sm space-y-2">
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <span>
                <strong>Provider Integration:</strong> Sync with popular calendar providers including Google Calendar,
                Microsoft Outlook, and Apple Calendar to maintain a unified schedule.
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <span>
                <strong>Event Export & Import:</strong> Easily export calendar events to standard formats (ICS)
                or import existing events from other calendar systems.
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <span>
                <strong>Automated Scheduling:</strong> Set up automated scheduling links that allow clients to
                book appointments based on your available time slots.
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <span>
                <strong>Reminders & Notifications:</strong> Configure email and in-app reminders for upcoming
                appointments and events to ensure nothing is missed.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">VoIP Communication</h3>
        <p className="text-muted-foreground">
          Make and receive calls directly within the application using our VoIP integration.
        </p>
        
        <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
          <h4 className="font-medium text-slate-700 mb-2">Supported VoIP Providers</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-sm space-y-1">
              <p className="font-medium text-slate-700">Twilio</p>
              <ul className="text-slate-600 list-disc pl-5 space-y-0.5">
                <li>Full integration with Twilio's API</li>
                <li>Support for voice, SMS, and video calls</li>
                <li>Up to 25 participants in conference calls</li>
                <li>Call recording capabilities</li>
              </ul>
            </div>
            
            <div className="text-sm space-y-1">
              <p className="font-medium text-slate-700">Vonage (Nexmo)</p>
              <ul className="text-slate-600 list-disc pl-5 space-y-0.5">
                <li>Voice and video calling support</li>
                <li>International calling capabilities</li>
                <li>Up to 20 participants in group calls</li>
                <li>Call recording and transcription</li>
              </ul>
            </div>
            
            <div className="text-sm space-y-1">
              <p className="font-medium text-slate-700">Plivo</p>
              <ul className="text-slate-600 list-disc pl-5 space-y-0.5">
                <li>Voice calling integration</li>
                <li>SMS messaging capabilities</li>
                <li>Support for up to 10 participants</li>
                <li>Basic call recording</li>
              </ul>
            </div>
            
            <div className="text-sm space-y-1">
              <p className="font-medium text-slate-700">Zoom Phone</p>
              <ul className="text-slate-600 list-disc pl-5 space-y-0.5">
                <li>Integration with Zoom's phone system</li>
                <li>Advanced video conferencing</li>
                <li>Up to 100 participants</li>
                <li>Comprehensive recording and sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mt-6">
        <h4 className="font-medium text-amber-800 flex items-center mb-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Communication Best Practices
        </h4>
        <ul className="text-amber-700 text-sm space-y-1.5">
          <li>Always use templates for consistent messaging and branding</li>
          <li>Regularly update your email signature with current contact information</li>
          <li>Keep call notes detailed and accurate for future reference</li>
          <li>Configure automated follow-ups for unanswered communications</li>
          <li>Use calendar integration to avoid scheduling conflicts</li>
          <li>Test email deliverability regularly, especially for important campaigns</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Configuration Settings</h3>
        <p className="text-muted-foreground">
          Access communication settings in the Settings → Communication section:
        </p>
        <div className="flex items-start mt-2">
          <Settings className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <div className="text-muted-foreground text-sm">
            <p className="font-medium">Email Configuration</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Configure SMTP settings for email sending</li>
              <li>Set up email authentication (SPF, DKIM, DMARC)</li>
              <li>Manage email signatures and default templates</li>
              <li>Configure bounce handling and feedback loops</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-start mt-4">
          <Settings className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <div className="text-muted-foreground text-sm">
            <p className="font-medium">VoIP Configuration</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Set up VoIP provider API credentials</li>
              <li>Configure default caller ID information</li>
              <li>Set call recording preferences and storage options</li>
              <li>Configure call routing and forwarding rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCommunicationGuide;
