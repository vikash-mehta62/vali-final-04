
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessagesSquare, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import EmailForm from '@/components/shared/EmailForm';
import EmailDomainSettings from './EmailDomainSettings';
import VoipServicePanel from './VoipServicePanel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const MessagingPanel = () => {
  const [channel, setChannel] = useState('whatsapp');
  const [message, setMessage] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Configuration Required",
        description: "Please enter your webhook URL to enable messaging.",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would connect to your webhook that handles the actual message sending
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          channel,
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Message Queued",
        description: "Your message has been queued for sending.",
      });
      
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="messaging">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="messaging">
          <MessageCircle className="h-4 w-4 mr-2" />
          Messaging
        </TabsTrigger>
        <TabsTrigger value="email">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </TabsTrigger>
        <TabsTrigger value="domains">
          <Mail className="h-4 w-4 mr-2" />
          Email Domains
        </TabsTrigger>
        <TabsTrigger value="voip">
          <Phone className="h-4 w-4 mr-2" />
          VoIP Service
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="messaging">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" />
              Messaging Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Webhook URL
                </label>
                <Input
                  placeholder="Enter your webhook URL"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  type="url"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your messaging webhook to enable sending messages
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Channel
                </label>
                <Select
                  value={channel}
                  onValueChange={setChannel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <MessagesSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Webhook URL
                </label>
                <Input
                  placeholder="Enter your email webhook URL"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  type="url"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your email webhook to enable sending emails
                </p>
              </div>
              
              <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <EmailForm 
                    onClose={() => setEmailOpen(false)} 
                    webhookUrl={webhookUrl}
                    templates={true}
                    attachmentsEnabled={true}
                    showDomainConfig={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="domains">
        <EmailDomainSettings webhookUrl={webhookUrl} />
      </TabsContent>

      <TabsContent value="voip">
        <VoipServicePanel webhookUrl={webhookUrl} />
      </TabsContent>
    </Tabs>
  );
};

export default MessagingPanel;
