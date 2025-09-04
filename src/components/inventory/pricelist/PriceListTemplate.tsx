import React, { useEffect, useState } from "react";
import {
  PriceListTemplate as PriceListTemplateType,
  EmailSendOptions,
} from "@/components/inventory/forms/formTypes";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Edit,
  Trash2,
  Send,
  Mail,
  Download,
  FileText,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmailForm from "@/components/shared/EmailForm";
import { useToast } from "@/hooks/use-toast";
import { sendPriceListTemplateEmail } from "@/utils/email/inventoryEmailUtils";
import { exportPriceListToPDF } from "@/utils/pdf";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import SelecteStores from "./SelecteStores";
import { priceListEmailMulti } from "@/services2/operations/email";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createPriceListAPI } from "@/services2/operations/priceList";

interface PriceListTemplateProps {
  template: PriceListTemplateType;
  onSend: (templateId: string) => void;
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onCreateOrder: (templateId: string) => void;
}

const PriceListTemplate: React.FC<PriceListTemplateProps> = ({
  template,
  onSend,
  onEdit,
  onDelete,
  onCreateOrder,
  fetchProducts,
}) => {
  const formattedDate = format(new Date(template.createdAt), "MMMM dd, yyyy");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isMultiEmail, setMultiEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);

  const [selectedPricing, setSelectedPricing] = useState<string>("pricePerBox");
  const [selectedStore, setSelectedStore] = useState<
    { label: string; value: string }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prices, setPrices] = useState({
    price: "",
    aPrice: "",
    bPrice: "",
    cPrice: "",
    restaurantPrice: "",
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrices((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddNew = async (template) => {
    await createPriceListAPI(template, token);
    fetchProducts();
  };

  const sendMulti = async () => {
    const url = `http://valiproduce.shop/store/template?templateId=${template.id}`;
    console.log(url);
    await priceListEmailMulti({ url, selectedStore }, token);
  };

  const handleSendEmail = async (emailData) => {
    setIsSendingEmail(true);
    try {
      // Generate PDF before sending email
      const pdfDoc = exportPriceListToPDF(template);

      const emailOptions: EmailSendOptions = {
        webhookUrl: "/api/email", // Replace with your actual webhook URL
        fromName: "Vali Produce",
        showNotifications: true,
        attachments: [
          {
            filename: `price-list-${template.name
              .toLowerCase()
              .replace(/\s+/g, "-")}.pdf`,
            data: pdfDoc.output("datauristring"),
          },
        ],
      };

      const result = await sendPriceListTemplateEmail(
        template,
        emailData.clientIds || [], // You would need to populate this with selected clients
        emailOptions
      );

      if (result.success) {
        toast({
          title: "Price List Sent",
          description: `Successfully sent to ${result.sent} stores`,
          variant: "default",
        });
        setIsConfirmationVisible(true);
        setTimeout(() => setIsConfirmationVisible(false), 3000);
      } else {
        toast({
          title: "Error Sending Price List",
          description: `Failed to send to ${result.failed} stores`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending price list:", error);
      toast({
        title: "Error Generating PDF",
        description: "Failed to generate and send the price list PDF",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
      setIsEmailDialogOpen(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      console.log("template", template);
      console.log("prices", selectedPricing);
      exportPriceListToPDF(template, selectedPricing);

      toast({
        title: "PDF Downloaded",
        description: "Price list PDF has been generated and downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-black">{template.name}</h3>
          <p className="text-black text-sm mt-1">Created on {formattedDate}</p>
          {template.description && (
            <p className="text-black mt-2">{template.description}</p>
          )}

          <div className="mt-2">
            {template.status === "active" && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Active
              </Badge>
            )}
            {template.status === "draft" && (
              <Badge variant="secondary">Draft</Badge>
            )}
            {template.status === "archived" && (
              <Badge variant="destructive">Archived</Badge>
            )}
          </div>

          {/* 🚀 Copy URL Button */}
          <div className=" flex gap-2">
            <button
              onClick={() => {
                const catValue =
                  selectedPricing === "pricePerBox" ? "price" : selectedPricing;
                const url = `http://valiproduce.shop/store/template?templateId=${template.id}&cat=${catValue}`;
                navigator.clipboard.writeText(url);
                alert("URL copied to clipboard!");
              }}
              className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Copy URL
            </button>
            <button
              onClick={() => {
                const catValue =
                  selectedPricing === "pricePerBox" ? "price" : selectedPricing;
                const url = `http://valiproduce.shop/store/nextweek?templateId=${template.id}&cat=${catValue}`;
                navigator.clipboard.writeText(url);
                alert("URL copied to clipboard!");
              }}
              className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Copy Next Week Order URL
            </button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send to Stores
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateOrder(template.id)}>
              <FileText className="h-4 w-4 mr-2" />
              Create Order
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(template.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(template.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNew(template)}>
              <Download className="h-4 w-4 mr-2" />
              Duplicate Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Prices for Download</DialogTitle>
            </DialogHeader>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                value="pricePerBox"
                checked={selectedPricing === "pricePerBox"}
                onChange={() => setSelectedPricing("pricePerBox")}
              />
              <label>Price</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                value="aPrice"
                checked={selectedPricing === "aPrice"}
                onChange={() => setSelectedPricing("aPrice")}
              />
              <label>A Price</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                value="bPrice"
                checked={selectedPricing === "bPrice"}
                onChange={() => setSelectedPricing("bPrice")}
              />
              <label>B Price</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                value="cPrice"
                checked={selectedPricing === "cPrice"}
                onChange={() => setSelectedPricing("cPrice")}
              />
              <label>C Price</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                value="restaurantPrice"
                checked={selectedPricing === "restaurantPrice"}
                onChange={() => setSelectedPricing("restaurantPrice")}
              />
              <label>Restaurant Price</label>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleDownloadPDF}>Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEmailDialogOpen(true)}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Send className="h-4 w-4 mr-1" />
          Send to Stores
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setMultiEmail(true)}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Send className="h-4 w-4 mr-1" />
          Send to Bulk Stores
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onCreateOrder(template.id)}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <FileText className="h-4 w-4 mr-1" />
          Create Order
        </Button>
      </div>

      {isConfirmationVisible && (
        <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check className="h-4 w-4 mr-2" />
          Price list successfully sent to stores
        </div>
      )}

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Price List</DialogTitle>
            <DialogDescription>
              The price list will be sent as a PDF attachment to the selected
              stores.
            </DialogDescription>
          </DialogHeader>
          <EmailForm
            onClose={() => setIsEmailDialogOpen(false)}
            onSubmit={handleSendEmail}
            defaultSubject={`Price List: ${template.name}`}
            defaultMessage={`${template.id}&cat=${
              selectedPricing === "pricePerBox" ? "price" : selectedPricing
            }`}
            templates={true}
            attachmentsEnabled={true}
            webhookUrl="/api/email" // Replace with your actual webhook URL
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="email-form"
              disabled={isSendingEmail}
              isLoading={isSendingEmail}
            >
              Send Price List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMultiEmail} onOpenChange={setMultiEmail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Price List</DialogTitle>
            <DialogDescription>
              The price list will be sent as a PDF attachment to the selected
              stores.
            </DialogDescription>
          </DialogHeader>

          <SelecteStores
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMultiEmail(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={sendMulti}
              form="email-form"
              disabled={isSendingEmail || selectedStore.length === 0}
              isLoading={isSendingEmail}
            >
              Send Price List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceListTemplate;
