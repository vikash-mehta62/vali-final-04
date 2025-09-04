
import React from 'react';
import { Users, MapPin, BarChart3, List } from 'lucide-react';

const ClientsGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Client Management</h2>
      <p className="text-muted-foreground">
        The Client Management system enables you to maintain a comprehensive database of your clients,
        view their purchase history, manage relationships, and analyze client data geographically.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Client Views</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <List className="h-4 w-4 mr-2" />
              List View
            </h4>
            <p className="text-blue-600 text-sm">
              View all clients in a searchable, sortable list format. This view provides quick access to
              basic client information and allows you to perform bulk actions.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              By State
            </h4>
            <p className="text-blue-600 text-sm">
              Analyze your client distribution by state or region. This view helps identify geographic
              concentrations and potential expansion opportunities.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Map View
            </h4>
            <p className="text-blue-600 text-sm">
              Visualize your clients on a map with additional route optimization tools. Ideal for
              planning client visits or analyzing regional distribution.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Client Management Features</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Client Profiles</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Each client has a detailed profile page containing contact information, purchase history,
              notes, preferences, and communication records. You can edit this information at any time
              and track changes in the activity log.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Store Management</h4>
            <p className="text-sm text-muted-foreground mt-1">
              For clients who are stores or resellers, you can manage additional information such as
              store category, status, and special pricing arrangements. The system allows you to categorize
              stores (A, B, C categories) for different pricing tiers or service levels.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Route Planning & Optimization</h4>
            <p className="text-sm text-muted-foreground mt-1">
              The map view includes powerful route optimization tools. Set your starting location,
              select the clients you want to visit, and the system will calculate the most efficient
              route. You can create custom routes or let the system optimize automatically.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100 mt-6">
        <h4 className="font-medium text-indigo-700 mb-2">Working with Client Data</h4>
        <ul className="text-indigo-600 text-sm space-y-1.5 list-disc pl-4">
          <li>Use the search and filter options to quickly find specific clients</li>
          <li>Regular updates to client information help maintain data accuracy</li>
          <li>Track client interactions with notes and communication records</li>
          <li>Analyze purchase patterns to identify upselling opportunities</li>
          <li>Use the map view for territorial analysis and route planning</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Adding New Clients</h3>
        <p className="text-muted-foreground">
          To add a new client, click the "Add Client" button in the list view. Fill in the required information
          in the form, including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
          <li>Client name and company</li>
          <li>Contact information (email, phone, address)</li>
          <li>Client type (individual, business, store, etc.)</li>
          <li>Category or classification</li>
          <li>Default payment terms</li>
        </ul>
        <p className="text-muted-foreground mt-2">
          Once saved, the new client will appear in all client views and be available for order association.
        </p>
      </div>
    </div>
  );
};

export default ClientsGuide;
