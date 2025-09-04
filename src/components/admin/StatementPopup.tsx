"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatement } from "@/services2/operations/order"
import { generateStatementPDF } from "@/utils/pdf/generate-statement-pdf"
import { format, subMonths } from "date-fns"

interface StatementFilterPopupProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  token: string
}

export const StatementFilterPopup = ({ isOpen, onClose, userId, token }: StatementFilterPopupProps) => {
  const [paymentStatus, setPaymentStatus] = useState("all")
  const [monthOptions, setMonthOptions] = useState<string[]>([])

  const [monthRangeType, setMonthRangeType] = useState<"all" | "range">("all")
  const [startMonth, setStartMonth] = useState("")
  const [endMonth, setEndMonth] = useState("")

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Generate last 24 months list
  useEffect(() => {
    const months: string[] = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      const date = subMonths(now, i)
      months.push(format(date, "yyyy-MM"))
    }
    setMonthOptions(months)
    setStartMonth(format(now, "yyyy-MM"))
    setEndMonth(format(now, "yyyy-MM"))
  }, [])

const handleDownload = async (sendMail: boolean = false) => {
  try {
    setIsGeneratingPDF(true)

    let url = `${userId}?paymentStatus=${paymentStatus}`

    if (monthRangeType === "range") {
      if (startMonth) url += `&startMonth=${startMonth}`
      if (endMonth) url += `&endMonth=${endMonth}`
    }

    if (sendMail) {
      url += `&send=1`
    } else {
      url += `&send=0`
    }

    const response = await getStatement(url, token)
    console.log(response)
    if (response) {
      await generateStatementPDF(response)
      onClose()
    }
  } catch (error) {
    console.error("Error downloading statement:", error)
  } finally {
    setIsGeneratingPDF(false)
  }
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Download Statement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Payment Status */}
          <div className="grid gap-2">
            <Label htmlFor="payment-status">Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger id="payment-status">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Month Range Type */}
          <div className="grid gap-2">
            <Label htmlFor="month-type">Month Range</Label>
            <Select value={monthRangeType} onValueChange={(val) => setMonthRangeType(val as "all" | "range")}>
              <SelectTrigger id="month-type">
                <SelectValue placeholder="Select month filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="range">Select Month Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Month */}
          <div className="grid gap-2">
            <Label htmlFor="start-month">Start Month</Label>
            <Select
              value={startMonth}
              onValueChange={setStartMonth}
              disabled={monthRangeType === "all"}
            >
              <SelectTrigger id="start-month">
                <SelectValue placeholder="Start month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(month), "MMMM yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* End Month */}
          <div className="grid gap-2">
            <Label htmlFor="end-month">End Month</Label>
            <Select
              value={endMonth}
              onValueChange={setEndMonth}
              disabled={monthRangeType === "all"}
            >
              <SelectTrigger id="end-month">
                <SelectValue placeholder="End month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(month), "MMMM yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>handleDownload(false)} disabled={isGeneratingPDF}>
            {isGeneratingPDF ? "Generating PDF..." : "Download"}
          </Button>
          <Button onClick={()=>handleDownload(true)} disabled={isGeneratingPDF}>
            {isGeneratingPDF ? "Generating PDF..." : "Send Mail & Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
