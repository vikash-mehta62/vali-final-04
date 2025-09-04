
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Wand2, Code, Laptop, PenTool } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import WebsitePromptForm from '@/components/website/WebsitePromptForm';
import WebsitePreview from '@/components/website/WebsitePreview';
import WebsiteCode from '@/components/website/WebsiteCode';
import WebsiteDesigner from '@/components/website/WebsiteDesigner';

const WebsiteGenerator = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleWebsiteGenerated = (websiteData: any) => {
    setGeneratedWebsite(websiteData);
  };

  const handleWebsiteUpdated = (updatedWebsite: any) => {
    setGeneratedWebsite(updatedWebsite);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <PageHeader
              title="Website Generator"
              description="Design and generate a professional website for your business with AI assistance."
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
              <TabsList>
                <TabsTrigger value="generator" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Generator</span>
                </TabsTrigger>
                <TabsTrigger value="designer" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Designer</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Code</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator" className="mt-6 animate-fade-in">
                <WebsitePromptForm onWebsiteGenerated={handleWebsiteGenerated} />
              </TabsContent>
              
              <TabsContent value="designer" className="mt-6 animate-fade-in">
                <WebsiteDesigner website={generatedWebsite} onWebsiteUpdate={handleWebsiteUpdated} />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-6 animate-fade-in">
                <WebsitePreview website={generatedWebsite} />
              </TabsContent>
              
              <TabsContent value="code" className="mt-6 animate-fade-in">
                <WebsiteCode website={generatedWebsite} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
