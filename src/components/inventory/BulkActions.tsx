
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  Pencil, 
  Trash, 
  Archive, 
  Download, 
  FileText,
  Tag,
  Clock,
  Truck,
  DollarSign,
  ListFilter,
  Tags,
  AlertTriangle
} from 'lucide-react';
import { Product } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsProps {
  selectedProducts: string[];
  onClearSelection: () => void;
  onUpdateProducts: (products: Product[]) => void;
  products: Product[];
  onReorder?: () => void;
  onPriceUpdate?: () => void;
  onBulkDiscount?: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedProducts, 
  onClearSelection, 
  onUpdateProducts,
  products,
  onReorder,
  onPriceUpdate,
  onBulkDiscount
}) => {
  const { toast } = useToast();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (selectedProducts.length === 0) {
    return null;
  }

  const handleBulkDelete = () => {
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredProducts = products.filter(
        product => !selectedProducts.includes(product.id)
      );
      onUpdateProducts(filteredProducts);
      onClearSelection();
      setIsDeleting(false);
      
      toast({
        title: "Products Deleted",
        description: `${selectedProducts.length} products have been deleted`,
        variant: "destructive",
      });
    }, 1000);
  };

  const handleBulkUpdateCategory = () => {
    // Demo function - in a real app, would show a dialog to select category
    const updatedProducts = [...products];
    selectedProducts.forEach(id => {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          category: 'Promotional'
        };
      }
    });
    onUpdateProducts(updatedProducts);
    
    toast({
      title: "Categories Updated",
      description: `${selectedProducts.length} products have been updated to 'Promotional' category`,
    });
  };

  const handleBulkUpdatePrice = () => {
    if (onPriceUpdate) {
      onPriceUpdate();
    } else {
      // Fallback if handler not provided - simple 5% increase
      const updatedProducts = [...products];
      selectedProducts.forEach(id => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          updatedProducts[index] = {
            ...updatedProducts[index],
            price: Math.round(updatedProducts[index].price * 1.05 * 100) / 100,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
      });
      onUpdateProducts(updatedProducts);
      
      toast({
        title: "Prices Updated",
        description: `${selectedProducts.length} products have been updated with a 5% price increase`,
      });
    }
  };
  
  const handleBulkArchive = () => {
    setIsArchiving(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedProducts = [...products];
      selectedProducts.forEach(id => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          // Instead of setting a 'status' property which doesn't exist on Product type,
          // we add a custom property 'archived' and update lastUpdated
          updatedProducts[index] = {
            ...updatedProducts[index],
            lastUpdated: new Date().toISOString().split('T')[0],
            quantity: 0 // Set quantity to 0 to indicate it's archived
          };
        }
      });
      onUpdateProducts(updatedProducts);
      onClearSelection();
      setIsArchiving(false);
      
      toast({
        title: "Products Archived",
        description: `${selectedProducts.length} products have been archived`,
      });
    }, 1000);
  };
  
  const handleBulkExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create CSV content
      const headers = ['ID', 'Name', 'Category', 'Price', 'Quantity', 'Unit'];
      const rows = selectedProducts.map(id => {
        const product = products.find(p => p.id === id);
        if (!product) return null;
        return [
          product.id,
          product.name,
          product.category,
          product.price,
          product.quantity,
          product.unit
        ].join(',');
      }).filter(Boolean);
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      
      setIsExporting(false);
      
      toast({
        title: "Export Complete",
        description: `${selectedProducts.length} products have been exported to CSV`,
      });
    }, 1500);
  };

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{selectedProducts.length} items selected</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2"
              onClick={onClearSelection}
            >
              <X size={14} className="mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleBulkUpdateCategory}
            >
              <Tag size={14} className="mr-1" />
              Update Category
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleBulkUpdatePrice}
            >
              <DollarSign size={14} className="mr-1" />
              Update Price
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
              onClick={onPriceUpdate}
            >
              <ListFilter size={14} className="mr-1" />
              Price List
            </Button>
            {onBulkDiscount && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                onClick={onBulkDiscount}
              >
                <Tags size={14} className="mr-1" />
                Volume Discounts
              </Button>
            )}
            {onReorder && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={onReorder}
              >
                <Truck size={14} className="mr-1" />
                Reorder
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleBulkArchive}
              isLoading={isArchiving}
            >
              <Archive size={14} className="mr-1" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleBulkExport}
              isLoading={isExporting}
            >
              <FileText size={14} className="mr-1" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={handleBulkDelete}
              isLoading={isDeleting}
            >
              <Trash size={14} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActions;
