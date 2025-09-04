import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Globe, Plus, Trash2 } from 'lucide-react';
import { verifyEmailDomain } from '@/utils/email';
import { DomainConfig, defaultEmailDomains } from '@/utils/email';

const domainFormSchema = z.object({
  domain: z
    .string()
    .min(4, "Domain must be at least 4 characters")
    .refine((val) => /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(val), {
      message: "Please enter a valid domain name",
    }),
  senderName: z.string().min(2, "Sender name must be at least 2 characters"),
  isDefault: z.boolean().default(false),
});

type DomainFormValues = z.infer<typeof domainFormSchema>;

interface EmailDomainConfigProps {
  webhookUrl: string;
  onDomainChange?: (domains: DomainConfig[]) => void;
}

const EmailDomainManager: React.FC<EmailDomainConfigProps> = ({
  webhookUrl,
  onDomainChange,
}) => {
  const [domains, setDomains] = useState<DomainConfig[]>(defaultEmailDomains);
  const [showForm, setShowForm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domain: '',
      senderName: '',
      isDefault: false,
    },
  });

  const handleAddDomain = async (data: DomainFormValues) => {
    setIsVerifying(true);
    
    try {
      const result = await verifyEmailDomain(data.domain, webhookUrl);
      
      // In a real implementation, domain verification would be asynchronous
      // For this demo, we're simulating an immediate response
      const newDomain: DomainConfig = {
        domain: data.domain,
        verified: result.success,
        defaultSenderName: data.senderName,
        isDefault: data.isDefault,
        addedOn: new Date().toISOString(),
      };
      
      // If this is set as default, update other domains
      const updatedDomains = domains.map(d => ({
        ...d,
        isDefault: data.isDefault ? false : d.isDefault,
      }));
      
      const newDomains = [...updatedDomains, newDomain];
      setDomains(newDomains);
      
      if (onDomainChange) {
        onDomainChange(newDomains);
      }
      
      toast({
        title: result.success ? "Domain Added" : "Domain Added (Pending)",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      form.reset();
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add domain: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = (domain: string) => {
    const updatedDomains = domains.filter(d => d.domain !== domain);
    
    // If we're removing the default domain, set a new default if possible
    const hasDefault = updatedDomains.some(d => d.isDefault);
    
    if (!hasDefault && updatedDomains.length > 0) {
      updatedDomains[0].isDefault = true;
    }
    
    setDomains(updatedDomains);
    
    if (onDomainChange) {
      onDomainChange(updatedDomains);
    }
    
    toast({
      title: "Domain Removed",
      description: `${domain} has been removed from your domains`,
    });
  };

  const handleSetDefault = (domain: string) => {
    const updatedDomains = domains.map(d => ({
      ...d,
      isDefault: d.domain === domain,
    }));
    
    setDomains(updatedDomains);
    
    if (onDomainChange) {
      onDomainChange(updatedDomains);
    }
    
    toast({
      title: "Default Domain Updated",
      description: `${domain} is now your default sending domain`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Email Domains
        </CardTitle>
        <CardDescription>
          Configure custom email domains for your business communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {domains.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default Name</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.domain}>
                    <TableCell className="font-medium">{domain.domain}</TableCell>
                    <TableCell>
                      {domain.verified ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{domain.defaultSenderName}</TableCell>
                    <TableCell>
                      {domain.isDefault ? (
                        <Badge variant="default">Default</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(domain.domain)}
                        >
                          Set Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDomain(domain.domain)}
                        disabled={domain.domain === 'gmail.com'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No custom domains configured yet.
            </div>
          )}

          {showForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddDomain)} className="space-y-4 border p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="yourbusiness.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Sender Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Set as Default Domain</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isVerifying}>
                    {isVerifying ? "Verifying..." : "Add Domain"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Domain
            </Button>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">How domain verification works:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Add your domain name above</li>
              <li>We'll send a verification email to the domain administrator</li>
              <li>Follow the instructions in the email to verify ownership</li>
              <li>Once verified, you can send emails from your custom domain</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailDomainManager;
