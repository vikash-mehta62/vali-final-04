
import React from 'react';
import { SwitchField } from './FormFields';
import { Control } from 'react-hook-form';
import { FormValues } from './formTypes';

interface ProductSettingsProps {
  control: Control<FormValues>;
}

const ProductSettings: React.FC<ProductSettingsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <SwitchField
        control={control}
        name="enablePromotions"
        label="Enable Promotions"
        description="Allow this product to be eligible for promotional discounts"
      />
    </div>
  );
};

export default ProductSettings;
