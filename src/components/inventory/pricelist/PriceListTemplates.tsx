import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Plus, SendHorizontal } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PriceListTemplate from "./PriceListTemplate";
import PriceListTemplateForm from "./PriceListTemplateForm";
import {
  PriceListTemplate as PriceListTemplateType,
  PriceListProduct,
} from "@/components/inventory/forms/formTypes";
import { useToast } from "@/hooks/use-toast";
import CreateOrderModal from "./CreateOrderModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  createPriceListAPI,
  getAllPriceListAPI,
  updatePriceList,
} from "@/services2/operations/priceList";
import { deltePriceAPI } from "@/services2/operations/priceList";

// Mock data for price list templates

const PriceListTemplates = () => {
  const [templates, setTemplates] = useState<PriceListTemplateType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] =
    useState<PriceListTemplateType | null>(null);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PriceListTemplateType | null>(null);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const [loading, setLoading] = useState(false);

  const handleAddNew = () => {
    setCurrentTemplate(null);
    setIsFormOpen(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true); // Show loader
      const response = await getAllPriceListAPI();
      console.log(response);
      if (response) {
        setTemplates(response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      setIsFormOpen(true);
    }
  };

  const handleDelete = async (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    await deltePriceAPI(templateId);
    toast({
      title: "Template Deleted",
      description: "The price list template has been deleted successfully",
    });
  };

  const handleSaveTemplate = async (template: PriceListTemplateType) => {
    if (currentTemplate) {
      console.log(currentTemplate);

      await updatePriceList(template.id, template, token);
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
      toast({
        title: "Template Updated",
        description: "Price list template has been updated successfully",
      });
    } else {
      // const newTemplate = {
      //   ...template,
      //   id: `p${templates.length + 1}`,
      //   createdAt: new Date().toISOString(),
      // };
      // setTemplates([...templates, newTemplate]);

      await createPriceListAPI(template, token);

      toast({
        title: "Template Created",
        description: "New price list template has been created successfully",
      });
    }
    setIsFormOpen(false);
  };

  const handleSendClick = (templateId: string) => {
    console.log("Send clicked for template", templateId);
  };

  const handleCreateOrder = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setIsCreateOrderModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Price List Templates</h2>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-muted rounded-lg p-10 text-center">
            <SendHorizontal className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Price Lists Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first price list template to share with stores. You
              can customize products, prices, and categories.
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <PriceListTemplate
                key={template.id}
                template={template}
                onSend={handleSendClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreateOrder={handleCreateOrder}
                fetchProducts={fetchProducts}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <PriceListTemplateForm
            template={currentTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default PriceListTemplates;
