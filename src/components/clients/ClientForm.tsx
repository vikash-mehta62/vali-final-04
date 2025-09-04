import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@/lib/data";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  clientFormSchema,
  ClientFormValues,
  ClientFormProps,
} from "./form/ClientFormTypes";
import ClientShopToggle from "./form/ClientShopToggle";
import ClientBasicInfo from "./form/ClientBasicInfo";
import ClientContactInfo from "./form/ClientContactInfo";
import ClientAddressInfo from "./form/ClientAddressInfo";
import ClientShopInfo from "./form/ClientShopInfo";
import ClientStatusInfo from "./form/ClientStatusInfo";

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit }) => {
  const [isShop, setIsShop] = useState(initialData?.isShop || false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          company: initialData.company,
          email: initialData.email,
          phone: initialData.phone,
          state: initialData.state,
          status: initialData.status,
          isShop: initialData.isShop,
          category: initialData.category || "A",
          shopStatus: initialData.shopStatus || "closed",
        }
      : {
          name: "",
          company: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          status: "active",
          isShop: false,
          category: "A",
          shopStatus: "closed",
        },
  });

  const handleSubmit = (data: ClientFormValues) => {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log(data);

    return;
    const clientData: Omit<Client, "id"> = {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      state: data.state,
      status: data.status as "active" | "inactive",
      lastOrder: currentDate,
      totalSpent: 0,
      isShop: data.isShop,
      ...(data.isShop && {
        category: data.category as "A" | "B" | "C",
        shopStatus: data.shopStatus as "open" | "closed" | "busy",
        location: {
          lat: 0,
          lng: 0,
        },
      }),
    };

    onSubmit(clientData);
  };

  const shopTypeChange = (checked: boolean) => {
    setIsShop(checked);
    form.setValue("isShop", checked);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 py-4"
      >
        <ClientShopToggle form={form} onShopTypeChange={shopTypeChange} />
        <ClientBasicInfo form={form} />
        <ClientContactInfo form={form} />
        <ClientAddressInfo form={form} />

        {isShop && <ClientShopInfo form={form} />}

        <ClientStatusInfo form={form} />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit">
            {initialData ? "Update Client" : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
