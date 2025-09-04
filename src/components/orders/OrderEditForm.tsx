import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, User } from "lucide-react";
import { Order } from "@/types";
import { getAllMembersAPI } from "@/services2/operations/auth";
import { getAllProductAPI } from "@/services2/operations/product";
import Select2, { GroupBase, Options } from "react-select";

// Define the OrderItem type with required fields
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Define the order form schema
const formSchema = z.object({
  store: z.string().min(1, "Shop  is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      productName: z.string().min(1, "Product name is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Unit price must be at least 0"),
      shippinCost: z.number().optional(),
      pricingType: z.enum(["box", "unit"])
    })
  ),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderEditFormProps {
  order?: Order;
  onSubmit: (data: OrderFormValues) => void;
  setStoreDetails?: (data: string) => void;
  onCancel: () => void;
  onViewClientProfile?: () => void;
  shippingCost?: number;

}

const OrderEditForm: React.FC<OrderEditFormProps> = ({
  order,
  onSubmit,
  onCancel,
  onViewClientProfile,
  setStoreDetails,
  shippingCost = 0
}) => {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState([]);
  const [products, setProducts] = useState([]);


  console.log(order)
  // Define default values for the form
  const defaultValues: OrderFormValues = {
    store: order?.store || "",
    status: order?.status || "pending",
    items: (order?.items || [
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        pricingType: "box",
        shippinCost: 0
      },
    ]).map((item) => ({
      ...item,
      pricingType: item.pricingType === "unit" ? "unit" : "box",
      shippinCost: item.shippinCost || 0// force correct typing
    })),
  };


  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Function to add a new item to the order
  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  // const calculateTotal = () => {
  //   const items = form.getValues("items");
  //   return items.reduce(
  //     (total, item) => total + item.quantity * item.unitPrice,
  //     0
  //   );
  // };


  // const calculateSubtotal = () => {
  //   const items = form.getValues("items");
  //   return items.reduce(
  //     (total, item) => total + item.quantity * item.unitPrice,
  //     0
  //   );
  // };

  // const calculateShipping = () => {
  //   const items = form.getValues("items");
  //   return Math.max(...items.map((item) => item.shippinCost || 0), 0);
  // };



  const calculateSubtotal = () => {
    const items = form.getValues("items");
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );

  };

  const calculateShipping = () => {
    const items = form.getValues("items");
    // return items.reduce(
    //   (total, item) => total + item.quantity * (item.shippinCost || 0),
    //   0
    // );
    return shippingCost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };


  const getMaxShippingCost = () => {
    const items = form.getValues("items");
    if (!items || items.length === 0) return 0;

    return Math.max(...items.map(item => item.shippinCost || 0));
  };




  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getAllMembersAPI();
      const filteredData = data.filter((store) => store.role === "store");

      const formattedData = filteredData.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));

      setStore(formattedData);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProductAPI();
      console.log(response);
      if (response) {
        const updatedProducts = response.map((product) => ({
          ...product,
          id: product._id,
          lastUpdated: product?.updatedAt,
        }));
        console.log(updatedProducts)
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, []);



  const productOptions: {
    value: string;
    label: string;
    pricePerBox: number;
    pricePerUnit: number;
    shippinCost: number
  }[] = products.map((product) => ({
    value: product.id,
    label: product.name,
    pricePerBox: Number(product.pricePerBox),
    pricePerUnit: Number(product.price), // Make sure this exists in product
    shippinCost: Number(product.shippinCost || 0), // Make sure this exists in product
  }));



  useEffect(() => {


    setStoreDetails(form.getValues("store"))
  }, [form.watch("store")])



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="store"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Store</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                      <SelectContent>
                        {store.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.storeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {onViewClientProfile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onViewClientProfile}
                        className="flex-shrink-0"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-medium mb-4">Order Items</h3>



          {form.watch("items").map((_, index) => {
            return (
              <div key={index} className="grid grid-cols-12 gap-2 mb-4 items-center">
                {/* Product Select Dropdown */}
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select2
                            value={productOptions.find(option => option.value === field.value)}
                            options={productOptions}
                            onChange={(selectedOption) => {
                              const pricingType = form.getValues(`items.${index}.pricingType`);
                              form.setValue(`items.${index}.productId`, selectedOption.value);
                              form.setValue(`items.${index}.productName`, selectedOption.label);
                              const unitPrice =
                                pricingType === "unit"
                                  ? selectedOption.pricePerUnit
                                  : selectedOption.pricePerBox;
                              form.setValue(`items.${index}.unitPrice`, unitPrice);
                              form.setValue(`items.${index}.shippinCost`, selectedOption.shippinCost);
                            }}
                          />

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>



                {/* Pricing Type Selector */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.pricingType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedProduct = productOptions.find(
                                (opt) => opt.value === form.getValues(`items.${index}.productId`)
                              );
                              if (selectedProduct) {
                                const price =
                                  value === "box"
                                    ? selectedProduct.pricePerBox
                                    : selectedProduct.pricePerUnit;
                                form.setValue(`items.${index}.unitPrice`, price);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="box">Per Box</SelectItem>
                              <SelectItem value="unit">Per Unit</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-1.5">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remove Item Button */}
                <div className="col-span-0.5 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={form.watch("items").length <= 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })}



          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="mt-2 w-full"
          >
            Add Item
          </Button>

          {/* Order Summary */}
          <div className="p-4 border rounded-md bg-gray-50 mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>$ {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping:</span>
              <span>$ {calculateShipping().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total:</span>
              <span>$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>


        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {order ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderEditForm;