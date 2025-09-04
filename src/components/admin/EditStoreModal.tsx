"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store, X } from 'lucide-react'
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateStoreAPI, getUserAPI } from "@/services2/operations/auth" // You'll need to create this service
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const storeEditSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  shippingCost: z.string().optional(),
  businessDescription: z.string().optional(),
  priceCategory: z.enum(["price", "aPrice", "bPrice", "restaurantPrice"]),
})

type StoreEditValues = z.infer<typeof storeEditSchema>

interface StoreEditModalProps {
  storeId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const StoreEditModal = ({ storeId, isOpen, onClose, onSuccess }: StoreEditModalProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const form = useForm<StoreEditValues>({
    resolver: zodResolver(storeEditSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      shippingCost: 0,
      businessDescription: "",
      priceCategory: "price", // Default value
    },
  })

  useEffect(() => {
    if (storeId && isOpen) {
      fetchStoreData(storeId)
    }
  }, [storeId, isOpen])

  const fetchStoreData = async (id: string) => {
    setIsFetching(true)
    try {
      const storeData = await getUserAPI({ id })
      console.log(storeData)
      if (storeData) {
        form.reset({
          storeName: storeData.storeName || "",
          ownerName: storeData.ownerName || "",
          email: storeData.email || "",
          phone: storeData.phone || "",
          address: storeData.address || "",
          city: storeData.city || "",
          state: storeData.state || "",
          zipCode: storeData.zipCode || "",
          shippingCost: storeData.shippingCost || 0,
          businessDescription: storeData.businessDescription || "",
          priceCategory: storeData.priceCategory || "price",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store data",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (values: StoreEditValues) => {
    if (!storeId) return

    setIsLoading(true)
    try {
      await updateStoreAPI(storeId, values,token)
      toast({
        title: "Success",
        description: "Store updated successfully",
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update store",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Store className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-bold">Edit Store</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zip code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             

                <FormField
                  control={form.control}
                  name="priceCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="aPrice">A Price</SelectItem>
                          <SelectItem value="bPrice">B Price</SelectItem>
                          <SelectItem value="cPrice">C Price</SelectItem>
                          <SelectItem value="restaurantPrice">Restaurant Price</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                   <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Shipping Cost" {...field}  type="number"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter business description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Updating...
                    </>
                  ) : (
                    "Update Store"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}

export default StoreEditModal
