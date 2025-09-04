import React, { useState, useEffect } from 'react';
import { TabsList, TabsTrigger, TabsContent, Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Save, ExternalLink, RefreshCw, XCircle, Plus, Eye, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FormFieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'hidden';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  enabled: boolean;
}

interface FormStyleConfig {
  theme: 'light' | 'dark' | 'colorful';
  fontFamily: string;
  primaryColor: string;
  borderRadius: number;
  labelPosition: 'top' | 'left' | 'hidden';
  buttonText: string;
  buttonAlign: 'left' | 'center' | 'right';
  submitRedirectUrl: string;
}

interface WebLeadCaptureFormEditorProps {
  initialCode: string;
  onCodeChange: (code: string) => void;
  onCopyCode: () => void;
  webhookUrl?: string;
}

const DEFAULT_FIELDS: FormFieldConfig[] = [
  { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true, enabled: true },
  { id: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true, enabled: true },
  { id: 'phone', type: 'tel', label: 'Phone Number', placeholder: 'Enter your phone number', required: false, enabled: true },
  { id: 'message', type: 'textarea', label: 'Message', placeholder: 'How can we help you?', required: false, enabled: true },
  { id: 'source', type: 'hidden', label: 'Source', placeholder: '', required: false, enabled: true },
];

const DEFAULT_STYLE: FormStyleConfig = {
  theme: 'light',
  fontFamily: 'system-ui, sans-serif',
  primaryColor: '#3b82f6',
  borderRadius: 4,
  labelPosition: 'top',
  buttonText: 'Submit',
  buttonAlign: 'center',
  submitRedirectUrl: '',
};

const WebLeadCaptureFormEditor: React.FC<WebLeadCaptureFormEditorProps> = ({
  initialCode,
  onCodeChange,
  onCopyCode,
  webhookUrl = "https://yourwebsite.com/api/leads"
}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [fields, setFields] = useState<FormFieldConfig[]>(DEFAULT_FIELDS);
  const [formStyle, setFormStyle] = useState<FormStyleConfig>(DEFAULT_STYLE);
  const [formAction, setFormAction] = useState(webhookUrl);
  const [formCode, setFormCode] = useState(initialCode);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customCode, setCustomCode] = useState(initialCode);
  const [isCustom, setIsCustom] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isCustom) {
      generateFormCode();
    } else {
      onCodeChange(customCode);
    }
  }, [fields, formStyle, formAction, isCustom, customCode]);

  const generateFormCode = () => {
    setIsGenerating(true);
    
    const fieldMarkup = fields
      .filter(field => field.enabled)
      .map(field => {
        if (field.type === 'hidden') {
          return `  <input type="hidden" name="${field.id}" value="${field.placeholder || field.id}" />`;
        }
        
        if (field.type === 'textarea') {
          return `  <div class="form-group">
    ${formStyle.labelPosition !== 'hidden' ? `<label for="${field.id}"${formStyle.labelPosition === 'top' ? ' class="block"' : ''}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
    <textarea id="${field.id}" name="${field.id}" placeholder="${field.placeholder}"${field.required ? ' required' : ''}></textarea>
  </div>`;
        }
        
        if (field.type === 'select') {
          return `  <div class="form-group">
    ${formStyle.labelPosition !== 'hidden' ? `<label for="${field.id}"${formStyle.labelPosition === 'top' ? ' class="block"' : ''}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
    <select id="${field.id}" name="${field.id}"${field.required ? ' required' : ''}>
      <option value="" disabled selected>Select an option</option>
      ${(field.options || []).map(option => `      <option value="${option.toLowerCase().replace(/\s+/g, '_')}">${option}</option>`).join('\n')}
    </select>
  </div>`;
        }
        
        if (field.type === 'checkbox') {
          return `  <div class="form-group checkbox-group">
    <input type="checkbox" id="${field.id}" name="${field.id}"${field.required ? ' required' : ''} />
    ${formStyle.labelPosition !== 'hidden' ? `<label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>` : ''}
  </div>`;
        }
        
        return `  <div class="form-group">
    ${formStyle.labelPosition !== 'hidden' ? `<label for="${field.id}"${formStyle.labelPosition === 'top' ? ' class="block"' : ''}>${field.label}${field.required ? ' *' : ''}</label>` : ''}
    <input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder}"${field.required ? ' required' : ''} />
  </div>`;
      })
      .join('\n\n');
    
    const getThemeColors = (theme: string) => {
      switch (theme) {
        case 'dark':
          return {
            bg: '#1f2937',
            text: '#f9fafb',
            border: '#374151',
            inputBg: '#111827',
            inputBorder: '#4b5563'
          };
        case 'colorful':
          return {
            bg: '#ffffff',
            text: '#333333',
            border: formStyle.primaryColor,
            inputBg: '#ffffff',
            inputBorder: formStyle.primaryColor
          };
        default: // light
          return {
            bg: '#ffffff',
            text: '#333333',
            border: '#e5e7eb',
            inputBg: '#f9fafb',
            inputBorder: '#d1d5db'
          };
      }
    };
    
    const colors = getThemeColors(formStyle.theme);
    
    const code = `<form action="${formAction}" method="POST" class="lead-capture-form ${formStyle.theme}-theme">
${fieldMarkup}

  <div class="form-submit" style="text-align: ${formStyle.buttonAlign}">
    <button type="submit">${formStyle.buttonText}</button>
  </div>
</form>

<style>
  .lead-capture-form {
    font-family: ${formStyle.fontFamily};
    max-width: 500px;
    padding: 20px;
    background: ${colors.bg};
    color: ${colors.text};
    border: 1px solid ${colors.border};
    border-radius: ${formStyle.borderRadius}px;
  }
  
  .lead-capture-form .form-group {
    margin-bottom: 15px;
  }
  
  .lead-capture-form label {
    display: ${formStyle.labelPosition === 'top' ? 'block' : 'inline-block'};
    margin-bottom: ${formStyle.labelPosition === 'top' ? '5px' : '0'};
    margin-right: ${formStyle.labelPosition === 'left' ? '10px' : '0'};
    font-weight: 500;
  }
  
  .lead-capture-form input[type="text"],
  .lead-capture-form input[type="email"],
  .lead-capture-form input[type="tel"],
  .lead-capture-form select,
  .lead-capture-form textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid ${colors.inputBorder};
    border-radius: ${formStyle.borderRadius}px;
    background: ${colors.inputBg};
    color: ${colors.text};
    font-family: inherit;
  }
  
  .lead-capture-form .checkbox-group {
    display: flex;
    align-items: center;
  }
  
  .lead-capture-form .checkbox-group input {
    margin-right: 10px;
  }
  
  .lead-capture-form button {
    background-color: ${formStyle.primaryColor};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: ${formStyle.borderRadius}px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  
  .lead-capture-form button:hover {
    opacity: 0.9;
  }
</style>`;
    
    setFormCode(code);
    onCodeChange(code);
    setIsGenerating(false);
  };

  const addField = () => {
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
      enabled: true
    };
    
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormFieldConfig>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) {
      toast({
        title: "Cannot remove field",
        description: "At least one field is required in the form.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }
    
    const updatedFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    setFields(updatedFields);
  };

  const toggleCustomCode = (value: boolean) => {
    if (value) {
      setCustomCode(formCode);
    } else {
      generateFormCode();
    }
    setIsCustom(value);
  };

  const exportAsHtml = () => {
    const blob = new Blob([formCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead-capture-form.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Form exported",
      description: "Lead capture form has been downloaded as HTML file."
    });
  };

  const resetToDefaults = () => {
    setFields(DEFAULT_FIELDS);
    setFormStyle(DEFAULT_STYLE);
    setFormAction(webhookUrl);
    setIsCustom(false);
    
    toast({
      title: "Form reset",
      description: "Form has been reset to default settings."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="custom-code-toggle">Custom Code</Label>
            <Switch 
              id="custom-code-toggle" 
              checked={isCustom} 
              onCheckedChange={toggleCustomCode}
            />
          </div>
          
          {!isCustom && (
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              Reset to Default
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onCopyCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={exportAsHtml}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {isCustom ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Custom HTML</CardTitle>
            <CardDescription>
              Edit the HTML code directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={customCode} 
              onChange={(e) => setCustomCode(e.target.value)} 
              className="font-mono text-sm h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="fields">Form Fields</TabsTrigger>
                <TabsTrigger value="style">Styling</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fields" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Form Fields</CardTitle>
                      <Button size="sm" onClick={addField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    <CardDescription>
                      Customize the fields in your lead capture form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4 border border-muted">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{field.label || `Field ${index + 1}`}</span>
                              <div className="flex items-center">
                                <Switch 
                                  checked={field.enabled} 
                                  onCheckedChange={(checked) => updateField(index, { enabled: checked })}
                                />
                                <span className="text-xs ml-1 text-muted-foreground">
                                  {field.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => moveField(index, 'up')}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => moveField(index, 'down')}
                                disabled={index === fields.length - 1}
                              >
                                ↓
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() => removeField(index)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`field-${index}-type`} className="text-xs">Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) => updateField(index, { 
                                  type: value as FormFieldConfig['type'] 
                                })}
                              >
                                <SelectTrigger id={`field-${index}-type`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="tel">Phone</SelectItem>
                                  <SelectItem value="textarea">Textarea</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="checkbox">Checkbox</SelectItem>
                                  <SelectItem value="hidden">Hidden</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`field-${index}-id`} className="text-xs">Field ID</Label>
                              <Input 
                                id={`field-${index}-id`}
                                value={field.id} 
                                onChange={(e) => updateField(index, { id: e.target.value })}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`field-${index}-label`} className="text-xs">Label</Label>
                            <Input 
                              id={`field-${index}-label`}
                              value={field.label} 
                              onChange={(e) => updateField(index, { label: e.target.value })}
                            />
                          </div>
                          
                          {field.type !== 'checkbox' && field.type !== 'hidden' && (
                            <div>
                              <Label htmlFor={`field-${index}-placeholder`} className="text-xs">Placeholder</Label>
                              <Input 
                                id={`field-${index}-placeholder`}
                                value={field.placeholder} 
                                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {field.type === 'hidden' && (
                            <div>
                              <Label htmlFor={`field-${index}-value`} className="text-xs">Value</Label>
                              <Input 
                                id={`field-${index}-value`}
                                value={field.placeholder} 
                                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {field.type === 'select' && (
                            <div>
                              <Label htmlFor={`field-${index}-options`} className="text-xs">Options (comma-separated)</Label>
                              <Input 
                                id={`field-${index}-options`}
                                value={field.options?.join(', ') || ''} 
                                onChange={(e) => updateField(index, { 
                                  options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) 
                                })}
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`field-${index}-required`}
                              checked={field.required} 
                              onCheckedChange={(checked) => updateField(index, { required: checked })}
                            />
                            <Label htmlFor={`field-${index}-required`} className="text-xs">Required field</Label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md">Form Styling</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your lead capture form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={formStyle.theme}
                        onValueChange={(value) => setFormStyle({...formStyle, theme: value as FormStyleConfig['theme']})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="colorful">Colorful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Font Family</Label>
                      <Select
                        value={formStyle.fontFamily}
                        onValueChange={(value) => setFormStyle({...formStyle, fontFamily: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-ui, sans-serif">System (Default)</SelectItem>
                          <SelectItem value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</SelectItem>
                          <SelectItem value="Georgia, serif">Georgia</SelectItem>
                          <SelectItem value="'Segoe UI', Tahoma, Geneva, sans-serif">Segoe UI</SelectItem>
                          <SelectItem value="'Courier New', Courier, monospace">Courier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          id="primary-color" 
                          value={formStyle.primaryColor} 
                          onChange={(e) => setFormStyle({...formStyle, primaryColor: e.target.value})}
                          className="w-12 h-10 rounded border border-input"
                        />
                        <Input 
                          value={formStyle.primaryColor} 
                          onChange={(e) => setFormStyle({...formStyle, primaryColor: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Border Radius</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          min={0} 
                          max={20} 
                          step={1}
                          value={[formStyle.borderRadius]} 
                          onValueChange={(value) => setFormStyle({...formStyle, borderRadius: value[0]})}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{formStyle.borderRadius}px</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Label Position</Label>
                      <Select
                        value={formStyle.labelPosition}
                        onValueChange={(value) => setFormStyle({...formStyle, labelPosition: value as FormStyleConfig['labelPosition']})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top (Block)</SelectItem>
                          <SelectItem value="left">Left (Inline)</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="button-text">Button Text</Label>
                      <Input 
                        id="button-text" 
                        value={formStyle.buttonText} 
                        onChange={(e) => setFormStyle({...formStyle, buttonText: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label>Button Alignment</Label>
                      <Select
                        value={formStyle.buttonAlign}
                        onValueChange={(value) => setFormStyle({...formStyle, buttonAlign: value as FormStyleConfig['buttonAlign']})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md">Form Settings</CardTitle>
                    <CardDescription>
                      Configure how your form submits and processes data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="form-action">Form Action URL</Label>
                      <Input 
                        id="form-action" 
                        value={formAction} 
                        onChange={(e) => setFormAction(e.target.value)}
                        placeholder="https://yourwebsite.com/api/leads"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This is the endpoint that will receive the form data
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="redirect-url">Success Redirect URL (Optional)</Label>
                      <Input 
                        id="redirect-url" 
                        value={formStyle.submitRedirectUrl} 
                        onChange={(e) => setFormStyle({...formStyle, submitRedirectUrl: e.target.value})}
                        placeholder="https://yourwebsite.com/thank-you"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Where to redirect users after successful form submission
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        type="button" 
                        size="sm"
                        onClick={() => {
                          window.open(formAction, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Test Endpoint
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Open the form action URL to test if it's accessible
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Form Preview</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={previewMode === 'desktop' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    className="h-8 px-3"
                  >
                    Desktop
                  </Button>
                  <Button 
                    variant={previewMode === 'mobile' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    className="h-8 px-3"
                  >
                    Mobile
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border rounded-md p-4 overflow-auto bg-gray-50 ${
                  previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full'
                }`}
                style={{ height: '500px' }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div 
                    className="preview-container"
                    dangerouslySetInnerHTML={{ __html: formCode }}
                  />
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => generateFormCode()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebLeadCaptureFormEditor;
