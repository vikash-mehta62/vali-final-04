
import React from 'react';
import { EmailFormValues } from '@/utils/email';
import EmailForm from '@/components/shared/EmailForm';

interface DealEmailFormProps {
  onClose: () => void;
  onSubmit: (data: EmailFormValues) => void;
  defaultTo?: string;
  defaultSubject?: string;
  dealTitle?: string;
}

const DealEmailForm: React.FC<DealEmailFormProps> = ({
  onClose,
  onSubmit,
  defaultTo = '',
  defaultSubject = '',
  dealTitle = '',
}) => {
  const defaultMessage = `Hello,\n\nI'm writing to you about our deal: ${dealTitle}.\n\nPlease let me know if you have any questions.\n\nBest regards,\nYour Name`;

  return (
    <EmailForm
      onClose={onClose}
      onSubmit={onSubmit}
      defaultTo={defaultTo}
      defaultSubject={defaultSubject || `Regarding our deal: ${dealTitle}`}
      defaultMessage={defaultMessage}
      templates={true}
    />
  );
};

export default DealEmailForm;
