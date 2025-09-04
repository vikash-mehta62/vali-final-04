
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebsitePreviewProps {
  website: any;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ website }) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Export feature",
      description: "This feature would export the website files for deployment.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Publish website",
      description: "This would publish your website to a live URL.",
    });
  };

  if (!website) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No Website Generated Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Go to the Generator tab to create a website first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <h2 className="text-2xl font-bold">{website.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handlePublish}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden border-2 border-dashed">
        <CardContent className="p-0">
          <div className="bg-zinc-800 text-zinc-300 p-2 flex items-center gap-2 text-xs">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center">
              Preview - {website.name}
            </div>
          </div>
          
          <div className="h-[600px] overflow-y-auto">
            <div 
              style={{
                fontFamily: website.style?.fontFamily || 'system-ui',
                color: website.style?.textColor || 'inherit',
                backgroundColor: website.style?.backgroundColor || 'white'
              }}
            >
              {/* Header */}
              <header className="sticky top-0 z-10 p-4 shadow-sm" style={{ backgroundColor: website.style?.primaryColor || '#4f46e5' }}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h1 className="text-xl font-bold" style={{ color: website.style?.headerTextColor || 'white' }}>
                    {website.name}
                  </h1>
                  <nav>
                    <ul className="flex gap-4">
                      {['Home', 'About', 'Services', 'Contact'].map((item) => (
                        <li key={item}>
                          <a 
                            href="#" 
                            className="hover:underline" 
                            style={{ color: website.style?.headerTextColor || 'white' }}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </header>
              
              {/* Sections */}
              {website.sections.map((section: any, index: number) => (
                <section 
                  key={index}
                  className="py-12 px-4"
                  style={{
                    backgroundColor: index % 2 === 0 
                      ? website.style?.backgroundColor || 'white'
                      : website.style?.secondaryColor || '#f9fafb'
                  }}
                >
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                    <div className="prose max-w-none">
                      <p>{section.content}</p>
                    </div>
                  </div>
                </section>
              ))}
              
              {/* Footer */}
              <footer className="py-8 px-4" style={{ backgroundColor: website.style?.footerColor || '#1f2937', color: website.style?.footerTextColor || 'white' }}>
                <div className="max-w-7xl mx-auto text-center">
                  <p>&copy; {new Date().getFullYear()} {website.name}. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePreview;
