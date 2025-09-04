
import React from 'react';
import { Briefcase, Users, Phone, Mail, Calendar, FileText } from 'lucide-react';

const CRMGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Relationship Management (CRM)</h2>
      <p className="text-muted-foreground">
        Our CRM system helps you manage customer relationships, track interactions, schedule follow-ups,
        and analyze customer data to improve satisfaction and drive sales growth.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Core CRM Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <Users className="h-4 w-4 mr-2" />
              Contact Management
            </h4>
            <p className="text-indigo-600 text-sm">
              Maintain a comprehensive database of all your contacts with detailed profiles,
              communication history, preferences, and relationship status.
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2" />
              Communication Tools
            </h4>
            <p className="text-indigo-600 text-sm">
              Track all customer interactions including calls, emails, meetings, and notes.
              Log communication details and set follow-up reminders directly from contact profiles.
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Task & Calendar Management
            </h4>
            <p className="text-indigo-600 text-sm">
              Schedule appointments, set reminders for follow-ups, and manage task assignments
              for your team. Sync with external calendar applications for streamlined scheduling.
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <h4 className="font-medium text-indigo-700 flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Lead Management
            </h4>
            <p className="text-indigo-600 text-sm">
              Track potential customers through your sales pipeline, from initial contact to
              closed deals. Assign leads to team members and monitor conversion rates.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Email & Communication Tools</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">Email Integration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Send emails directly from the CRM system with customizable templates. The system
              automatically logs all email communication and associates it with the relevant contact
              records. You can track open rates, clicks, and responses to measure engagement.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">VoIP Integration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Make and receive calls through the CRM with our integrated VoIP system. Call records
              are automatically created and linked to customer profiles. You can record calls (with
              permission) and add notes during or after conversations.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">Calendar Sync</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Integrate with popular calendar applications to sync appointments and meetings.
              This ensures that your schedule is always up-to-date across all platforms and
              helps prevent double-booking or missed appointments.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Lead Capture & Management</h3>
        <p className="text-muted-foreground">
          Efficiently capture and manage leads through various channels, track them through your
          sales pipeline, and convert them into customers.
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-700 mb-2">Web Lead Capture Forms</h4>
          <p className="text-blue-600 text-sm">
            Create customizable lead capture forms for your website that automatically add new leads
            to your CRM. The form editor allows you to design branded forms with custom fields tailored
            to your business needs. Each submission triggers notifications and can initiate automated workflows.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            To create a web form:
          </p>
          <ol className="text-blue-600 text-sm list-decimal pl-6 mt-1 space-y-1">
            <li>Navigate to CRM → Lead Capture → Web Forms</li>
            <li>Click "Create New Form"</li>
            <li>Design your form using the drag-and-drop editor</li>
            <li>Configure form settings and submission actions</li>
            <li>Publish the form and embed it on your website</li>
          </ol>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Email Templates</h3>
        <p className="text-muted-foreground">
          Create reusable email templates to save time and maintain consistent messaging:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-1 text-muted-foreground">
          <li>Go to CRM → Communication → Email Templates</li>
          <li>Click "New Template"</li>
          <li>Design your template with the rich text editor</li>
          <li>Add personalization variables (e.g., {"{{first_name}}"}, {"{{company}}"})</li>
          <li>Save and test your template</li>
        </ol>
        <p className="text-muted-foreground mt-2">
          Templates can be used for individual emails or bulk communications with segmented contact lists.
        </p>
      </div>
    </div>
  );
};

export default CRMGuide;
