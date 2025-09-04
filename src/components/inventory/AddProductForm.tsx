import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { FormValues, formSchema } from "./forms/formTypes";
import { Form } from "@/components/ui/form";
import FormActions from "./forms/FormActions";
import { generateId } from "@/data/productData";
import { AlertCircle } from "lucide-react";
import ProductFormTabs from "./ProductFormTabs";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAPI } from "@/services2/operations/category";
import { createProductAPI ,updateProductAPI} from "@/services2/operations/product";
import { RootState } from "@/redux/store";
import {getSingleProductAPI} from "@/services2/operations/product"
interface AddProductFormProps {
  onSuccess: () => void;
  onAddProduct?: (product: any) => void;
  editProduct?:string
  isEditProduct?:boolean
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onSuccess,
  onAddProduct,
  editProduct,
  isEditProduct
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      unit: "lb",
      price: 0,
      totalPurchase: 0,
      threshold: 5,
      description: "",
      enablePromotions: false,
      palette: undefined,
      image: "",
      weightVariation: 0,
      expiryDate: undefined,
      batchInfo: "",
      origin: "",
      organic: false,
      storageInstructions: "",
      boxSize: 0,
      pricePerBox: 0,
      shippinCost:0
    },
  });

  const[loading,setLoading] = useState(false)
console.log(isEditProduct)

  const fetchProductDetails = async () => {
    if (!isEditProduct || !editProduct) return;
    setLoading(true);
  
    try {
      const response = await getSingleProductAPI(editProduct);
      if (response) {
        console.log(response); // ✅ Debugging ke liye
  
        // ✅ API se aayi values ko form me reset karo
        form.reset({
          name: response.name || "",
          category: response.category || "",
          quantity: response.quantity || 0,
          totalPurchase: response.totalPurchase || 0,
          unit: response.unit || "lb",
          price: response.price || 0,
          threshold: response.threshold || 5,
          description: response.description || "",
          enablePromotions: response.enablePromotions || false,
          palette: response.palette || "",
          image: response.image || "",
          weightVariation: response.weightVariation || 0,
          expiryDate: response.expiryDate ? new Date(response.expiryDate).toISOString() : "", // ✅ Fix
          batchInfo: response.batchInfo || "",
          origin: response.origin || "",
          organic: response.organic || false,
          storageInstructions: response.storageInstructions || "",
          boxSize: response.boxSize || 0,
          pricePerBox: response.pricePerBox || 0,
          shippinCost:response.shippinCost || 0
        });
      }
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
    
    setLoading(false);
  };
  

  useEffect(()=>{
    fetchProductDetails()

  },[isEditProduct,editProduct])


  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const getAllCategories = async () => {
    const response = await dispatch(getAllCategoriesAPI());
    console.log(response);
    setCategories(response || []);
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  const onSubmit = async (data: FormValues) => {
console.log(data)
    if(isEditProduct){
      await updateProductAPI(editProduct,data, token);
      onSuccess();
      form.reset();
    }else{

     const res =  await createProductAPI(data, token);
     console.log(res)
     if(res){
      
    onSuccess();
    form.reset();
     }
    }
    

  };

  const units = ["lb", "oz", "units", "boxes", "bunches", "cases", "pallets","ml"];

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        {loading ? (
          // ✅ Loader while fetching product details
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ProductFormTabs control={form.control} categories={categories} units={units} isEditProduct={isEditProduct} />
  
            {hasErrors && (
              <div className="flex items-center gap-2 text-destructive text-sm mt-2 mb-0 px-2 py-1 bg-destructive/10 rounded">
                <AlertCircle size={16} />
                <span>Please fix the errors before submitting.</span>
              </div>
            )}
  
            <FormActions onCancel={onSuccess} isProcessing={form.formState.isSubmitting}  submitText={isEditProduct ? "Edit Product" : "Add Product" }/>
          </form>
        )}
      </Form>
    </FormProvider>
  );
}
  

export default AddProductForm;
