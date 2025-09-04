import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, X, Upload, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { imageUpload } from "@/services2/operations/image";
// Base TextField component
export const TextField = ({
  control,
  name,
  label,
  description = "",
  placeholder = "",
  type = "text",
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              {...props}
              value={field.value || ""}
              onChange={(e) => {
                const value =
                  type === "number"
                    ? e.target.value === ""
                      ? ""
                      : parseFloat(e.target.value)
                    : e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// TextArea Field
export const TextAreaField = ({
  control,
  name,
  label,
  description = "",
  placeholder = "",
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              {...props}
              value={field.value || ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Select Field
export const SelectField = ({
  control,
  name,
  label,
  description = "",
  options = [],
  includeCustomOption = false,
  onSelectCustom = () => {},
  defaultValue = "",
  isUnit,
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue || field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => {
                // Ensure we never pass an empty string as value
                const safeValue = isUnit
                  ? option
                  : option?._id || "empty-placeholder";
                return (
                  <SelectItem key={safeValue} value={safeValue}>
                    {isUnit ? option : option?.categoryName || "None"}
                  </SelectItem>
                );
              })}
              {/* {includeCustomOption && (
                <SelectItem value="custom" onClick={onSelectCustom}>
                  + Add Custom
                </SelectItem>
              )} */}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Custom Input Field (for custom categories)
export const CustomInput = ({ value, onChange, placeholder, onCancel }) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Image Upload Field
export const ImageUploadField = ({
  control,
  name,
  label,
  description = "",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <div
                className="
                w-24 h-24 rounded-md border-2 border-dashed border-muted-foreground/25 
                flex items-center justify-center overflow-hidden group relative
              "
              >
                {field.value ? (
                  <img
                    src={field.value}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                )}
                <div
                  className="
                  absolute inset-0 bg-black/50 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity
                "
                >
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const uploadedImages = await imageUpload([file]);
                      if (uploadedImages.length > 0) {
                        field.onChange(uploadedImages[0]); // Save Cloudinary URL
                      }
                    }
                  }}
                />
              </div>
              {field.value && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange("")}
                >
                  Remove
                </Button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Date Field
export const DateField = ({ control, name, label, description = "" }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col z-[9999]">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) =>
                  field.onChange(date ? date.toISOString() : "")
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Switch Field
export const SwitchField = ({ control, name, label, description = "" }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

// Color Field Component
export const ColorField = ({ control, name, label, description = "" }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input
                type="color"
                value={field.value || "#ffffff"}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="#RRGGBB"
                className="flex-1"
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
