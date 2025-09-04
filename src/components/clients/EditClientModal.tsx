
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ClientForm from './ClientForm';
import { Client } from '@/lib/data';

interface EditClientModalProps {
  client: Client;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, 'id'>) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  open,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <ClientForm 
          initialData={client}
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
