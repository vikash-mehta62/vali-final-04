
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Users, 
  Clock, 
  BarChart 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VoipServicePanelProps {
  webhookUrl?: string;
}

const VoipServicePanel: React.FC<VoipServicePanelProps> = ({ webhookUrl = '' }) => {
  const [sipProvider, setSipProvider] = useState('twilio');
  const [sipUsername, setSipUsername] = useState('');
  const [sipPassword, setSipPassword] = useState('');
  const [sipDomain, setSipDomain] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeNumber, setActiveNumber] = useState('');
  const [callTimer, setCallTimer] = useState('00:00');
  const [autoRecording, setAutoRecording] = useState(false);
  const { toast } = useToast();

  // Mock call history data
  const recentCalls = [
    { id: 1, name: 'John Smith', number: '+1 (555) 123-4567', time: '10:30 AM', duration: '5:23', type: 'outbound' },
    { id: 2, name: 'Sarah Johnson', number: '+1 (555) 987-6543', time: '9:45 AM', duration: '3:12', type: 'inbound' },
    { id: 3, name: 'Michael Davis', number: '+1 (555) 456-7890', time: 'Yesterday', duration: '8:05', type: 'outbound' },
    { id: 4, name: 'Lisa Wilson', number: '+1 (555) 234-5678', time: 'Yesterday', duration: '2:18', type: 'inbound' },
  ];

  const handleInitiateCall = () => {
    if (!sipUsername || !sipPassword || !sipDomain) {
      toast({
        title: "Configuration Required",
        description: "Please enter your SIP credentials to make calls.",
        variant: "destructive",
      });
      return;
    }
    
    if (!activeNumber) {
      toast({
        title: "Number Required",
        description: "Please enter a phone number to call.",
        variant: "destructive",
      });
      return;
    }

    // Simulate starting a call
    setIsCallActive(true);
    
    // Start call timer simulation
    let seconds = 0;
    let minutes = 0;
    const timer = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      
      setCallTimer(`${formattedMinutes}:${formattedSeconds}`);
    }, 1000);
    
    // Store the timer reference for cleanup
    (window as any).callTimerRef = timer;
    
    toast({
      title: "Call Initiated",
      description: `Calling ${activeNumber}...`,
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallTimer('00:00');
    
    // Clear the timer
    clearInterval((window as any).callTimerRef);
    
    toast({
      title: "Call Ended",
      description: "The call has been terminated.",
    });
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "You are now unmuted." : "You are now muted.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500" />
            VoIP Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              SIP Provider
            </Label>
            <Select
              value={sipProvider}
              onValueChange={setSipProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select SIP provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
                <SelectItem value="plivo">Plivo</SelectItem>
                <SelectItem value="custom">Custom SIP</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your VoIP service provider or select custom to enter your own SIP details
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sipUsername">SIP Username/Account ID</Label>
              <Input
                id="sipUsername"
                value={sipUsername}
                onChange={(e) => setSipUsername(e.target.value)}
                placeholder="Enter your SIP username or account ID"
              />
            </div>
            <div>
              <Label htmlFor="sipPassword">SIP Password/Auth Token</Label>
              <Input
                id="sipPassword"
                type="password"
                value={sipPassword}
                onChange={(e) => setSipPassword(e.target.value)}
                placeholder="Enter your SIP password or auth token"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="sipDomain">SIP Domain/Realm</Label>
            <Input
              id="sipDomain"
              value={sipDomain}
              onChange={(e) => setSipDomain(e.target.value)}
              placeholder="sip.example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The SIP domain or realm provided by your VoIP service
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-recording"
              checked={autoRecording}
              onCheckedChange={setAutoRecording}
            />
            <Label htmlFor="auto-recording">Automatically record calls</Label>
          </div>
          
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => {
              toast({
                title: "Settings Saved",
                description: "VoIP configuration has been saved successfully.",
              });
            }}
          >
            Save VoIP Configuration
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-blue-500" />
            VoIP Dialer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dialer">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="dialer">
                <PhoneCall className="h-4 w-4 mr-2" />
                Dialer
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-2" />
                Call History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dialer">
              <div className="space-y-4">
                <Input
                  placeholder="Enter phone number"
                  value={activeNumber}
                  onChange={(e) => setActiveNumber(e.target.value)}
                  disabled={isCallActive}
                  className="text-lg font-medium text-center"
                />
                
                {isCallActive ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold">Call in progress</p>
                      <p className="text-2xl font-bold text-green-500">{callTimer}</p>
                      <p className="text-sm text-muted-foreground">{activeNumber}</p>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 rounded-full"
                        onClick={handleToggleMute}
                      >
                        {isMuted ? (
                          <MicOff className="h-6 w-6 text-red-500" />
                        ) : (
                          <Mic className="h-6 w-6 text-green-500" />
                        )}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-12 w-12 rounded-full"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 rounded-full"
                        onClick={() => toast({
                          title: "Speaker Toggled",
                          description: "Speaker has been toggled.",
                        })}
                      >
                        <Volume2 className="h-6 w-6 text-green-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button 
                      className="h-16 w-16 rounded-full" 
                      onClick={handleInitiateCall}
                      variant="default"
                    >
                      <PhoneCall className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="divide-y">
                    {recentCalls.map((call) => (
                      <div 
                        key={call.id} 
                        className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setActiveNumber(call.number);
                          const dialerTab = document.querySelector('[data-value="dialer"]') as HTMLElement;
                          if (dialerTab) dialerTab.click();
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {call.type === 'inbound' ? (
                              <PhoneCall className="h-4 w-4 text-green-500 rotate-180" />
                            ) : (
                              <PhoneCall className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{call.name}</p>
                            <p className="text-sm text-muted-foreground">{call.number}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{call.time}</p>
                          <p className="text-sm text-muted-foreground">{call.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            VoIP Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-medium">Total Calls</h3>
              <p className="text-2xl font-bold">147</p>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <h3 className="text-lg font-medium">Avg. Duration</h3>
              <p className="text-2xl font-bold">4:32</p>
              <p className="text-sm text-muted-foreground">Minutes:Seconds</p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <PhoneCall className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <h3 className="text-lg font-medium">Success Rate</h3>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-muted-foreground">Connected calls</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoipServicePanel;
