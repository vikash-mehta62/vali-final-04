import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import PriceList from "./pages/PriceList";
import NewOrder from "./pages/NewOrder";
import EditOrder from "./pages/EditOrder";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import Payments from "./pages/Payments";
import NewPayment from "./pages/NewPayment";
import CRM from "./pages/CRM";
import UserGuide from "./pages/UserGuide";
import WebsiteGenerator from "./pages/WebsiteGenerator";
import Auth from "./pages/Auth";
import StoreDashboard from "./pages/StoreDashboard";
import StoreUsers from "./pages/StoreUsers";
import StorePortal from "./pages/StorePortal";
import Store from "./pages/Store";
import StoreFront from "./pages/StoreFront";
import Member from "./components/admin/Member";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStorets from "./pages/AdminStorets";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";

import PrivateRoute from "@/components/auth/PrivateRoute";
import OpenRoute from "@/components/auth/OpenRoute";
import CreateOrderModalStore from "./pages/StoreMakeORderTemplate";
import StoreRegistration from "./pages/StoreRegistration";
import GroupPricing from "./pages/GroupPricing";
import SettingsPage from "./components/settings/Settings";
import { fetchMyProfile } from "@/services2/operations/auth";
import Vendors from "./pages/Vendors";
import NewVendor from "./pages/NewVendor";
import NewPurchase from "./pages/NewPurchase";
import VendorQualityControl from "./pages/VendorQualityControl";
import VendorInvoiceUpload from "./pages/VendorInvoiceUpload";
import VendorPayment from "./pages/VendorPayment";
import EditPurchaseOrder from "./pages/EditPurchaseOrder";
import ViewPurchaseOrder from "./pages/ViewPurchase";
import Map from "./components/admin/Map";
import StateInventoryDashboard from "./components/warehouse/StateInventoryDashboard";
import WarehouseSetup from "./components/warehouse/WarehouseSetup";
import OrderInventoryManagement from "./pages/OrderInventoryManagement";
import TestDashboard from "./pages/TestDashboard";
import SimpleStateInventory from "./pages/SimpleStateInventory";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";

export default function App() {
  const [loading, setLoading] = useState(true);
  const authData = useSelector((state: RootState) => state.auth);
  const isAuthenticated = authData?.token ? true : false;
  const dispatch = useDispatch();

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    if (authData?.token) {
      dispatch(fetchMyProfile(authData?.token));
    }
  }, []);
  const isAdmin = isAuthenticated && authData?.user?.role === "admin";
  const isMember = isAuthenticated && authData?.user?.role === "member";
  const isStore = isAuthenticated && authData?.user?.role === "store";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Open Routes */}
        <Route
          path="/"
          element={
            <OpenRoute>
              <LandingPage />
            </OpenRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <OpenRoute>
              <Auth />
            </OpenRoute>
          }
        />
        <Route
          path="/store-registration"
          element={
            <OpenRoute>
              <StoreRegistration />
            </OpenRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute isAdmin={isAdmin}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/store"
          element={
            <PrivateRoute isAdmin={isAdmin}>
              <AdminStorets />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <PrivateRoute isAdmin={isAdmin}>
              <Member />
            </PrivateRoute>
          }
        />
        {/* Store Routes */}
        <Route
          path="/store/dashboard"
          element={
            <PrivateRoute isStore={isStore}>
              <StoreDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/store/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/store/template"
          element={
            // <PrivateRoute isStore={isStore}>
            <CreateOrderModalStore />
            // </PrivateRoute>
          }
        />
        <Route
          path="/store/nextweek"
          element={
            // <PrivateRoute isStore={isStore}>
            <CreateOrderModalStore />
            // </PrivateRoute>
          }
        />
        <Route
          path="/store/users"
          element={
            <PrivateRoute isStore={isStore}>
              <StoreUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/storeportal"
          element={
            <PrivateRoute>
              <StorePortal />
            </PrivateRoute>
          }
        />
        <Route
          path="/store/products"
          element={
            <PrivateRoute isMember={isStore}>
              <StoreFront />
            </PrivateRoute>
          }
        />
        <Route
          path="/store/settings"
          element={
            <PrivateRoute isMember={isStore}>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        <Route path="/store" element={<Store />} />
        {/* Member Routes */}
        <Route
          path="/member/dashboard"
          element={
            <PrivateRoute isMember={isMember}>
              <Index />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <Clients />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <PrivateRoute>
              <ClientProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/pricing"
          element={
            <PrivateRoute>
              <GroupPricing />
            </PrivateRoute>
          }
        />
        <Route
          path="/price-list"
          element={
            <PrivateRoute>
              <PriceList />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/new"
          element={
            <PrivateRoute>
              <NewOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/edit/:orderId"
          element={
            <PrivateRoute>
              <EditOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <PrivateRoute>
              <Team />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments/new"
          element={
            <PrivateRoute>
              <NewPayment />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/crm"
          element={
            <PrivateRoute>
              <CRM />
            </PrivateRoute>
          }
        />
        <Route
          path="/guide"
          element={
            <PrivateRoute>
              <UserGuide />
            </PrivateRoute>
          }
        />
        <Route
          path="/website"
          element={
            <PrivateRoute>
              <WebsiteGenerator />
            </PrivateRoute>
          }
        />

        {/* Vendors */}
        <Route
          path="/vendors"
          element={
            <PrivateRoute>
              <Vendors />
            </PrivateRoute>
          }
        />
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <Map />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouse/state-inventory"
          element={
            <PrivateRoute>
              <StateInventoryDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouse/setup"
          element={
            <PrivateRoute>
              <WarehouseSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-inventory-management"
          element={
            <PrivateRoute>
              <OrderInventoryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/test-dashboard"
          element={
            <PrivateRoute>
              <TestDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/simple-state-inventory"
          element={
            <PrivateRoute>
              <SimpleStateInventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/advanced-order-analytics"
          element={
            <PrivateRoute>
              <AdvancedAnalytics />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors/new-vendor"
          element={
            <PrivateRoute>
              <NewVendor />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendors/edit/:id"
          element={
            <PrivateRoute>
              <NewVendor />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors/new-purchase"
          element={
            <PrivateRoute>
              <NewPurchase />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendors/edit-purchase/:id"
          element={
            <PrivateRoute>
              <EditPurchaseOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendors/purchase/:id"
          element={
            <PrivateRoute>
              <ViewPurchaseOrder />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors/quality-control/:id"
          element={
            <PrivateRoute>
              <VendorQualityControl />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors/invoice/:id"
          element={
            <PrivateRoute>
              <VendorInvoiceUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors/payment/:id"
          element={
            <PrivateRoute>
              <VendorPayment />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
