"use client"

import { useEffect, useState } from "react"
import { Check, DollarSign, CreditCard, FileText, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { updateOrderPaymentAPI } from "@/services2/operations/order"
import { updatePurchaseOrderPaymentAPI } from "@/services2/operations/purchaseOrder"
import type { Order } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PaymentStatusPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fetchOrders: () => void
  onPayment: (id: string, paymentMethod: any) => void
  paymentOrder: Order
  orderId: string
  id: string
  purchase?: boolean

  totalAmount: number
}

interface PaymentData {
  orderId: string
  id: string
  method: "cash" | "creditcard" | "cheque"
  transactionId?: string
  notes?: string
  paymentType: "full" | "partial" |'paid'
  amountPaid: number
}

export function PaymentStatusPopup({
  open,
  onOpenChange,
  orderId,
  purchase=false,
  totalAmount,
  id,
  fetchOrders,
  onPayment,
  paymentOrder,
}: PaymentStatusPopupProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "creditcard" | "cheque">("cash")
  const [paymentType, setPaymentType] = useState<"full" | "partial" | 'paid'>("full")
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")
  const [amountPaid, setAmountPaid] = useState<number>(totalAmount)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token ?? null)


  console.log(paymentOrder)
  useEffect(() => {
    // Reset form when dialog opens or paymentOrder changes
    setPaymentMethod("cash")
    setPaymentType("full")
    setTransactionId("")
    setNotes("")
    setAmountPaid(totalAmount)

    if (paymentOrder?.paymentStatus === "paid" || paymentOrder?.paymentStatus === "partial" ) {
      setPaymentMethod(paymentOrder.paymentDetails.method as any)
      setTransactionId(paymentOrder?.paymentDetails?.transactionId || "")
      setNotes(paymentOrder?.paymentDetails?.notes || "")
 setPaymentType(paymentOrder?.paymentStatus === "paid" ? "full" : paymentOrder?.paymentStatus || "full")

      // Ensure amount paid doesn't exceed total amount
      const savedAmount = paymentOrder?.paymentDetails?.amountPaid || totalAmount
      setAmountPaid(Number(paymentOrder?.paymentAmount))
    }
  }, [paymentOrder, open, totalAmount])

  // Update amount paid when payment type changes
  useEffect(() => {
    if (paymentType === "paid" ) {
      setAmountPaid(totalAmount)
    } else if (amountPaid > totalAmount) {
      // Ensure amount doesn't exceed total when switching to partial
      setAmountPaid(totalAmount)
    }
  }, [paymentType, totalAmount])

  const handleSubmit = async () => {
    try {
      // setIsSubmitting(true)

      // Validate form based on payment method
      if (paymentMethod === "cash" && !notes.trim()) {
        toast({
          title: "Notes required",
          description: "Please provide notes for cash payment",
          variant: "destructive",
        })
        return
      }

      if (paymentMethod === "creditcard" && !transactionId.trim()) {
        toast({
          title: "Transaction ID required",
          description: "Please provide transaction ID for credit card payment",
          variant: "destructive",
        })
        return
      }

      // Validate payment amount
      if (!amountPaid || amountPaid <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid payment amount greater than 0",
          variant: "destructive",
        })
        return
      }

      if (amountPaid > totalAmount) {
        toast({
          title: "Invalid payment amount",
          description: "Payment amount cannot exceed the total amount",
          variant: "destructive",
        })
        return
      }

      // For partial payments, ensure amount is less than total
      if (paymentType === "partial" && amountPaid >= totalAmount) {
        toast({
          title: "Invalid partial payment",
          description: "For partial payment, amount should be less than the total amount",
          variant: "destructive",
        })
        return
      }

      const paymentData: PaymentData = {
        orderId,
        id,
        method: paymentMethod,
        paymentType: paymentType,
        amountPaid: paymentType === "full" ? totalAmount : amountPaid,
        ...(paymentMethod === "creditcard" && { transactionId }),
        ...(paymentMethod === "cash" && { notes }),
        ...(paymentMethod === "cheque" && { notes }),
      }

      console.log(paymentData)
if(purchase){

  await updatePurchaseOrderPaymentAPI(paymentData, token, id)
}else{

  await updateOrderPaymentAPI(paymentData, token, id)
}

      toast({
        title: "Payment status updated",
        description: `Order #${orderId} payment has been updated successfully.`,
      })

      // Reset form
      onPayment(id, paymentData)

      setTransactionId("")
      setNotes("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAmountChange = (value: string) => {
    const amount = Number.parseFloat(value)
    if (isNaN(amount)) {
      setAmountPaid(0)
      return
    }

    // Ensure amount doesn't exceed total
    setAmountPaid(Math.min(amount, totalAmount))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Update Payment Status
          </DialogTitle>
          <DialogDescription>Update payment details for order #{orderId}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Order Summary Card */}
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Order Summary</h3>
                <Badge variant={paymentOrder?.paymentStatus === "paid" ? "success" : "outline"}>
                  {paymentOrder?.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Order ID:</div>
                <div className="font-medium">{orderId}</div>
                <div className="text-muted-foreground">Total Amount:</div>
                <div className="font-medium text-green-600">${totalAmount.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Type Selection */}
       { !purchase &&   <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Type</Label>
            <RadioGroup
              value={paymentType}
              onValueChange={(value) => setPaymentType(value as "full" | "partial")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full">Full Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial">Partial Payment</Label>
              </div>
            </RadioGroup>
          </div>}

          {/* Payment Amount */}
       {!purchase &&    <div className="space-y-2">
            <Label htmlFor="amount-paid" className="text-sm font-medium">
              Amount Paid
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount-paid"
                type="number"
                value={amountPaid}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-8"
                placeholder="Enter amount"
                max={totalAmount}
                min={0}
                step="0.01"
                disabled={paymentType === "full"}
              />
            </div>
            {paymentType === "partial" && (
              <p className="text-xs text-muted-foreground">Amount must be less than ${totalAmount.toFixed(2)}</p>
            )}
          </div>}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {/* Cash Option */}
              <div
                className={cn(
                  "flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors",
                  paymentMethod === "cash" ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50",
                )}
                onClick={() => setPaymentMethod("cash")}
              >
                <DollarSign className={cn("h-5 w-5 mb-1", paymentMethod === "cash" ? "text-primary" : "")} />
                <span className="text-sm">Cash</span>
              </div>

              {/* Credit Card Option */}
              <div
                className={cn(
                  "flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors",
                  paymentMethod === "creditcard" ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50",
                )}
                onClick={() => setPaymentMethod("creditcard")}
              >
                <CreditCard className={cn("h-5 w-5 mb-1", paymentMethod === "creditcard" ? "text-primary" : "")} />
                <span className="text-sm">Credit Card</span>
              </div>

              {/* Cheque Option */}
              <div
                className={cn(
                  "flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors",
                  paymentMethod === "cheque" ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50",
                )}
                onClick={() => setPaymentMethod("cheque")}
              >
                <FileText className={cn("h-5 w-5 mb-1", paymentMethod === "cheque" ? "text-primary" : "")} />
                <span className="text-sm">Cheque</span>
              </div>
            </div>
          </div>

          {/* Transaction ID for Credit Card */}
          {paymentMethod === "creditcard" && (
            <div className="space-y-2">
              <Label htmlFor="transaction-id" className="text-sm font-medium">
                Transaction ID
              </Label>
              <Input
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {/* Notes for Cash or Cheque */}
          {(paymentMethod === "cash" || paymentMethod === "cheque") && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Enter ${paymentMethod} payment details`}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            <Check className="h-4 w-4" />
            {isSubmitting ? "Updating..." : "Update Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
