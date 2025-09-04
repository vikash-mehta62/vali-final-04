"use client"

import { useEffect, useState } from "react"
import { BarChart, DollarSign, Hourglass, Package, ShoppingBag, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {getDashboardData,getPendingData} from "@/services2/operations/order"
import { CSVLink } from 'react-csv';
import { useToast } from "@/hooks/use-toast"
import { userWithOrderDetails } from "@/services2/operations/auth"
import UserDetailsModal from "./admin/user-details-modal"
import { LoaderCircle } from "lucide-react";



export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingData, setPendingData] = useState(null);
  const [pendingLoading, setPendingLoading] = useState(false);
  const { toast } = useToast()
const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [selectedUserData, setSelectedUserData] = useState(null)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
 

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        console.log(response)
        if (response?.success) {
          setDashboardData(response.data);
        } else {
          console.error('Error fetching dashboard data', response?.message);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Using mock data for demonstration

    setLoading(false)
  }, [])


    const handleFetchPendingData = async () => {
    setPendingLoading(true);
    try {
      const response = await getPendingData(); // your API call
      console.log(response)
      if (response?.success) {
        setPendingData(response.data);
      } else {
        alert("Failed to fetch pending orders");
      }
    } catch (error) {
      alert("Error fetching pending orders");
      console.error(error);
    } finally {
      setPendingLoading(false);
    }
  };


   const fetchUserDetailsOrder = async (id: any) => {
    try {
      const res = await userWithOrderDetails(id)
      console.log(res)
      setSelectedUserData(res)
      setUserDetailsOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      })
    }
  }

 const pendingHeaders = pendingData && pendingData.length > 0
    ? Object.keys(pendingData[0]).map((key) => ({ label: key, key: key }))
    : [];
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoaderCircle className="w-16 h-16 text-primary animate-spin mx-auto" />
        <p className="mt-4 text-lg font-medium">Loading dashboard data...</p>
      </div>
    </div>
  );
}

if (!dashboardData) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
              <LoaderCircle className="w-16 h-16 text-primary animate-spin mx-auto" />

      </div>
    </div>
  );
}

  // Calculate the percentage of received amount
  const receivedPercentage = Math.round((dashboardData.totalReceived / dashboardData.totalAmount) * 100)
   const summaryHeaders = [
    { label: "Total Orders", key: "totalOrders" },
    { label: "Total Stores", key: "totalStores" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Received Amount", key: "totalReceived" },
    { label: "Pending Amount", key: "totalPending" }
  ];

  const userHeaders = [
    { label: "Store Name", key: "storeName" },
    { label: "Owner Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Orders", key: "orderCount" },
    { label: "Total Amount", key: "totalAmount" },
  
  ];

  const summaryData = [{
    totalOrders: dashboardData.totalOrders,
    totalStores: dashboardData.totalStores,
    totalAmount: dashboardData.totalAmount,
    totalReceived: dashboardData.totalReceived,
    totalPending: dashboardData.totalPending,
  }];

  const userData = dashboardData.topUsers;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
           <div className="flex space-x-4 mt-4">
        <CSVLink data={summaryData} headers={summaryHeaders} filename="summary-data.csv" className="text-white bg-green-500 px-4 py-2 rounded">
          Download Summary CSV
        </CSVLink>
        <CSVLink data={userData} headers={userHeaders} filename="user-data.csv" className="text-white bg-blue-500 px-4 py-2 rounded">
          Download Top Users CSV
        </CSVLink>


      {!pendingData  &&   <button
          onClick={handleFetchPendingData}
          disabled={pendingLoading}
          className="text-white bg-red-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {pendingLoading ? "Loading Pending Orders..." : "Fetch Pending Orders"}
        </button>}

        {/* Show CSVLink dynamically only if pendingData exists */}
        {pendingData && pendingData.length > 0 && (
          <CSVLink
            data={pendingData}
            headers={pendingHeaders}
            filename="pending-orders.csv"
            className="text-white bg-purple-600 px-4 py-2 rounded"
          >
            Download Pending Orders CSV
          </CSVLink>
        )}


      </div>
      </div>

   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Total Orders */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{dashboardData.totalOrders.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">All time orders</p>
    </CardContent>
  </Card>

  {/* Total Stores */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
      <Store className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{dashboardData.totalStores.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Active stores</p>
    </CardContent>
  </Card>

  {/* Total Amount */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        ${dashboardData.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <p className="text-xs text-muted-foreground">All time sales</p>
    </CardContent>
  </Card>

  {/* Received Amount */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Received Amount</CardTitle>
      <BarChart className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        ${dashboardData.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{receivedPercentage}% of total</span>
          <span className="text-muted-foreground">
            ${dashboardData.totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pending
          </span>
        </div>
        <Progress value={receivedPercentage} className="h-1" />
      </div>
    </CardContent>
  </Card>

  {/* Pending Orders */}
  {/* <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
      <Hourglass className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-lg font-semibold">
        Paid: $
        {dashboardData.pendingOrders.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="text-lg font-semibold">
        Due: $
        {dashboardData.pendingOrders.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <p className="text-xs text-muted-foreground">Pending orders amount</p>
    </CardContent>
  </Card> */}

  {/* Delivered Orders */}
  {/* <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
      <Package className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-lg font-semibold">
        Paid: $
        {dashboardData.deliveredOrders.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="text-lg font-semibold">
        Due: $
        {dashboardData.deliveredOrders.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <p className="text-xs text-muted-foreground">Delivered orders amount</p>
    </CardContent>
  </Card> */}
</div>


      <div>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
            <CardDescription>Top 10 stores by total order amount</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.topUsers.map((user) => {
                  // Get initials for avatar
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)

                  return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden sm:inline-flex h-8 w-8">
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden truncate max-w-[180px]">
                              {user.email.toLowerCase()}
                              
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell 
                      
                      
                       onClick={() => fetchUserDetailsOrder(user?.id || user?._id)}
                      className="px-6 py-4 cursor-pointer flex items-center gap-1 text-primary hover:underline"
                      >
                        {user.email.toLowerCase()}
                      </TableCell>
                      <TableCell className="text-right">{user.orderCount}</TableCell>
                      <TableCell className="text-right font-medium">
                        $
                        {user.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>


        </Card>

         <UserDetailsModal
        isOpen={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        userData={selectedUserData}
        fetchUserDetailsOrder={fetchUserDetailsOrder}
      />
      </div>
    </div>
  )
}
