import React, { useState } from "react";
import {
  TextField,
  TextAreaField,
  SelectField,
  CustomInput,
  ImageUploadField,
  DateField,
  SwitchField,
} from "./FormFields";
import { Control } from "react-hook-form";
import { FormValues } from "./formTypes";

interface ProductDetailsProps {
  control: Control<FormValues>;
  categories: string[];
  units: string[];
  simplified?: boolean;
  isEditProduct?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  control,
  categories,
  units,
  simplified = false,
  isEditProduct ,
}) => {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
console.log(isEditProduct)
  return (
    <div className="space-y-4">
      <TextField
        control={control}
        name="name"
        label="Product Name"
        placeholder="Enter product name"
        description="Name of the product"
      />
    

      {!simplified && (
        <ImageUploadField
          control={control}
          name="image"
          label="Product Image"
          description="Upload product image"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="mb-2">
            <label className="text-sm font-medium leading-none">Category</label>
          </div>
          {!isCustomCategory ? (
            <SelectField
              control={control}
              name="category"
              label=""
              description="Product category"
              options={categories}
              includeCustomOption
              onSelectCustom={() => setIsCustomCategory(true)}
              defaultValue=""
              isUnit={false}
            />
          ) : (
            <CustomInput
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              onCancel={() => {
                setIsCustomCategory(false);
                setCustomCategory("");
              }}
            />
          )}
        </div>

        <SelectField
          control={control}
          name="unit"
          label="Unit"
          description="Unit of measurement"
          options={units}
        
          onSelectCustom={() => {}}
          isUnit={true}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <TextField
          control={control}
          name="quantity"
          label="Quantity"
          type="number"
          min="0"
          step="1"
          description="Available quantity"
          placeholder="0"
        /> */}
  {/* {isEditProduct &&      <TextField
          control={control}
          name="totalPurchase"
          label="Purchase "
          type="number"
          min="0"
          step="1"
          description="Total Purchase "
          placeholder="0"
        />} */}

        <TextField
          control={control}
          name="price"
          label="Unit Price ($)"
          type="number"
          min="0"
          step="0.01"
          description="Price per unit"
          placeholder="0.00"
        />
      </div>

      {/* Box Pricing Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
        <TextField
          control={control}
          name="boxSize"
          label="Box Size"
          type="number"
          min="0"
          step="1"
          description={`How many units (lb) in a box`}
          placeholder="0"
        />

        <TextField
          control={control}
          name="pricePerBox"
          label="Box Price ($)"
          type="number"
          min="0"
          step="0.01"
          description="Price per box"
          placeholder="0.00"
        />
      </div>
      <TextField
        control={control}
        name="shippinCost"
         type="number"
        label="Shipping Cost"
        placeholder="Shipping Cost"
        description="Shipping Cost"
      />
      <TextField
        control={control}
        name="threshold"
        label="Low Stock Threshold"
        type="number"
        min="0"
        step="1"
        description="You'll be alerted when stock falls below this level"
        placeholder="5"
      />

      {!simplified && (
        <>
          {/* Produce-Specific Information - Only shown in detailed view */}
          <div className="space-y-2 pt-2 border-t">
            <h3 className="text-sm font-medium">
              Produce-Specific Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                control={control}
                name="weightVariation"
                label="Weight Variation (%)"
                type="number"
                min="0"
                max="100"
                step="0.1"
                description="Natural variation in product weight"
                placeholder="0"
              />

              <DateField
                control={control}
                name="expiryDate"
                label="Expiry Date"
                description="When this product expires"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                control={control}
                name="origin"
                label="Origin"
                placeholder="e.g., California, Spain"
                description="Where the produce is from"
              />

              <TextField
                control={control}
                name="batchInfo"
                label="Batch Info"
                placeholder="e.g., LOT-2023-05-A"
                description="Batch or lot identifier"
              />
            </div>

            <SwitchField
              control={control}
              name="organic"
              label="Organic Product"
              description="Is this product certified organic?"
            />

            <TextAreaField
              control={control}
              name="storageInstructions"
              label="Storage Instructions"
              placeholder="e.g., Store in a cool, dry place"
              description="How this product should be stored"
            />
          </div>

          <TextAreaField
            control={control}
            name="description"
            label="Product Description (Optional)"
            placeholder="Enter product description..."
            description="Detailed description of the product"
          />
        </>
      )}
    </div>
  );
};

export default ProductDetails;
