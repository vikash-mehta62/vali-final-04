
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, User, Mail, Phone, MapPin, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { VendorType } from '@/types/vendor';
import {createVendorAPI,getSingleVendorAPI,updateVendorAPI} from "@/services2/operations/vendor"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


const NewVendorForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<VendorType>('supplier');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [productsSupplied, setProductsSupplied] = useState('');
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const { id } = useParams(); // yeh id URL se milegi


  const fetchVendor = async () => {
    if (!id) return;
  
    try {
      const res = await getSingleVendorAPI(id, token);
      console.log(res);
  
      setName(res.name || '');
      setType(res.type || 'supplier');
      setContactName(res.contactName || '');
      setEmail(res.email || '');
      setPhone(res.phone || '');
      setAddress(res.address || '');
      setNotes(res.notes || '');
      setProductsSupplied(res.productsSupplied || '');
    } catch (error) {
      console.error("Error fetching vendor:", error);
    }
  };


  useEffect(()=>{
    fetchVendor()
  },[id])
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Missing vendor name",
        description: "Please enter a name for this vendor."
      });
      return;
    }
    const formData = {
      name,
      type,
      contactName,
      email,
      phone,
      address,
      notes,
      productsSupplied,
    };

    if(!id){
      const res = await createVendorAPI(formData, token);
      
    }else{
      const res = await updateVendorAPI(id,formData, token);
      
    }
      

    
    // Navigate back to vendors list
    navigate('/vendors');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/vendors')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Vendors
      </Button>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              {id ? "Edit Vendor" : "New Vendor" }
            </CardTitle>
            <CardDescription>
        {   !id &&   "Add a new vendor, farmer, or supplier to your database"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Green Valley Farms"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Vendor Type</Label>
                  <Select value={type} onValueChange={(value) => setType(value as VendorType)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    placeholder="e.g., John Smith"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="e.g., (555) 123-4567"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Full address"
                      className="pl-10"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="productsSupplied">Products Typically Supplied</Label>
              <Input
                id="productsSupplied"
                placeholder="e.g., Organic Apples, Pears, Cherries"
                value={productsSupplied}
                onChange={(e) => setProductsSupplied(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Separate multiple products with commas</p>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this vendor..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/vendors')}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {id ? "Edit Vendor" : "Add Vendor" }

            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewVendorForm;
