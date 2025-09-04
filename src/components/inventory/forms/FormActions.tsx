
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  submitText?: string;
  isProcessing?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitText = "Add Product",
  isProcessing = false
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isProcessing} className="px-6">
        {isProcessing ? "Processing..." : submitText}
      </Button>
    </div>
  );
};

export default FormActions;
