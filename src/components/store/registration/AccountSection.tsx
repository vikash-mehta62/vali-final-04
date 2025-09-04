import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { StoreRegistrationValues } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface AccountSectionProps {
  form: UseFormReturn<StoreRegistrationValues>;
  isEdit: boolean;
}

const AccountSection: React.FC<AccountSectionProps> = ({ form, isEdit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  useEffect(() => {
    if (user?.role === "admin") {
      form.setValue("password", "12345678");
      form.setValue("confirmPassword", "12345678");
    }
  }, [user?.role, form]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">
        Account Credentials
      </h2>

      {!isEdit && (
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      className="rounded-l-none pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>Must be at least 8 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="rounded-l-none pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="agreeTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I agree to the Terms of Service and Privacy Policy
              </FormLabel>
              <FormDescription>
                By creating an account, you agree to our terms and conditions.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccountSection;
