
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoveDown, MoveUp } from 'lucide-react';

interface WebsiteSectionsListProps {
  sections: any[];
  activeSection: number | null;
  onSectionSelect: (index: number) => void;
  onSectionMove: (index: number, direction: 'up' | 'down') => void;
  onAddSection: () => void;
}

const WebsiteSectionsList: React.FC<WebsiteSectionsListProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onSectionMove,
  onAddSection
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {sections.map((section, index) => (
          <div 
            key={index}
            className={`p-2 border rounded-md cursor-pointer flex justify-between items-center ${
              activeSection === index ? 'bg-primary/10 border-primary' : ''
            }`}
            onClick={() => onSectionSelect(index)}
          >
            <span className="truncate flex-1">{section.title}</span>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionMove(index, 'up');
                }}
                disabled={index === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionMove(index, 'down');
                }}
                disabled={index === sections.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onAddSection}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
};

export default WebsiteSectionsList;
