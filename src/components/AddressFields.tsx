import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const AddressForm = ({
  billingAddress,
  setBillingAddress,
  shippingAddress,
  setShippingAddress,
  sameAsBilling,
  setSameAsBilling,
}) => {
  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Billing Address</h4>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="billing-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="billing-name"
            required
            placeholder="Your name"
            value={billingAddress.name}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, name: e.target.value })
            }
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="billing-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="billing-email"
            type="email"
            placeholder="you@example.com"
            value={billingAddress.email}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, email: e.target.value })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="billing-email" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="billing-email"
            type="number"
            required

            placeholder="01234567890"
            value={billingAddress.phone}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, phone: e.target.value })
            }
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="billing-address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="billing-address"
            placeholder="Street address"
            required
            
            value={billingAddress.address}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, address: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <label htmlFor="billing-city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="billing-city"
              placeholder="City"
            required

              value={billingAddress.city}
              onChange={(e) =>
                setBillingAddress({ ...billingAddress, city: e.target.value })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="billing-postal" className="text-sm font-medium">
              Postal Code
            </label>
            <Input
              id="billing-postal"
              placeholder="Postal code"
            required

              value={billingAddress.postalCode}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  postalCode: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="billing-country" className="text-sm font-medium">
          State
          </label>
          <Input
            id="billing-country"
            required

            placeholder="State"
            value={billingAddress.country}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, country: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-2 py-1">
  <input
    type="checkbox"
    id="same-as-billing"
    checked={sameAsBilling}
    onChange={(e) => setSameAsBilling(e.target.checked)}
    className="w-3 h-3 p-0 m-0 align-middle accent-blue-600 cursor-pointer"
    style={{ minWidth: "16px" }}
  />
  <label htmlFor="same-as-billing" className="text-sm cursor-pointer text-gray-700 leading-none">
    Shipping address same as billing
  </label>
</div>







      {!sameAsBilling && (
        <>
          <div className="flex items-center justify-between mt-4">
            <h4 className="font-medium">Shipping Address</h4>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <label htmlFor="shipping-name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="shipping-name"
                placeholder="Your name"
                value={shippingAddress.name}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="shipping-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="shipping-email"
                type="email"
                placeholder="you@example.com"
                value={shippingAddress.email}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-1.5">
          <label htmlFor="billing-email" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="billing-email"
            type="email"
            placeholder="01234567890"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({ ...billingAddress, phone: e.target.value })
            }
          />
        </div>
            <div className="grid gap-1.5">
              <label htmlFor="shipping-address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="shipping-address"
                placeholder="Street address"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <label htmlFor="shipping-city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="shipping-city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="shipping-postal" className="text-sm font-medium">
                  Postal Code
                </label>
                <Input
                  id="shipping-postal"
                  placeholder="Postal code"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="shipping-country" className="text-sm font-medium">
                State
              </label>
              <Input
                id="shipping-country"
                placeholder="State"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddressForm;
