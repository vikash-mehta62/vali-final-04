
import React from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, HelpCircle, Laptop } from 'lucide-react';

const TroubleshootingGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Troubleshooting & FAQ</h2>
      <p className="text-muted-foreground">
        This guide addresses common issues you might encounter while using the application
        and provides solutions to help you resolve them quickly.
      </p>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Common Issues</h3>
        
        <div className="space-y-4">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-red-50 p-3 border-b border-red-100 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <h4 className="font-medium text-red-800">Data Not Loading</h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                If you're experiencing issues with data not loading properly in the application:
              </p>
              <ol className="text-sm space-y-2 list-decimal pl-5">
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Check your internet connection</span> - 
                  Ensure you have a stable connection to the internet.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Refresh the page</span> - 
                  Use the browser's refresh button or press F5 to reload the application.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Clear browser cache</span> - 
                  Go to your browser settings and clear cache and cookies, then reload.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Check for service outages</span> - 
                  Visit the status page to see if there are any known service disruptions.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Try a different browser</span> - 
                  If the issue persists, try accessing the application from a different browser.
                </li>
              </ol>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-amber-50 p-3 border-b border-amber-100 flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <h4 className="font-medium text-amber-800">Order Processing Errors</h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                If you encounter errors when creating or processing orders:
              </p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Verify required fields</span> - 
                  Ensure all required fields are completed with valid information.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Check inventory</span> - 
                  Confirm that the products in the order have sufficient inventory available.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Validate client information</span> - 
                  Ensure the client exists in the system and has valid billing/shipping information.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Review pricing</span> - 
                  Check if there are any price or discount calculation issues.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Examine error messages</span> - 
                  Read any error messages carefully as they often provide specific information about what's wrong.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <h4 className="font-medium text-blue-800">PDF Export Problems</h4>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                If you're having trouble generating or downloading PDF exports:
              </p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Check browser permissions</span> - 
                  Ensure your browser allows file downloads and pop-ups from this application.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Verify data completeness</span> - 
                  Make sure all required data for the PDF is available and properly formatted.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Try a different browser</span> - 
                  Some PDF generation issues are browser-specific.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Check image sizes</span> - 
                  If your PDF includes images (like logos), ensure they are of reasonable size and format.
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-700">Disable browser extensions</span> - 
                  Some browser extensions can interfere with PDF generation or downloading.
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold pt-2">Performance Optimization</h3>
        <div className="p-4 bg-emerald-50 rounded-md border border-emerald-100">
          <h4 className="font-medium text-emerald-800 flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
            Improving Application Performance
          </h4>
          <p className="text-sm text-emerald-700 mb-3">
            If you're experiencing slow performance, here are some tips to optimize your experience:
          </p>
          <ul className="text-sm space-y-2 list-disc pl-5 text-emerald-700">
            <li>
              <span className="font-medium">Limit data ranges</span> - 
              When viewing reports or lists, narrow date ranges to reduce the amount of data loaded.
            </li>
            <li>
              <span className="font-medium">Use filters effectively</span> - 
              Apply filters to large data sets to focus on only the information you need.
            </li>
            <li>
              <span className="font-medium">Close unused tabs</span> - 
              The application may slow down if you have multiple tabs or sections open simultaneously.
            </li>
            <li>
              <span className="font-medium">Regular cache clearing</span> - 
              Periodically clear your browser cache to remove accumulated temporary data.
            </li>
            <li>
              <span className="font-medium">Update your browser</span> - 
              Keep your browser updated to the latest version for best performance and compatibility.
            </li>
            <li>
              <span className="font-medium">Check your internet connection</span> - 
              A stable, high-speed internet connection improves application responsiveness.
            </li>
          </ul>
        </div>
        
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />
              How do I reset my password?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              To reset your password, click on the "Forgot Password" link on the login screen. Enter your email
              address, and a password reset link will be sent to your inbox. Follow the link to create a new password.
              If you're already logged in, you can change your password in the Settings → Account section.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />
              Can I access the system from my mobile device?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Yes, the application is responsive and works on mobile devices. You can access it through your
              mobile browser. While all features are available on mobile, some complex functions like detailed
              reports and extensive forms may be easier to use on larger screens. We also offer mobile apps for
              iOS and Android with optimized interfaces for on-the-go access.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />
              How do I add new users to my account?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              To add new users, navigate to Settings → Team Management. Click the "Add User" button and enter
              the new user's email address and role. The system will send an invitation email with instructions
              to complete their registration. You can set specific permissions for each user based on their
              responsibilities within your organization.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />
              Is my data backed up regularly?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Yes, all data is automatically backed up multiple times daily. We maintain comprehensive backups
              with point-in-time recovery options. Your data is stored securely with encryption both in transit
              and at rest. You can also manually export important data sets as CSV or Excel files from most
              list views for your own backup purposes.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="font-medium flex items-center">
              <HelpCircle className="h-4 w-4 text-purple-500 mr-2" />
              How do I integrate with my accounting software?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              The system supports integration with popular accounting platforms including QuickBooks, Xero, and
              Sage. Go to Settings → Integrations to set up the connection. You'll need to provide API credentials
              from your accounting software and configure which data should be synchronized. Once connected,
              you can push orders, invoices, and payments to your accounting system automatically.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-md border border-slate-200 mt-4">
          <h4 className="font-medium text-slate-800 flex items-center mb-3">
            <Laptop className="h-5 w-5 text-slate-600 mr-2" />
            System Requirements
          </h4>
          <p className="text-sm text-slate-700 mb-3">
            For optimal performance, please ensure your system meets these requirements:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-800">Browsers</p>
              <ul className="list-disc pl-5 text-slate-700 space-y-1">
                <li>Google Chrome (latest 2 versions)</li>
                <li>Mozilla Firefox (latest 2 versions)</li>
                <li>Safari (latest 2 versions)</li>
                <li>Microsoft Edge (latest 2 versions)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-800">Hardware</p>
              <ul className="list-disc pl-5 text-slate-700 space-y-1">
                <li>Minimum 4GB RAM (8GB recommended)</li>
                <li>Screen resolution: 1280×720 or higher</li>
                <li>Stable internet connection (2 Mbps+)</li>
                <li>For mobile: iOS 13+ or Android 9+</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-medium mb-2">Getting Additional Help</h3>
          <p className="text-muted-foreground">
            If you're still experiencing issues after trying the troubleshooting steps:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Contact our support team through the Help menu in the application</li>
            <li>Email support at support@example.com</li>
            <li>Call our technical support line at (555) 123-4567 during business hours</li>
            <li>Check our knowledge base for detailed articles at help.example.com</li>
            <li>Join our community forum to connect with other users and share solutions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingGuide;
