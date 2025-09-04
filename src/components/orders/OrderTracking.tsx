import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const { toast } = useToast();

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive",
      });
      return;
    }

    setIsTracking(true);

    // Simulate API call to get tracking info
    setTimeout(() => {
      setIsTracking(false);
      setTrackingResult({
        orderId: +trackingNumber,
        status: "in_transit",
        estimatedDelivery: "2023-06-15",
        currentLocation: "Memphis Distribution Center",
        recipient: "Jane Smith",
        address: "123 Main St, Springfield, IL",
        carrier: "FastShip Express",
        events: [
          {
            date: "2023-06-10",
            time: "08:15 AM",
            location: "Warehouse",
            status: "Order processed",
            completed: true,
          },
          {
            date: "2023-06-11",
            time: "09:30 AM",
            location: "Sorting Center",
            status: "Shipment packed",
            completed: true,
          },
          {
            date: "2023-06-12",
            time: "02:45 PM",
            location: "Distribution Center",
            status: "In transit",
            completed: true,
          },
          {
            date: "2023-06-14",
            time: "10:00 AM",
            location: "Local Courier",
            status: "Out for delivery",
            completed: false,
          },
          {
            date: "2023-06-15",
            time: "12:00 PM",
            location: "Destination",
            status: "Delivered",
            completed: false,
          },
        ],
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
          <CardDescription>
            Track shipments and view delivery status in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Enter tracking number or order ID"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTrack}
              disabled={isTracking}
              className="px-4"
            >
              {isTracking ? (
                "Tracking..."
              ) : (
                <>
                  <Search size={16} className="mr-2" />
                  Track Order
                </>
              )}
            </Button>
          </div>

          {trackingResult && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-muted-foreground text-sm">Order ID</div>
                  <div className="font-medium">{trackingResult.orderId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Status</div>
                  <div className="flex items-center gap-1 text-amber-600 font-medium">
                    <Truck size={14} />
                    <span>In Transit</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">
                    Estimated Delivery
                  </div>
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>June 15, 2023</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Carrier</div>
                  <div className="font-medium">{trackingResult.carrier}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Current Location
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span>{trackingResult.currentLocation}</span>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Recipient
                        </div>
                        <div className="font-medium">
                          {trackingResult.recipient}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Shipping Address
                        </div>
                        <div className="font-medium">
                          {trackingResult.address}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Tracking History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline track */}
                      <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-border" />

                      <div className="space-y-4">
                        {trackingResult.events.map(
                          (event: any, index: number) => (
                            <div key={index} className="relative pl-6">
                              <div
                                className={`absolute left-0 top-0 h-3.5 w-3.5 rounded-full border-2 ${
                                  event.completed
                                    ? "bg-primary border-primary"
                                    : "bg-background border-muted-foreground"
                                }`}
                              />
                              <div className="text-sm font-medium">
                                {event.status}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} />
                                <span>
                                  {event.date} at {event.time}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {event.location}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!trackingResult && !isTracking && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <Package
                  size={48}
                  className="mx-auto mb-3 text-muted-foreground/60"
                />
                <p className="text-sm">
                  Enter a tracking number to view shipment details
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
