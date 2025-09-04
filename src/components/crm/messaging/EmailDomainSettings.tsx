
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Globe, Settings } from 'lucide-react';
import EmailDomainManager from '@/components/shared/EmailDomainConfig';
import { useToast } from '@/hooks/use-toast';

interface EmailDomainSettingsProps {
  webhookUrl?: string;
}

const EmailDomainSettings: React.FC<EmailDomainSettingsProps> = ({
  webhookUrl = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleOpen = () => {
    if (!webhookUrl) {
      toast({
        title: "Configuration Required",
        description: "Please enter a webhook URL in the email settings first",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          Business Email Domains
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Configure custom email domains to send emails from your business addresses
        </p>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleOpen}
              className="w-full"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Email Domains
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <EmailDomainManager
              webhookUrl={webhookUrl}
              onDomainChange={() => {}}
            />
          </DialogContent>
        </Dialog>
        
        <p className="text-xs text-muted-foreground mt-2">
          Send emails from your own domain name (e.g., name@yourbusiness.com)
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailDomainSettings;
