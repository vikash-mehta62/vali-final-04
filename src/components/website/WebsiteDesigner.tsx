
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import WebsiteStyleEditor from './designer/WebsiteStyleEditor';
import WebsiteSectionsList from './designer/WebsiteSectionsList';
import WebsiteSectionEditor from './designer/WebsiteSectionEditor';
import WebsiteBasicInfo from './designer/WebsiteBasicInfo';
import WebsiteHeaderFooter from './designer/WebsiteHeaderFooter';

interface WebsiteDesignerProps {
  website: any;
  onWebsiteUpdate: (website: any) => void;
}

const WebsiteDesigner: React.FC<WebsiteDesignerProps> = ({ website, onWebsiteUpdate }) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [websiteData, setWebsiteData] = useState(website);
  
  if (!website) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No Website To Edit</h3>
        <p className="text-muted-foreground max-w-md">
          First, generate a website from the Generator tab, then come back to customize it further.
        </p>
      </div>
    );
  }
  
  const handleSaveChanges = () => {
    onWebsiteUpdate(websiteData);
    toast({
      title: "Changes saved",
      description: "Your website customizations have been saved.",
    });
  };
  
  const handleNameChange = (name: string) => {
    setWebsiteData({
      ...websiteData,
      name
    });
  };
  
  const handleDescriptionChange = (description: string) => {
    setWebsiteData({
      ...websiteData,
      description
    });
  };
  
  const handleSectionTitleChange = (index: number, title: string) => {
    const updatedSections = [...websiteData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      title
    };
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
  };
  
  const handleSectionContentChange = (index: number, content: string) => {
    const updatedSections = [...websiteData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      content
    };
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
  };
  
  const handleAddSection = () => {
    const updatedSections = [...websiteData.sections];
    updatedSections.push({
      title: "New Section",
      content: "Enter your content here."
    });
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
    
    setActiveSection(updatedSections.length - 1);
  };
  
  const handleRemoveSection = (index: number) => {
    const updatedSections = [...websiteData.sections];
    updatedSections.splice(index, 1);
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
    
    setActiveSection(null);
  };
  
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === websiteData.sections.length - 1)
    ) {
      return;
    }
    
    const updatedSections = [...websiteData.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = 
      [updatedSections[newIndex], updatedSections[index]];
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
    
    setActiveSection(newIndex);
  };
  
  const handleColorChange = (colorType: string, value: string) => {
    setWebsiteData({
      ...websiteData,
      style: {
        ...websiteData.style,
        [colorType]: value
      }
    });
  };
  
  const handleFontChange = (value: string) => {
    setWebsiteData({
      ...websiteData,
      style: {
        ...websiteData.style,
        fontFamily: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <h2 className="text-2xl font-bold">Customize Your Website</h2>
        <Button onClick={handleSaveChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Site Structure</h3>
                <Separator className="my-2" />
                
                <WebsiteSectionsList
                  sections={websiteData.sections}
                  activeSection={activeSection}
                  onSectionSelect={setActiveSection}
                  onSectionMove={handleMoveSection}
                  onAddSection={handleAddSection}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Site Appearance</h3>
                <Separator className="my-2" />
                
                <WebsiteStyleEditor
                  websiteStyle={websiteData.style}
                  onStyleChange={handleColorChange}
                  onFontChange={handleFontChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Website Content</TabsTrigger>
                <TabsTrigger value="header">Header & Footer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <WebsiteBasicInfo
                  name={websiteData.name}
                  description={websiteData.description}
                  onNameChange={handleNameChange}
                  onDescriptionChange={handleDescriptionChange}
                />
                
                <Separator className="my-4" />
                
                <WebsiteSectionEditor
                  section={activeSection !== null ? websiteData.sections[activeSection] : null}
                  onTitleChange={(title) => activeSection !== null && handleSectionTitleChange(activeSection, title)}
                  onContentChange={(content) => activeSection !== null && handleSectionContentChange(activeSection, content)}
                  onRemoveSection={() => activeSection !== null && handleRemoveSection(activeSection)}
                />
              </TabsContent>
              
              <TabsContent value="header" className="space-y-6">
                <WebsiteHeaderFooter
                  websiteStyle={websiteData.style}
                  onStyleChange={handleColorChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteDesigner;
