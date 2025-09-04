"use client"

import { useState } from "react"
import { Store, MapPin, KeyRound } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

import { StoreInfoForm } from "./components/store-info-form"
import { AddressForm } from "./components/address-form"
import { PasswordForm } from "./components/password-form"
import {
  storeSettingsSchema,
  passwordChangeSchema
} from "@/lib/validations/settings"
import type {
  StoreSettingsValues,
  PasswordChangeValues
} from "@/lib/validations/settings"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import Sidebar from "../layout/Sidebar"
import Navbar from "../layout/Navbar"
import {updateStoreAPI,updatePasswordSetting} from "@/services2/operations/auth"


export default function SettingsPage() {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  console.log(user)
  if (!user) return <div className="text-center py-20 text-muted-foreground">User not found.</div>

  const storeForm = useForm<StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: user.storeName || "",
      ownerName: user.ownerName || "",
      email: user.email || "",
      phone: user.phone || "",
      businessDescription: user.businessDescription || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
    },
    mode: "onChange",
  })

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const onUpdateSettings = async (values: StoreSettingsValues) => {
    setIsUpdating(true)
    try {
      console.log(values)
      await updateStoreAPI(user._id,values,token)
     
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const onChangePassword = async (values: PasswordChangeValues) => {
    setIsChangingPassword(true)
    try {
      await updatePasswordSetting(values,token)
   

      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (

    <div className="flex h-screen overflow-hidden">
              
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              <div className="flex-1 flex flex-col overflow-hidden overflow-y-scroll">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store profile, address, and security settings.
        </p>
      </div>

      <Tabs defaultValue="store-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-secondary text-secondary-foreground border rounded-lg">
          <TabsTrigger value="store-info" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 transition-all">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store Information</span>
            <span className="sm:hidden">Store</span>
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 transition-all">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Address</span>
            <span className="sm:hidden">Address</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 transition-all">
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">Password</span>
            <span className="sm:hidden">Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store-info">
          <Card className="bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your store details and business information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoreInfoForm
                form={storeForm}
                onSubmit={onUpdateSettings}
                isSubmitting={isUpdating}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle>Store Address</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your store&apos;s physical location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressForm
                form={storeForm}
                onSubmit={onUpdateSettings}
                isSubmitting={isUpdating}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm
                form={passwordForm}
                onSubmit={onChangePassword}
                isSubmitting={isChangingPassword}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
 
  )
}
