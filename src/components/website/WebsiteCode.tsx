
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCheck, Download } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface WebsiteCodeProps {
  website: any;
}

const WebsiteCode: React.FC<WebsiteCodeProps> = ({ website }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const { toast } = useToast();

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

  const generateHtmlCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.name}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>${website.name}</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  ${website.sections.map((section: any, index: number) => `
  <section class="${index % 2 === 0 ? 'section-light' : 'section-dark'}">
    <div class="container">
      <h2>${section.title}</h2>
      <p>${section.content}</p>
    </div>
  </section>
  `).join('')}

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${website.name}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
  };

  const generateCssCode = () => {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${website.style?.fontFamily || 'system-ui, -apple-system, sans-serif'};
  color: ${website.style?.textColor || '#333'};
  background-color: ${website.style?.backgroundColor || '#fff'};
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  background-color: ${website.style?.primaryColor || '#4f46e5'};
  color: ${website.style?.headerTextColor || '#fff'};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  font-size: 1.5rem;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

nav a {
  color: ${website.style?.headerTextColor || '#fff'};
  text-decoration: none;
  transition: opacity 0.3s;
}

nav a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

section {
  padding: 4rem 0;
}

.section-light {
  background-color: ${website.style?.backgroundColor || '#fff'};
}

.section-dark {
  background-color: ${website.style?.secondaryColor || '#f9fafb'};
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${website.style?.headingColor || '#111'};
}

footer {
  background-color: ${website.style?.footerColor || '#1f2937'};
  color: ${website.style?.footerTextColor || '#fff'};
  padding: 2rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  nav ul {
    gap: 1rem;
  }
}`;
  };

  const handleCopyCode = () => {
    const code = activeTab === 'html' ? generateHtmlCode() : generateCssCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    toast({
      title: "Code copied",
      description: `${activeTab.toUpperCase()} code copied to clipboard`,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFiles = () => {
    toast({
      title: "Download feature",
      description: "This feature would download the HTML and CSS files.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h2 className="text-2xl font-bold">Generated Code</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyCode}>
            {copied ? <CheckCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy {activeTab.toUpperCase()}
          </Button>
          <Button onClick={handleDownloadFiles}>
            <Download className="h-4 w-4 mr-2" />
            Download Files
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <pre className="bg-zinc-950 text-zinc-200 p-4 overflow-x-auto text-sm h-[600px]">
                {generateHtmlCode()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="css">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <pre className="bg-zinc-950 text-zinc-200 p-4 overflow-x-auto text-sm h-[600px]">
                {generateCssCode()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteCode;
