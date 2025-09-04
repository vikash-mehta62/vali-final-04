
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductDetails from './forms/ProductDetails';
import ProductSettings from './forms/ProductSettings';
import ProductPalette from './forms/ProductPalette';
import { Control } from 'react-hook-form';
import { FormValues } from './forms/formTypes';

interface ProductFormTabsProps {
  control: Control<FormValues>;
  categories: string[];
  units: string[];
  isEditProduct?: boolean;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({ 
  control, 
  categories, 
  units ,
  isEditProduct
}) => {
  console.log(isEditProduct)
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <ProductDetails 
          control={control}
          categories={categories}
          units={units}
          simplified={true}
          isEditProduct={isEditProduct}

        />
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4">
        <ProductDetails 
          control={control}
          categories={categories}
          units={units}
          simplified={false}
          isEditProduct={isEditProduct}
        />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <ProductSettings control={control} />
        <ProductPalette />
      </TabsContent>
    </Tabs>
  );
};

export default ProductFormTabs;
