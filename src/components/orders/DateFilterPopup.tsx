import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust path if different
import { Button } from "@/components/ui/button"; // shadcn button
import { useState } from "react";

export default function DateFilterDialog({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleResetDates,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  handleResetDates: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Date Filter</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter by Date</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              handleResetDates();
              setOpen(false);
            }}
          >
            Reset
          </Button>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
