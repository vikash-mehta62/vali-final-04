
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Store } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { ShopFormValues } from './ShopFormTypes';
import { ShopStatus, StoreCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Import form sections
import ShopBasicInfo from './form-sections/ShopBasicInfo';
import ShopContactInfo from './form-sections/ShopContactInfo';
import ShopLocationInfo from './form-sections/ShopLocationInfo';
import ShopCategoryInfo from './form-sections/ShopCategoryInfo';
import ShopStatusInfo from './form-sections/ShopStatusInfo';

interface ShopFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopForm: React.FC<ShopFormProps> = ({ isOpen, onClose }) => {
  const { addStore } = useStore();
  const { toast } = useToast();
  
  const form = useForm<ShopFormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      state: '',
      isShop: true,
      shopStatus: 'closed' as ShopStatus,
      category: 'retail' as StoreCategory
    }
  });

  const onSubmit = (data: ShopFormValues) => {
    addStore({
      ...data,
      status: 'active',
      lastOrder: new Date().toISOString(),
      totalSpent: 0
    });
    
    form.reset();
    onClose();
    
    toast({
      title: "Shop Added",
      description: `${data.name} has been added to the map.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background z-[2000]">
        <DialogHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-medium">
            <Store className="h-5 w-5 text-primary" />
            Add New Shop
          </DialogTitle>
          <DialogClose className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none" />
        </DialogHeader>
        
        <div className="px-4 py-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <ShopBasicInfo form={form} />
                <ShopContactInfo form={form} />
                <ShopLocationInfo form={form} />
                <div className="grid grid-cols-1 gap-4">
                  <ShopCategoryInfo form={form} />
                  <ShopStatusInfo form={form} />
                </div>
              </div>
              
              <DialogFooter className="flex justify-end gap-2 pt-3 mt-3 border-t">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  Add Shop
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopForm;
