
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './formTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorField } from './FormFields';

// Predefined color palette options
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

const ProductPalette = () => {
  const { control, setValue, watch } = useFormContext<FormValues>();
  const selectedPalette = watch('palette');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ColorField
            control={control}
            name="palette"
            label="Color Palette"
            description="Choose a color for this product"
          />
          
          <div>
            <div className="text-sm font-medium mb-2">Quick Colors</div>
            <div className="flex flex-wrap gap-2">
              {paletteColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  className={`w-8 h-8 rounded-full border transition-all hover:scale-110 ${
                    selectedPalette === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue('palette', color.value)}
                />
              ))}
              <button
                type="button"
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs text-muted-foreground bg-muted"
                onClick={() => setValue('palette', undefined)}
                title="No color"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPalette;
