import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { signUp } from "@/services2/operations/auth";
import {
  storeRegistrationSchema,
  StoreRegistrationValues,
  StepType,
} from "@/components/store/registration/types";
import RegistrationProgress from "@/components/store/registration/RegistrationProgress";
import BusinessInfoSection from "@/components/store/registration/BusinessInfoSection";
import AddressSection from "@/components/store/registration/AddressSection";
import AccountSection from "@/components/store/registration/AccountSection";
import { useDispatch } from "react-redux";

const StoreRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StoreRegistrationValues>({
    resolver: zodResolver(storeRegistrationSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      businessDescription: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      role: "store",
    },
    mode: "onChange",
  });

  const steps: StepType[] = ["business", "address", "account"];
  const {
    step,
    steps: formSteps,
    next,
    back,
    isFirstStep,
    isLastStep,
  } = useMultiStepForm<StepType>(steps);

  const validateCurrentStep = async () => {
    let isValid = false;

    switch (step) {
      case "business":
        isValid = await form.trigger([
          "storeName",
          "ownerName",
          "email",
          "phone",
          "businessDescription",
        ]);
        break;
      case "address":
        isValid = await form.trigger(["address", "city", "state", "zipCode"]);
        break;
      case "account":
        isValid = await form.trigger([
          "password",
          "confirmPassword",
          "agreeTerms",
        ]);
        break;
      default:
        isValid = false;
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    console.log("first");
    if (isValid) {
      next();
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: StoreRegistrationValues) => {
    console.log("yes ");
    if (!isLastStep) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(values, navigate, dispatch);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "business":
        return <BusinessInfoSection form={form} />;
      case "address":
        return <AddressSection form={form} />;
      case "account":
        return <AccountSection form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-center mb-6">
          <Store className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Create Your Store Account
          </h1>
        </div>

        <RegistrationProgress currentStep={step} steps={formSteps} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/auth" className="text-primary font-medium">
                  Log in
                </a>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={back}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}

                {!isLastStep ? (
                  <Button
                    type="button"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleNext} // <-- Directly calling handleNext
                    disabled={isSubmitting}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Create Store Account
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StoreRegistration;