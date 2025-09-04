"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  User,
  Calendar,
  MoreHorizontal,
  Plus,
  Mail,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createDealCrmAPI,
  getAllDealCrmAPI,
  deleteDealCrmAPI,
  updateDealCrmAPI,
} from "@/services2/operations/dealCrm";

// Schema for deal form validation
const dealFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  company: z.string().min(2, { message: "Company name is required" }),
  value: z.coerce.number().min(1, { message: "Value must be greater than 0" }),
  stage: z.string(),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactEmail: z.string().email({ message: "Valid email is required" }),
  closeDate: z.string(),
  probability: z.coerce.number().min(1).max(100),
  notes: z.string().optional(),
});

// Schema for email form validation
const emailFormSchema = z.object({
  to: z.string().email({ message: "Valid email is required" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

const DealsBoard = () => {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const { toast } = useToast();

  const stages = [
    { id: "lead", name: "Lead", color: "bg-blue-500" },
    { id: "proposal", name: "Proposal", color: "bg-amber-500" },
    { id: "negotiation", name: "Negotiation", color: "bg-purple-500" },
    { id: "closed", name: "Closed Won", color: "bg-green-500" },
  ];

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage === stage.id);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTotalValue = (stageId) => {
    return dealsByStage[stageId].reduce((total, deal) => total + deal.value, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Deal form setup
  const dealForm = useForm({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      company: "",
      value: 0,
      stage: "lead",
      contactName: "",
      contactEmail: "",
      closeDate: new Date().toISOString().split("T")[0],
      probability: 20,
      notes: "",
    },
  });

  // Email form setup
  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: "",
      subject: "",
      message: "",
    },
  });

  // Handle deal form submission
  const onSubmitDeal = async (data) => {
    const newDeal = {
      id: (deals.length + 1).toString(),
      title: data.title,
      company: data.company,
      value: data.value,
      stage: data.stage,
      contactName: data.contactName,
      closeDate: data.closeDate,
      probability: data.probability,
      // Additional fields not shown in card
      contactEmail: data.contactEmail,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    };

    setDeals([...deals, newDeal]);

    const response = await createDealCrmAPI(data);
    console.log(response);

    dealForm.reset();

    toast({
      title: "Deal created",
      description: `${data.title} has been added to ${
        stages.find((s) => s.id === data.stage)?.name
      }`,
    });
  };

  const fetchDealCrm = async () => {
    const response = await getAllDealCrmAPI();
    // If the API returns _id, map it to id
    const modifiedResponse = response.map((item) => ({
      ...item,
      id: item.id || item._id, // Prefer existing id, fallback to _id
    }));
    setDeals(modifiedResponse);
  };

  useEffect(() => {
    fetchDealCrm();
  }, []);
  // Handle email form submission
  const onSubmitEmail = (data) => {
    console.log("Sending email:", data);

    // In a real application, this would make an API call to a backend service
    // For now, we'll just simulate success
    setTimeout(() => {
      emailForm.reset();
      toast({
        title: "Email sent",
        description: `Email was sent to ${data.to}`,
      });
    }, 1000);
  };

  const prepareEmailForDeal = (deal) => {
    setSelectedDeal(deal);
    emailForm.setValue("to", deal.contactEmail || "");
    emailForm.setValue("subject", `Regarding: ${deal.title}`);
    emailForm.setValue(
      "message",
      `Dear ${deal.contactName},\n\nI wanted to follow up regarding our ${deal.title} deal.\n\nBest regards,\n[Your Name]`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Deals Pipeline</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create New Deal</SheetTitle>
              <SheetDescription>
                Add a new deal to your pipeline. Fill out the details and click
                save when you're done.
              </SheetDescription>
            </SheetHeader>

            <Form {...dealForm}>
              <form
                onSubmit={dealForm.handleSubmit(onSubmitDeal)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={dealForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enterprise software license"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dealForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={dealForm.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Value ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={dealForm.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stages.map((stage) => (
                              <SelectItem key={stage.id} value={stage.id}>
                                {stage.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={dealForm.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dealForm.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={dealForm.control}
                    name="closeDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Close Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={dealForm.control}
                    name="probability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probability (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={dealForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional details about this deal..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button type="submit">Save Deal</Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${stage.color} mr-2`}
                ></div>
                <h3 className="font-medium">{stage.name}</h3>
              </div>
              <Badge variant="outline">
                {dealsByStage[stage.id].length}{" "}
                {dealsByStage[stage.id].length === 1 ? "deal" : "deals"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              Total: {formatCurrency(getTotalValue(stage.id))}
            </div>

            <div className="space-y-3 min-h-[200px]">
              {dealsByStage[stage.id].map((deal) => (
                <Card key={deal.id} className="shadow-sm">
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">
                        {deal.title}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Sheet>
                            <SheetTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  // Set the selected deal for editing
                                  const dealToEdit = { ...deal }; // Create a copy to ensure we have all properties
                                  console.log(
                                    "Setting selected deal for edit:",
                                    dealToEdit
                                  );
                                  setSelectedDeal(dealToEdit);
                                  // Set form values from the selected deal
                                  dealForm.reset({
                                    title: deal.title,
                                    company: deal.company,
                                    value: deal.value,
                                    stage: deal.stage,
                                    contactName: deal.contactName,
                                    contactEmail: deal.contactEmail,
                                    closeDate: new Date(deal.closeDate)
                                      .toISOString()
                                      .split("T")[0],
                                    probability: deal.probability,
                                    notes: deal.notes || "",
                                  });
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle>Edit Deal</SheetTitle>
                                <SheetDescription>
                                  Update the details of this deal and click save
                                  when you're done.
                                </SheetDescription>
                              </SheetHeader>

                              <Form {...dealForm}>
                                <form
                                  onSubmit={dealForm.handleSubmit(
                                    async (data) => {
                                      if (!selectedDeal) return;

                                      try {
                                        console.log(
                                          "Selected deal for update:",
                                          selectedDeal
                                        );
                                        const formData = {
                                          ...data,
                                        };

                                        const response = await updateDealCrmAPI(
                                          selectedDeal._id,
                                          formData
                                        );

                                        if (response?.success) {
                                          fetchDealCrm();
                                        }
                                        toast({
                                          title: "Deal updated",
                                          description: `${data.title} has been updated successfully`,
                                        });

                                        // Reset form and selection
                                        dealForm.reset();
                                        setSelectedDeal(null);
                                      } catch (error) {
                                        console.error(
                                          "Error updating deal:",
                                          error
                                        );
                                        toast({
                                          title: "Update failed",
                                          description:
                                            "There was an error updating the deal",
                                          variant: "destructive",
                                        });
                                      }
                                    }
                                  )}
                                  className="space-y-4 py-4"
                                >
                                  <FormField
                                    control={dealForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Deal Title</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Enterprise software license"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={dealForm.control}
                                    name="company"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Acme Corp"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={dealForm.control}
                                      name="value"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Deal Value ($)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              placeholder="10000"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={dealForm.control}
                                      name="stage"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Stage</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a stage" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {stages.map((stage) => (
                                                <SelectItem
                                                  key={stage.id}
                                                  value={stage.id}
                                                >
                                                  {stage.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={dealForm.control}
                                    name="contactName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Contact Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="John Smith"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={dealForm.control}
                                    name="contactEmail"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={dealForm.control}
                                      name="closeDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Expected Close Date
                                          </FormLabel>
                                          <FormControl>
                                            <Input type="date" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={dealForm.control}
                                      name="probability"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Probability (%)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min="1"
                                              max="100"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={dealForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Additional details about this deal..."
                                            className="resize-none"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <SheetFooter>
                                    <SheetClose asChild>
                                      <Button type="button" variant="outline">
                                        Cancel
                                      </Button>
                                    </SheetClose>
                                    <Button type="submit">Update Deal</Button>
                                  </SheetFooter>
                                </form>
                              </Form>
                            </SheetContent>
                          </Sheet>
                          {/* <DropdownMenuItem>
                            Move to next stage
                          </DropdownMenuItem> */}
                          <Sheet>
                            <SheetTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  prepareEmailForDeal(deal);
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md">
                              <SheetHeader>
                                <SheetTitle>Send Email</SheetTitle>
                                <SheetDescription>
                                  Send an email related to {selectedDeal?.title}
                                </SheetDescription>
                              </SheetHeader>

                              <Form {...emailForm}>
                                <form
                                  onSubmit={emailForm.handleSubmit(
                                    onSubmitEmail
                                  )}
                                  className="space-y-4 py-4"
                                >
                                  <FormField
                                    control={emailForm.control}
                                    name="to"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>To</FormLabel>
                                        <FormControl>
                                          <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={emailForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={emailForm.control}
                                    name="message"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                          <Textarea rows={8} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <SheetFooter>
                                    <SheetClose asChild>
                                      <Button type="button" variant="outline">
                                        Cancel
                                      </Button>
                                    </SheetClose>
                                    <Button type="submit">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Email
                                    </Button>
                                  </SheetFooter>
                                </form>
                              </Form>
                            </SheetContent>
                          </Sheet>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={async (e) => {
                              e.preventDefault();
                              try {
                                await deleteDealCrmAPI(deal.id); // Use id consistently
                                setDeals(deals.filter((d) => d.id !== deal.id));
                                toast({
                                  title: "Deal deleted",
                                  description: `${deal.title} has been deleted`,
                                });
                              } catch (error) {
                                console.error("Error deleting deal:", error);
                                toast({
                                  title: "Delete failed",
                                  description:
                                    "There was an error deleting the deal",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(deal.value)}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>{deal.company}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{deal.contactName}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Close: {formatDate(deal.closeDate)}</span>
                    </div>
                    <Badge className="mt-2" variant="secondary">
                      {deal.probability}% probability
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Deals Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            This Week's Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Deal
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Company
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Value
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Stage
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Close Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals
                  .filter((deal) => {
                    // Filter deals closing this week
                    const closeDate = new Date(deal.closeDate);
                    const today = new Date();
                    const endOfWeek = new Date();
                    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                    return closeDate <= endOfWeek && closeDate >= today;
                  })
                  .map((deal) => (
                    <tr key={deal.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{deal.title}</td>
                      <td className="px-4 py-3">{deal.company}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            deal.stage === "lead"
                              ? "bg-blue-100"
                              : deal.stage === "proposal"
                              ? "bg-amber-100"
                              : deal.stage === "negotiation"
                              ? "bg-purple-100"
                              : "bg-green-100"
                          }
                        >
                          {stages.find((s) => s.id === deal.stage)?.name}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(deal.closeDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => prepareEmailForDeal(deal)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-md">
                            <SheetHeader>
                              <SheetTitle>Send Email</SheetTitle>
                              <SheetDescription>
                                Send an email related to {selectedDeal?.title}
                              </SheetDescription>
                            </SheetHeader>

                            <Form {...emailForm}>
                              <form
                                onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                                className="space-y-4 py-4"
                              >
                                <FormField
                                  control={emailForm.control}
                                  name="to"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>To</FormLabel>
                                      <FormControl>
                                        <Input type="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={emailForm.control}
                                  name="subject"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Subject</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={emailForm.control}
                                  name="message"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Message</FormLabel>
                                      <FormControl>
                                        <Textarea rows={8} {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button type="button" variant="outline">
                                      Cancel
                                    </Button>
                                  </SheetClose>
                                  <Button type="submit">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </Button>
                                </SheetFooter>
                              </form>
                            </Form>
                          </SheetContent>
                        </Sheet>
                      </td>
                    </tr>
                  ))}
                {deals.filter((deal) => {
                  const closeDate = new Date(deal.closeDate);
                  const today = new Date();
                  const endOfWeek = new Date();
                  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                  return closeDate <= endOfWeek && closeDate >= today;
                }).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-muted-foreground"
                    >
                      No deals closing this week
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealsBoard;
