import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EmailFormValues,
  emailFormSchema,
  emailTemplates,
  sendEmail,
  type EmailTemplate,
  type DomainConfig,
  defaultEmailDomains
} from '@/utils/email';
import { Loader2, Paperclip, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailDomainManager from './EmailDomainConfig';
import { priceListEmail } from "@/services2/operations/email"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


interface EmailFormProps {
  onClose: () => void;
  onSubmit?: (data: EmailFormValues) => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  templates?: boolean;
  attachmentsEnabled?: boolean;
  webhookUrl?: string;
  showDomainConfig?: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({
  onClose,
  onSubmit,
  defaultTo = '',
  defaultSubject = '',
  defaultMessage = '',
  templates = false,
  attachmentsEnabled = false,
  webhookUrl = '',
  showDomainConfig = false,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeTab, setActiveTab] = useState<string>("compose");
  const [emailDomains, setEmailDomains] = useState<DomainConfig[]>(defaultEmailDomains);
  const [selectedDomain, setSelectedDomain] = useState<string>(
    emailDomains.find(d => d.isDefault)?.domain || ''
  );
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const defaultValues = {
    to: defaultTo,
    subject: defaultSubject,
    message: defaultMessage,
    cc: '',
    bcc: '',
    attachments: [],
  };

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues,
  });

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (template && emailTemplates[template]) {
      form.setValue('subject', emailTemplates[template].subject);
      form.setValue('message', emailTemplates[template].message);
    }
  };

  const handleSubmit = async (data: EmailFormValues) => {
    // setIsLoading(true);

    try {
      const selectedDomainConfig = emailDomains.find(d => d.domain === selectedDomain);

      const formData = new FormData();
      formData.append("data", data.to);
      formData.append("subject", data.subject);
      formData.append("message", defaultMessage ||data.message);
      formData.append("cc", data.cc);
      formData.append("bcc", data.bcc);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });


      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      
      if(templates){

        await priceListEmail(formData, token)
      }
      
      if (onSubmit) {
        onSubmit(data);
      } else if (webhookUrl) {
        await sendEmail(data, {
          webhookUrl,
          fromDomain: selectedDomain,
          fromName: selectedDomainConfig?.defaultSenderName,
          onSuccess: () => {
            toast({
              title: "Email sent",
              description: "Your email has been sent successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error sending email",
              description: error.message || "Failed to send email",
              variant: "destructive",
            });
          }
        });
      } else {
        toast({
          title: "Configuration required",
          description: "Please configure a webhook URL to send emails",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      // onClose();
    }
  };

  const handleDomainChange = (domains: DomainConfig[]) => {
    setEmailDomains(domains);

    // Update selected domain if the current one is removed or if a new default is set
    const defaultDomain = domains.find(d => d.isDefault);
    if (defaultDomain && !domains.some(d => d.domain === selectedDomain)) {
      setSelectedDomain(defaultDomain.domain);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  // File remove karne ka function
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="compose">Compose Email</TabsTrigger>
        {showDomainConfig && (
          <TabsTrigger value="domains">Email Domains</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="compose">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {templates && (
              <div className="mb-4">
                <FormLabel>Template</FormLabel>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">Custom Email</SelectItem> */}
                    {Object.entries(emailTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {emailDomains.length > 1 && (
              <div className="mb-4">
                <FormLabel>Send From</FormLabel>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sending domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailDomains.map((domain) => (
                      <SelectItem key={domain.domain} value={domain.domain}>
                        {domain.defaultSenderName} ({domain.domain})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="recipient@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CC</FormLabel>
                    <FormControl>
                      <Input placeholder="cc@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bcc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BCC</FormLabel>
                    <FormControl>
                      <Input placeholder="bcc@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Email subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message here"
                      className="resize-none"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

{attachmentsEnabled && (
          <div className="mt-4">
            <FormLabel>Attachments</FormLabel>
            <div className="flex items-center gap-2">
              <Input type="file" multiple onChange={handleFileChange} />
              <Button type="button" variant="outline">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach Files
              </Button>
            </div>
            {/* Show selected files */}
            {attachments.length > 0 && (
              <div className="mt-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex justify-between items-center border p-2">
                    <span>{file.name}</span>
                    <Button type="button" variant="destructive" onClick={() => removeAttachment(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </TabsContent>

      {showDomainConfig && (
        <TabsContent value="domains">
          <EmailDomainManager
            webhookUrl={webhookUrl}
            onDomainChange={handleDomainChange}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default EmailForm;
