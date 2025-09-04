
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

interface WebsiteSectionEditorProps {
  section: any;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onRemoveSection: () => void;
}

const WebsiteSectionEditor: React.FC<WebsiteSectionEditorProps> = ({
  section,
  onTitleChange,
  onContentChange,
  onRemoveSection
}) => {
  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-md">
        <p className="text-muted-foreground mb-4">
          Select a section from the list to edit its content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit Section</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRemoveSection}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Section
        </Button>
      </div>
      <Separator className="my-2" />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sectionTitle">Section Title</Label>
          <Input 
            id="sectionTitle"
            value={section.title} 
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Section title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sectionContent">Section Content</Label>
          <Textarea 
            id="sectionContent"
            value={section.content} 
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Section content"
            rows={8}
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteSectionEditor;
