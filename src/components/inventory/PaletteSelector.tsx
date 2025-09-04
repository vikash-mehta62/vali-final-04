
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';

interface PaletteSelectorProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
}

// Predefined palette colors
const paletteColors = [
  { name: 'Primary Purple', value: '#9b87f5' },
  { name: 'Soft Gray', value: '#F1F0FB' },
  { name: 'Soft Blue', value: '#D3E4FD' },
  { name: 'Soft Green', value: '#F2FCE2' },
  { name: 'Soft Yellow', value: '#FEF7CD' },
  { name: 'Soft Orange', value: '#FEC6A1' },
  { name: 'Soft Purple', value: '#E5DEFF' },
  { name: 'Soft Pink', value: '#FFDEE2' },
  { name: 'Soft Peach', value: '#FDE1D3' },
];

const PaletteSelector: React.FC<PaletteSelectorProps> = ({ value, onChange, className }) => {
  const [customColor, setCustomColor] = useState(value || '');

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const applyCustomColor = () => {
    onChange(customColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
        >
          {value ? (
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: value }}
              />
              <span className="text-xs">Palette</span>
            </div>
          ) : (
            <span className="text-xs">Set Palette</span>
          )}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Quick Colors</p>
            <div className="grid grid-cols-5 gap-2">
              {paletteColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  className={`w-8 h-8 rounded-full border transition-all hover:scale-110 relative flex items-center justify-center ${
                    value === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onChange(color.value)}
                >
                  {value === color.value && (
                    <Check className="h-3 w-3 text-white stroke-width-3" />
                  )}
                </button>
              ))}
              <button
                type="button"
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs text-muted-foreground bg-muted"
                onClick={() => onChange(undefined)}
                title="No color"
              >
                ✕
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Custom Color</p>
            <div className="flex gap-2">
              <Input 
                type="color" 
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input 
                value={customColor}
                onChange={handleCustomColorChange}
                placeholder="#RRGGBB"
                className="flex-1 text-sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={applyCustomColor}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PaletteSelector;
