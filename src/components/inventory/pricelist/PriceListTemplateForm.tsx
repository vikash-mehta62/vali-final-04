"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type {
  PriceListTemplate,
  PriceListProduct,
  PriceListTemplateFormProps,
} from "@/components/inventory/forms/formTypes";
import { formatCurrency } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Edit, PlusCircle, MinusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllProductAPI } from "@/services2/operations/product";

const formSchema = z.object({
  name: z.string().min(2, "Template name is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
});

type FormValues = z.infer<typeof formSchema>;

const PriceListTemplateForm: React.FC<PriceListTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  // Main product states
  const [selectedProducts, setSelectedProducts] = useState<PriceListProduct[]>(
    template?.products || []
  );

  const [availableProducts, setAvailableProducts] = useState([]);

  // Selection states for checkboxes
  const [selectedAvailableItems, setSelectedAvailableItems] = useState<
    string[]
  >([]);
  const [selectedSelectedItems, setSelectedSelectedItems] = useState<string[]>(
    []
  );

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Price editing states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPriceField, setEditingPriceField] = useState(null);
  const [editPriceValue, setEditPriceValue] = useState("");

  // Start editing any price
  const startEditingPrice = (productId, field, value) => {
    setEditingProductId(productId);
    setEditingPriceField(field);
    setEditPriceValue(value ?? ""); // agar undefined hai to empty
  };

  // Save edited price
  const savePrice = () => {
    if (editingProductId && editingPriceField) {
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                [editingPriceField]: Number.parseFloat(editPriceValue) || 0,
              }
            : product
        )
      );
    }
    setEditingProductId(null);
    setEditingPriceField(null);
    setEditPriceValue("");
  };

  // Handle price input change
  const handlePriceChange = (e) => {
    setEditPriceValue(e.target.value);
  };

  // Handle keyboard events for price editing
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      savePrice();
    } else if (e.key === "Escape") {
      setEditingProductId(null);
      setEditingPriceField(null);
    }
  };

  // Render price input or text
  const renderEditablePrice = (productId, price, field) => {
    if (editingProductId === productId && editingPriceField === field) {
      return (
        <Input
          type="number"
          value={editPriceValue}
          onChange={handlePriceChange}
          onKeyDown={handleKeyDown}
          onBlur={savePrice}
          autoFocus
          step="0.01"
          min="0"
          className="w-24 text-right"
        />
      );
    }
    return (
      <div className="flex items-center justify-end gap-2">
        {formatCurrency(price)}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => startEditingPrice(productId, field, price)}
          type="button"
          className="h-7 w-7"
        >
          <Edit className="h-3.5 w-3.5 text-blue-500" />
        </Button>
      </div>
    );
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await getAllProductAPI();
      if (response) {
        const updatedProducts = response.map((product) => ({
          ...product,
          id: product._id,
          lastUpdated: product?.updatedAt,
        }));

        // Filter out products that are already in selectedProducts
        const filteredAvailableProducts = updatedProducts.filter(
          (product) => !selectedProducts.some((p) => p.id === product.id)
        );

        // Sort alphabetically by name
        filteredAvailableProducts.sort((a, b) => a.name.localeCompare(b.name));

        setAvailableProducts(filteredAvailableProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update available products when selected products change
  useEffect(() => {
    // Filter out selected products from available products
    setAvailableProducts((prev) => {
      const filtered = prev.filter(
        (product) => !selectedProducts.some((p) => p.id === product.id)
      );
      // Sort alphabetically
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    });
  }, [selectedProducts]);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      status: template?.status || "draft",
    },
  });

  // Form submission handler
  const handleSubmit = (values: FormValues) => {
    if (selectedProducts.length === 0) {
      form.setError("root", {
        type: "manual",
        message: "You must select at least one product for the price list",
      });
      return;
    }

    const newTemplate: PriceListTemplate = {
      id: template?.id || "temp-id",
      name: values.name,
      description: values.description,
      status: values.status,
      createdAt: template?.createdAt || new Date().toISOString(),
      products: selectedProducts,
    };

    onSave(newTemplate);
  };

  // Toggle selection in available products list
  const toggleAvailableSelection = (productId) => {
    setSelectedAvailableItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Toggle selection in selected products list
  const toggleSelectedSelection = (productId) => {
    setSelectedSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Add selected products from available list
  const handleAddSelected = () => {
    if (selectedAvailableItems.length === 0) return;

    // Get products to add
    const productsToAdd = availableProducts
      .filter((product) => selectedAvailableItems.includes(product.id))
      .map((product) => ({
        ...product,
        quantity: 0,
      }));

    // Add to selected products and sort alphabetically
    setSelectedProducts((prev) => {
      const updated = [...prev, ...productsToAdd];
      return updated.sort((a, b) =>
        (a.productName || a.name).localeCompare(b.productName || b.name)
      );
    });

    // Remove from available products
    setAvailableProducts((prev) => {
      const filtered = prev.filter(
        (product) => !selectedAvailableItems.includes(product.id)
      );
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Clear selection
    setSelectedAvailableItems([]);
  };

  const handleChnagePrice = (product) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              aPrice: product.pricePerBox,
              bPrice: product.pricePerBox,
              cPrice: product.pricePerBox,
              restaurantPrice: product.pricePerBox,
            }
          : p
      )
    );
  };

  // Remove selected products from selected list
  const handleRemoveSelected = () => {
    if (selectedSelectedItems.length === 0) return;

    // Get products to remove
    const productsToRemove = selectedProducts.filter((product) =>
      selectedSelectedItems.includes(product.id)
    );

    // Add back to available products and sort alphabetically
    setAvailableProducts((prev) => {
      const updated = [...prev, ...productsToRemove];
      return updated.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Remove from selected products and sort alphabetically
    setSelectedProducts((prev) => {
      const filtered = prev.filter(
        (product) => !selectedSelectedItems.includes(product.id)
      );
      return filtered.sort((a, b) =>
        (a.productName || a.name).localeCompare(b.productName || b.name)
      );
    });

    // Clear selection
    setSelectedSelectedItems([]);
  };

  // Select all filtered available products
  const handleSelectAllAvailable = () => {
    const filteredProducts = availableProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setSelectedAvailableItems(filteredProducts.map((product) => product.id));
  };

  // Select all selected products
  const handleSelectAllSelected = () => {
    setSelectedSelectedItems(selectedProducts.map((product) => product.id));
  };

  // Clear all selections
  const clearAvailableSelections = () => {
    setSelectedAvailableItems([]);
  };

  const clearSelectedSelections = () => {
    setSelectedSelectedItems([]);
  };

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const quantity = Number.parseInt(value, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, quantity } : product
        )
      );
    }
  };

  // Get unique categories for filtering
  const categories = [
    "All",
    ...Array.from(new Set(availableProducts.map((p) => p.category))),
  ];

  // Filter available products based on search and category
  const filteredProducts = availableProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (template?.products) {
      const sorted = [...template.products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSelectedProducts(sorted);
    }
  }, [template?.products]);

  // Sort filtered products when search or category changes
  useEffect(() => {
    // The filteredProducts variable is derived in the component,
    // so we need to ensure the source (availableProducts) is sorted
    setAvailableProducts((prev) =>
      [...prev].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [searchTerm, selectedCategory]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a name for this price list"
                    {...field}
                  />
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter an optional description for this price list"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Selected Products ({selectedProducts.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleSelectAllSelected}
                disabled={selectedProducts.length === 0}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelectedSelections}
                disabled={selectedSelectedItems.length === 0}
              >
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={selectedSelectedItems.length === 0}
              >
                <MinusCircle className="h-4 w-4 mr-2" />
                Remove Selected
              </Button>
            </div>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-md border">
              <p className="text-muted-foreground">No products selected</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead>Product</TableHead>
                    {/* <TableHead>Name</TableHead> */}
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">A Price</TableHead>
                    <TableHead className="text-right">B Price</TableHead>
                    <TableHead className="text-right">C Price</TableHead>
                    <TableHead className="text-right">
                      Restaurant Price
                    </TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={
                        selectedSelectedItems.includes(product.id)
                          ? "bg-muted/50"
                          : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedSelectedItems.includes(product.id)}
                          onCheckedChange={() =>
                            toggleSelectedSelection(product.id)
                          }
                          aria-label={`Select ${product.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {/* <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-md bg-muted">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar> */}
                          <span className="text-[12px]">
                            {product.productName || product.name}
                          </span>
                        </div>
                      </TableCell>
                      {/* <TableCell>{product.name}</TableCell> */}
                      <TableCell className="text-right text-sm">
                        {renderEditablePrice(
                          product.id,
                          product.pricePerBox,
                          "pricePerBox"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderEditablePrice(
                          product.id,
                          product.aPrice || 0,
                          "aPrice"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderEditablePrice(
                          product.id,
                          product.bPrice || 0,
                          "bPrice"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderEditablePrice(
                          product.id,
                          product.cPrice || 0,
                          "cPrice"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderEditablePrice(
                          product.id,
                          product.restaurantPrice || 0,
                          "restaurantPrice"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          type="button"
                          className="text-[12px] cursor-pointer"
                          onClick={() => handleChnagePrice(product)}
                        >
                          {" "}
                          Copy All
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Available Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Available Products ({availableProducts.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleSelectAllAvailable}
                disabled={filteredProducts.length === 0}
              >
                Select All Filtered
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAvailableSelections}
                disabled={selectedAvailableItems.length === 0}
              >
                Clear Selection
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddSelected}
                disabled={selectedAvailableItems.length === 0}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Selected
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3"
            />

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableProducts.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-md border">
              <p className="text-muted-foreground">
                No additional products available
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <span className="sr-only">Select</span>
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className={
                          selectedAvailableItems.includes(product.id)
                            ? "bg-muted/50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedAvailableItems.includes(
                              product.id
                            )}
                            onCheckedChange={() =>
                              toggleAvailableSelection(product.id)
                            }
                            aria-label={`Select ${product.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-md">
                              <AvatarImage
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-md bg-muted">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.category || "Uncategorized"}
                        </TableCell>
                        <TableCell>{product.unit || "-"}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.pricePerBox || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {template ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PriceListTemplateForm;
