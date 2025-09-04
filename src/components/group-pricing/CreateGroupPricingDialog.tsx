import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { any, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ProductSelection } from "./form/ProductSelection";
import { DiscountFields } from "./form/DiscountFields";
import { QuantityFields } from "./form/QuantityFields";
import { GroupPharmacyFields } from "./form/GroupPharmacyFields";
// import { supabase } from "@/supabaseClient";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { min } from "date-fns";
import {getAllStoresAPI} from "@/services2/operations/auth"
import {getAllProductAPI} from "@/services2/operations/product"
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {creatGroupPricingAPI,updateGroupPricing } from "@/services2/operations/groupPricing"

interface GroupPricingData {
  id?: string;
  name: string;
  discount: number;
  discount_type: "percentage" | "fixed";
  min_quantity: number;
  max_quantity: number;
  storeId?: string[];

  product_arrayjson?:  {
    product_id?: string
    product_name?: string
    groupLabel?: string
    actual_price?: number
    new_price?: string
  }[];
  product_id_array?: string[];
  group_ids?: string[];
  status: string;
  updated_at: string;
  created_at?: string;
}

const createFormSchema = (products: any[]) =>
  z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce.number().min(0, "Discount must be at least 0"),
    minQuantity: z.coerce.number().min(1, "Minimum quantity must be at least 1"),
    maxQuantity: z.coerce.number().min(1, "Maximum quantity must be at least 1"),

    // ✅ Change product from `z.string()` to `z.array(z.string())`
    product: z.array(z.string()).optional(),
    product_arrayjson: z.array(
      z.object({
        product_id: z.string(),
        product_name: z.string(),
        groupLabel: z.string(),
        actual_price: z.number(),
        new_price: z.string(),
      })
    ).min(1, "At least one product must be selected"),
    
    group: z.array(z.string()).min(1, "At least one group  must be selected"),
  })
  
    


export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface CreateGroupPricingDialogProps {
  onSubmit: (groupPricing: GroupPricingData) => void;
  initialData?: GroupPricingData;
}

export function CreateGroupPricingDialog({ onSubmit, initialData }: CreateGroupPricingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productsSizes, setProductsSizes] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(products)),
    defaultValues: {
      name: initialData?.name || "",
      discountType: initialData?.discount_type || "percentage",
      discountValue: initialData?.discount || 0,
      minQuantity: initialData?.min_quantity || 1,
      maxQuantity: initialData?.max_quantity || 100,

      product:initialData?.product_id_array || [] ,
      product_arrayjson: initialData?.product_arrayjson?.map(p => ({
        ...p,
        actual_price: Number(p.actual_price),
      })) || [],

      group:  initialData?.storeId || [] ,

    },

  });

  useEffect(()=>{
  console.log(form.getValues())

},[initialData])

  const fetchData = async () => {
    console.log("Starting fetchData in CreateGroupPricingDialog");
    setLoading(true);
    try {


      console.log("Fetching data for group pricing...");
      const [productsResponse, groupsResponse, pharmaciesResponse] = await Promise.all([
        await getAllProductAPI(),
        await getAllStoresAPI() ,
        await getAllStoresAPI()
       
      ]);
 // supabase.from("products").select("id, name, base_price, product_sizes(*)"),
        // supabase.from("profiles").select("id, first_name, last_name"),
        // supabase.from("profiles").select("id, first_name, last_name").eq("type", "pharmacy")
      console.log("API Responses:", {
        products: productsResponse,
        groups: groupsResponse,
        pharmacies: pharmaciesResponse
      });

      const formattedGroups = groupsResponse?.map((group: any) => ({
        ...group,
        name: `${group.storeName}`,
        id: `${group._id}`,
      })) || [];

      const formattedPharmacies = pharmaciesResponse.map((pharmacy: any) => ({
        ...pharmacy,
        name: `${pharmacy.storeName}`,
        id: `${pharmacy._id}`,

      })) || [];

  // Step 1: Group products by category
const groupedByCategory = productsResponse.reduce((acc, product) => {
  const category = product.category || "Uncategorized";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {});

// Step 2: Convert to desired format
const groupedProductSizes = Object.keys(groupedByCategory).map(category => ({
  label: category,
  options: groupedByCategory[category].map(product => ({
    value: product._id,
    label: `${product?.name}`,
    actual_price: product.pricePerBox,
    groupLabel: product.name,
    image: product.image
  }))
}));

      
      console.log(groupedProductSizes);
      setProductsSizes(groupedProductSizes);
      

      setProducts(productsResponse);
      
      setGroups(formattedGroups);
      setPharmacies(formattedPharmacies);
      console.log("Data fetched successfully:", {
        products: productsResponse?.length,
        groups: formattedGroups.length,
        pharmacies: formattedPharmacies.length
      });
    } catch (error: any) {
      console.error("Error in fetchData:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (values: FormValues) => {
    console.log("Starting handleSubmit with values:", values);
    setLoading(true);

    try {
     

      const groupPricingData: GroupPricingData = {
        name: values.name,
        discount: values.discountValue,
        product_id_array: values.product,
        discount_type: values.discountType,
        min_quantity: values.minQuantity,
        max_quantity: values.maxQuantity,
        product_arrayjson:values.product_arrayjson,
        storeId: values.group,
        status: "active",
        updated_at: new Date().toISOString(),
      };

      console.log("Saving group pricing data:", initialData);
      
      if (!initialData) {
        await creatGroupPricingAPI(groupPricingData,token)

        groupPricingData.created_at = new Date().toISOString();
        
      } else {
        await updateGroupPricing(initialData.id,groupPricingData,token)
      }

      toast({
        title: "Success",
        description: initialData 
          ? "Group pricing updated successfully" 
          : "Group pricing created successfully",
      });
      
      onSubmit(groupPricingData);
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save group pricing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-[#e6b980] to-[#eacda3] hover:opacity-90 text-gray-800"
            size="sm"
          >
            <Plus className="h-4 w-4" /> Add Group Pricing
          </Button>
        </DialogTrigger>
        <div className=" ">
          <DialogContent className="bg-white max-h-50">
            <DialogHeader>
              <DialogTitle className="text-gray-800">
                {initialData ? "Edit" : "Create"} Group Pricing
              </DialogTitle>
              <DialogDescription>
                Configure pricing rules for specific groups and products
              </DialogDescription>
            </DialogHeader>
            {loading && !form.formState.isSubmitting ? (
              <div className="flex items-center justify-center py-8 ">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-[70vh] overscroll-y overflow-y-scroll">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 ">
                    <BasicInfoFields form={form} />
                    <ProductSelection form={form} products={productsSizes} />
                    {/* <DiscountFields form={form} /> */}
                    {/* <QuantityFields form={form} /> */}
                    <GroupPharmacyFields
                      form={form}
                      groups={groups}
                      pharmacies={pharmacies}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#e6b980] to-[#eacda3] hover:opacity-90 text-gray-800"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <span>{initialData ? "Update" : "Create"} Group Pricing</span>
                      )}
                    </Button>
                  </form>
                </Form></div>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
