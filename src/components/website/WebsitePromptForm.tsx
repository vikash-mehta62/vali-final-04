
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { websiteTemplates } from './websiteTemplates';
import WebsiteFormSimple from './form/WebsiteFormSimple';
import WebsiteFormAdvanced from './form/WebsiteFormAdvanced';

interface WebsitePromptFormProps {
  onWebsiteGenerated: (website: any) => void;
}

const WebsitePromptForm: React.FC<WebsitePromptFormProps> = ({ onWebsiteGenerated }) => {
  const [businessName, setBusinessName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('simple');
  const { toast } = useToast();

  const handleSimpleGenerate = () => {
    if (!businessName.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter your business name",
        variant: "destructive",
      });
      return;
    }

    generateWebsite();
  };

  const handleAdvancedGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description of your business",
        variant: "destructive",
      });
      return;
    }

    generateWebsite();
  };

  const generateWebsite = () => {
    setIsGenerating(true);
    
    // Simulating generation delay
    setTimeout(() => {
      const selectedTemplate = websiteTemplates[template as keyof typeof websiteTemplates];
      
      // Create a website based on the template and user input
      const website = {
        name: businessName,
        description: prompt,
        template: template,
        sections: selectedTemplate.sections.map(section => ({
          ...section,
          title: section.title.replace('{{businessName}}', businessName),
          content: section.content.replace('{{businessName}}', businessName)
                             .replace('{{businessDescription}}', prompt || `Welcome to ${businessName}`)
        })),
        style: selectedTemplate.style
      };
      
      onWebsiteGenerated(website);
      setIsGenerating(false);
      
      toast({
        title: "Website generated",
        description: "Your website has been successfully generated!",
      });
    }, 2000);
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple">
          <WebsiteFormSimple
            businessName={businessName}
            setBusinessName={setBusinessName}
            template={template}
            setTemplate={setTemplate}
            isGenerating={isGenerating}
            onGenerate={handleSimpleGenerate}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <WebsiteFormAdvanced
            businessName={businessName}
            setBusinessName={setBusinessName}
            prompt={prompt}
            setPrompt={setPrompt}
            template={template}
            setTemplate={setTemplate}
            isGenerating={isGenerating}
            onGenerate={handleAdvancedGenerate}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default WebsitePromptForm;
