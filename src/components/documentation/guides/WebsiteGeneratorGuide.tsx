
import React from 'react';
import { Wand2, Code, Paintbrush, LayoutGrid, ExternalLink } from 'lucide-react';

const WebsiteGeneratorGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Website Generator</h2>
      <p className="text-muted-foreground">
        The Website Generator allows you to quickly create professional websites from simple prompts.
        Choose from templates, customize designs, and publish your website in minutes with no coding required.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Generator Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-violet-50 rounded-md border border-violet-100">
            <h4 className="font-medium text-violet-700 flex items-center mb-2">
              <Wand2 className="h-4 w-4 mr-2" />
              AI-Powered Generation
            </h4>
            <p className="text-violet-600 text-sm">
              Generate a complete website by simply entering your business name and a brief description.
              The AI will create appropriate sections, content, and structure based on your input.
            </p>
          </div>
          
          <div className="p-4 bg-violet-50 rounded-md border border-violet-100">
            <h4 className="font-medium text-violet-700 flex items-center mb-2">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Templates Selection
            </h4>
            <p className="text-violet-600 text-sm">
              Choose from a variety of professionally designed templates for different industries and purposes.
              Each template includes optimized layouts, color schemes, and section structures.
            </p>
          </div>
          
          <div className="p-4 bg-violet-50 rounded-md border border-violet-100">
            <h4 className="font-medium text-violet-700 flex items-center mb-2">
              <Paintbrush className="h-4 w-4 mr-2" />
              Customization Tools
            </h4>
            <p className="text-violet-600 text-sm">
              Customize your generated website with intuitive design tools. Modify colors, fonts, layouts,
              content, and imagery to match your brand identity and preferences.
            </p>
          </div>
          
          <div className="p-4 bg-violet-50 rounded-md border border-violet-100">
            <h4 className="font-medium text-violet-700 flex items-center mb-2">
              <ExternalLink className="h-4 w-4 mr-2" />
              Publishing Options
            </h4>
            <p className="text-violet-600 text-sm">
              Publish your website directly to a hosting service or export the code for custom implementation.
              The system provides options for easy deployment and maintenance.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Website Generation Process</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium">Simple Mode</h4>
            <p className="text-sm text-muted-foreground mt-1">
              The Simple mode requires minimal input - just enter your business name and select a template.
              The generator will create a basic website with standard sections like Home, About, Services, and Contact.
              This is ideal for users who need a website quickly with minimal customization.
            </p>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium">Advanced Mode</h4>
            <p className="text-sm text-muted-foreground mt-1">
              The Advanced mode allows you to provide more detailed information about your business,
              including a comprehensive description, target audience, specific services or products,
              and desired features. The generator will use this information to create more tailored
              content and structure for your website.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Website Customization</h3>
        <p className="text-muted-foreground">
          After generating your website, you can customize every aspect using the Website Designer:
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-700 mb-2">Designer Tools</h4>
          <ul className="text-blue-600 text-sm space-y-2">
            <li>
              <span className="font-medium">Site Structure:</span> Add, remove, or reorder sections to create
              the perfect structure for your website. Each section can be individually edited.
            </li>
            <li>
              <span className="font-medium">Content Editor:</span> Modify text content, headings, and descriptions
              using the rich text editor. You can format text, add lists, and insert links.
            </li>
            <li>
              <span className="font-medium">Style Editor:</span> Customize colors, fonts, spacing, and other visual
              elements to match your brand identity and preferences.
            </li>
            <li>
              <span className="font-medium">Header & Footer:</span> Customize the navigation menu, logo, contact information,
              and social media links in your website's header and footer.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mt-6">
        <h4 className="font-medium text-amber-800 flex items-center mb-2">
          <Code className="h-4 w-4 mr-2" />
          Website Code & Export
        </h4>
        <p className="text-amber-700 text-sm">
          The Website Generator creates clean, standards-compliant code for your website. You can view
          the generated HTML, CSS, and JavaScript code in the "Code" tab. This feature is useful for:
        </p>
        <ul className="text-amber-700 text-sm list-disc pl-6 mt-2 space-y-1">
          <li>Developers who want to further customize the code</li>
          <li>Users who need to integrate with existing websites</li>
          <li>Exporting the code for use with other hosting providers</li>
          <li>Learning how websites are structured and built</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-2">Publishing Your Website</h3>
        <p className="text-muted-foreground">
          When you're satisfied with your website, you can publish it using the "Publish" button in the preview tab.
          The system provides several options:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
          <li>Publish to your own domain (requires domain configuration)</li>
          <li>Publish to a subdomain on our platform</li>
          <li>Export the files for manual upload to any hosting service</li>
          <li>Generate a shareable preview link for client review</li>
        </ul>
        <p className="text-muted-foreground mt-2">
          After publishing, you can continue to make updates and republish as needed.
        </p>
      </div>
    </div>
  );
};

export default WebsiteGeneratorGuide;
