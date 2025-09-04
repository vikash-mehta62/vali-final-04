
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PageHeader from '@/components/shared/PageHeader';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderEditForm from '@/components/orders/OrderEditForm';
import { useToast } from '@/hooks/use-toast';
import { mockOrders } from '@/data/orderData';
import {getOrderAPI,updateOrderAPI} from "@/services2/operations/order"
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Order } from '@/types';
import AddressForm from '@/components/AddressFields';


const EditOrder = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId } = useParams();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const [order, setOrder] = useState<Order | null>(null);
  const [storeDetails, setStoreDetails] = useState("")
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone:"",
    country: "",
  })
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    email: "",
    phone:"",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })
  const [sameAsBilling, setSameAsBilling] = useState(false)


  console.log(orderId)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Find the order by ID
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderAPI(orderId, token);

        console.log(res)
        setShippingAddress(res?.shippingAddress)
        setBillingAddress(res?.billingAddress)
        const formattedOrder = {
          id: res._id || "",
          _id: res._id,
          orderId: res.orderId,
          store: res.store,
          customer: res.customer,
          date: res.date,
          items: res.items.map((item: any) => ({
            ...item,
            productName: item.name || item.productName, // rename 'product' to 'productName'
            productId: item.id || item._id || item.productId, // rename 'product' to 'productName'
          })),
          
          status: res.status,
          shippingAddress: res.shippingAddress,
          billingAddress: res.billingAddress,
          paymentMethod: res.paymentMethod,
          paymentStatus: res.paymentStatus,
          subtotal: res.subtotal || res.total,
          tax: res.tax,
          shipping: res.shippinCost,
          discount: res.discount,
          total: res.total,
          notes: res.notes,
          trackingNumber: res.trackingNumber,
          clientName: res.clientName,
          clientId: res.clientId,
        };

        setOrder(formattedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
  
    fetchOrder();
  }, []);

  interface Item {
    quantity: number;
    unitPrice: number;
  }
  const handleSubmitOrder = async(data: any) => {
    // In a real app, this would update the order in the database

if(!orderId) return
    const calculateTotal = () => {
      const items: Item[] = data?.items || []; // Ensure data.items is an array
      return items.reduce((total: number, item: Item) => {
        return total + item.quantity * item.unitPrice;
      }, 0);
    };


    const requiredFields = ["name", "email", "phone", "address", "city", "postalCode", "country"];
    const checkEmptyFields = (address: any) =>
      requiredFields.some((field) => !address?.[field]);
  
    const billingInvalid = checkEmptyFields(billingAddress);
    const shippingInvalid = sameAsBilling ? false : checkEmptyFields(shippingAddress);
  
    if (billingInvalid || shippingInvalid) {
      toast({
        title: "Incomplete Address",
        description: "Please fill all required address fields.",
        variant: "destructive",
      });
     
      return;
    }


    console.log(calculateTotal());  // Call the function to get the result
    const finalData = {
      ...data,
      billingAddress,
      clientId: { value: data?.store },
      shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
      total: calculateTotal() + order?.shipping,
      subtotal: calculateTotal(),
    };


  await updateOrderAPI(finalData,token,orderId)
    console.log(finalData);
    toast({
      title: "Order Updated",
      description: `Order ${data.orderId || orderId} has been updated successfully`,
    });
    navigate('/admin/orders');
  };

  const handleCancel = () => {
    navigate('/admin/orders');
  };

  if (!order) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <div className="page-container max-w-5xl mx-auto">
              <PageHeader 
                title="Edit Order" 
                description="Edit an existing order in the system"
              >
                <Button variant="outline" onClick={handleCancel}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Orders
                </Button>
              </PageHeader>
              
              <div className="mt-8 bg-white p-6 rounded-md shadow-sm border">
                <div className="text-center py-8">
                  <h2 className="text-xl font-medium text-red-600">Order not found</h2>
                  <p className="text-muted-foreground mt-2">The order you're trying to edit does not exist.</p>
                  <Button className="mt-4" onClick={handleCancel}>
                    Back to Orders
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="page-container max-w-5xl mx-auto">
            <PageHeader 
              title={`Edit Order ${orderId}`}
              description="Edit an existing order in the system"
            >
              <Button variant="outline" onClick={handleCancel}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Orders
              </Button>
            </PageHeader>
            
            <div className="mt-8 bg-white p-6 rounded-md shadow-sm border">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-medium">Order Details</h2>
              </div>
              

              <AddressForm
                  billingAddress={billingAddress}
                  setBillingAddress={setBillingAddress}
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  sameAsBilling={sameAsBilling}
                  setSameAsBilling={setSameAsBilling}
                />
              <OrderEditForm
                order={order}
                onSubmit={handleSubmitOrder}
                onCancel={handleCancel}
                setStoreDetails={setStoreDetails}
                shippingCost={order?.shipping}

              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditOrder;
