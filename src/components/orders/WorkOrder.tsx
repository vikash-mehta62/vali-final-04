import React, { useState } from 'react';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { exportWorkOrderToPDF, WorkOrderOptions } from '@/utils/pdf/work-order-export';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Download, Wrench, Eye, Package, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PalletTrackingForm, { PalletData } from './PalletTrackingForm';
import {updateOrderPlateAPI} from "@/services2/operations/order"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface WorkOrderFormProps {
  order: Order;
  onClose: () => void;
}

interface ItemInstruction {
  productId: string;
  instruction: string;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ order, onClose }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [itemInstructions, setItemInstructions] = useState<ItemInstruction[]>(
    order.items.map(item => ({ productId: item.productId, instruction: '' }))
  );
  
  console.log(order)
  const [palletData, setPalletData] = useState<PalletData | null>(order.palletData || null);
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  
  const [workOrderOptions, setWorkOrderOptions] = useState<WorkOrderOptions>({
    workOrderNumber: `WO-${order.orderNumber}`,
    assignedTo: '',
    department: 'Processing',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    equipmentNeeded: [],
    specialInstructions: '',
    includeCompanyLogo: true,
    itemInstructions: {},
    palletData: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkOrderOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWorkOrderOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setWorkOrderOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const equipmentList = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setWorkOrderOptions(prev => ({
      ...prev,
      equipmentNeeded: equipmentList
    }));
  };

  const handleItemInstructionChange = (productId: string, instruction: string) => {
    setItemInstructions(prev => 
      prev.map(item => 
        item.productId === productId ? { ...item, instruction } : item
      )
    );
    
    // Update the workOrderOptions with the new instructions
    const instructionsMap = { ...workOrderOptions.itemInstructions };
    instructionsMap[productId] = instruction;
    
    setWorkOrderOptions(prev => ({
      ...prev,
      itemInstructions: instructionsMap
    }));
  };

  const handleSavePalletData = async(data: PalletData) => {
    setPalletData(data);
   
    await updateOrderPlateAPI(data,token,order._id)
    setWorkOrderOptions(prev => ({
      ...prev,
      palletData: data,
      assignedTo: data.worker // Auto-assign the worker
    }));
    
      
    setActiveTab('details'); // Switch back to details tab
    
    toast({
      title: "Pallet Information Added",
      description: `Added ${data.palletCount} pallets with ${data.totalBoxes} boxes to the work order.`,
    });
  };

  const handlePreviewWorkOrder = () => {
    try {
      if (!workOrderOptions.assignedTo) {
        toast({
          title: "Missing Information",
          description: "Please assign the work order to someone before previewing.",
          variant: "destructive"
        });
        return;
      }
      
      const pdfDoc = exportWorkOrderToPDF(order, workOrderOptions, true); // true for preview mode
      
      // Open the PDF in a new tab for preview
      const pdfUrl = pdfDoc.output('bloburl');
      window.open(pdfUrl, '_blank');
      
    } catch (error) {
      console.error('Error previewing work order:', error);
      toast({
        title: "Preview Failed",
        description: "Failed to generate the work order preview. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateWorkOrder = () => {
    try {
      setIsGenerating(true);
      
      if (!workOrderOptions.assignedTo) {
        toast({
          title: "Missing Information",
          description: "Please assign the work order to someone.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }
      
      exportWorkOrderToPDF(order, workOrderOptions);
      
      toast({
        title: "Work Order Generated",
        description: `Work order ${workOrderOptions.workOrderNumber} has been generated and downloaded.`,
      });
      
      // Close the dialog after successful generation
      onClose();
    } catch (error) {
      console.error('Error generating work order:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the work order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wrench className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-xl font-semibold">Create Work Order</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Work Order Details
          </TabsTrigger>
          <TabsTrigger value="pallets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pallet Tracking
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <Label htmlFor="workOrderNumber">Work Order Number</Label>
                <Input
                  id="workOrderNumber"
                  name="workOrderNumber"
                  value={workOrderOptions.workOrderNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="assignedTo">Assigned Worker</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  value={workOrderOptions.assignedTo}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Name of person or team"
                  disabled={palletData !== null} // Disable if pallet data exists
                />
                {palletData && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Worker assigned from pallet tracking.
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={workOrderOptions.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Packaging">Packaging</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={workOrderOptions.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value as 'low' | 'medium' | 'high' | 'urgent')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={workOrderOptions.startDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={workOrderOptions.dueDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="equipmentNeeded">Equipment Needed</Label>
                <Textarea
                  id="equipmentNeeded"
                  placeholder="Enter equipment needed, separated by commas"
                  value={workOrderOptions.equipmentNeeded?.join(', ') || ''}
                  onChange={handleEquipmentChange}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4 flex items-center space-x-2">
                <Checkbox 
                  id="includeCompanyLogo" 
                  checked={workOrderOptions.includeCompanyLogo} 
                  onCheckedChange={(checked) => handleCheckboxChange('includeCompanyLogo', !!checked)}
                />
                <Label htmlFor="includeCompanyLogo">Include company logo</Label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              name="specialInstructions"
              placeholder="Enter any special instructions or notes"
              value={workOrderOptions.specialInstructions}
              onChange={handleInputChange}
              className="mt-1"
              rows={4}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Item Instructions</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">ID: {item.productId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Textarea
                          placeholder={`Special instructions for ${item.productName}`}
                          value={itemInstructions.find(i => i.productId === item.productId)?.instruction || ''}
                          onChange={(e) => handleItemInstructionChange(item.productId, e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pallets">
          <PalletTrackingForm
            orderItems={order.items}
            onSave={handleSavePalletData}
            initialData={palletData || undefined}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center space-x-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          variant="outline" 
          onClick={handlePreviewWorkOrder} 
          className="flex items-center"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handleGenerateWorkOrder} disabled={isGenerating} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Work Order'}
        </Button>
      </div>
    </div>
  );
};

export default WorkOrderForm;
