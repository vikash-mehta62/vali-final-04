import React from "react";
import { StepType } from "./types";
import { Store, Building2, KeyRound, Check } from "lucide-react";

interface RegistrationProgressProps {
  currentStep: StepType;
  steps: StepType[];
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  currentStep,
  steps,
}) => {
  const getStepIcon = (step: StepType) => {
    switch (step) {
      case "business":
        return <Store className="h-5 w-5" />;
      case "address":
        return <Building2 className="h-5 w-5" />;
      case "account":
        return <KeyRound className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  const getStepName = (step: StepType) => {
    switch (step) {
      case "business":
        return "Business Info";
      case "address":
        return "Address";
      case "account":
        return "Account";
      default:
        return "";
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isPast = steps.indexOf(currentStep) > steps.indexOf(step);

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      isPast
                        ? "bg-green-100 text-green-600 border border-green-600"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  {isPast ? <Check className="h-5 w-5" /> : getStepIcon(step)}
                </div>
                <span
                  className={`
                    text-xs mt-2 font-medium
                    ${
                      isActive
                        ? "text-primary"
                        : isPast
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  `}
                >
                  {getStepName(step)}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-grow h-1 mx-2
                    ${
                      steps.indexOf(currentStep) > index
                        ? "bg-primary"
                        : "bg-gray-200"
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationProgress;
