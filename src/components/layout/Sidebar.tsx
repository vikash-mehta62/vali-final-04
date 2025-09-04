"use client";

import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  Users,
  ShoppingCart,
  X,
  Briefcase,
  Zap,
  ChevronRight,
  ChevronLeft,
  Store,
  Settings,
  User2Icon,
  LucideLayoutDashboard,
  LocateIcon,
} from "lucide-react";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

// Define navigation items for each role

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  // Get user role from Redux state
  const userRole = user?.role || "member"; // Default to member if role is not available

  const adminNavigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LucideLayoutDashboard size={18} />,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: <Package size={18} />,
    },
    {
      name: "Members",
      path: "/admin/members",
      icon: <Users size={18} />,
    },
    {
      name: "Store",
      path: "/admin/store",
      icon: <Store size={18} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      name: "CRM",
      path: "/admin/crm",
      icon: <Briefcase size={18} />,
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: <User2Icon size={18} />,
    },
    {
      name: "Map",
      path: "/map",
      icon: <LocateIcon size={18} />,
    },
  ];

  const memberNavigation = [
    // Conditionally add "Orders" only if user is member and isOrder is true
    ...(user?.role === "member" && user?.isOrder
      ? [
          {
            name: "Orders",
            path: "/admin/orders",
            icon: <ShoppingCart size={18} />,
          },
        ]
      : []),
    {
      name: "Products",
      path: "/admin/inventory",
      icon: <Package size={18} />,
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: <User2Icon size={18} />,
    },
  ];

  const storeNavigation = [
    {
      name: "Products",
      path: "/store/products",
      icon: <Package size={18} />,
    },
    {
      name: "My Orders",
      path: "/store/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      name: "Settings",
      path: "/store/settings",
      icon: <Settings size={18} />,
    },
  ];

  // Select navigation items based on user role
  const getNavigationForRole = () => {
    switch (userRole) {
      case "admin":
        return adminNavigation;
      case "member":
        return memberNavigation;
      case "store":
        return storeNavigation;
      default:
        return memberNavigation; // Default to member navigation
    }
  };

  const navigationPaths = getNavigationForRole();

  const handleMouseEnter = () => {
    if (collapsed) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      setHovering(false);
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (collapsed) {
      setHovering(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-border/40 transition-all duration-300 ease-in-out shadow-lg md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed && !hovering ? "md:w-[60px]" : "w-[280px] sm:w-64"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-2",
              collapsed && !hovering && "md:justify-center md:w-full md:px-0"
            )}
          >
            <span
              className={cn(
                "font-bold text-xl tracking-tight truncate",
                collapsed && !hovering && "md:hidden"
              )}
            >
              Vali
            </span>
            {collapsed && !hovering && (
              <span className="font-bold text-xl tracking-tight hidden md:block">
                V
              </span>
            )}
          </Link>
          <div className="flex items-center">
            <button
              onClick={toggleCollapsed}
              className="rounded-full p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hidden md:block mr-2"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed && !hovering ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4 px-3 hide-scrollbar">
          <nav className="flex flex-col gap-1">
            {/* Display role-specific navigation items */}
            {navigationPaths.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "nav-link group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-200",
                  location.pathname === route.path
                    ? "text-sidebar-primary bg-sidebar-accent font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && !hovering && "md:justify-center md:px-2"
                )}
                onClick={onClose}
              >
                <span className="text-current">{route.icon}</span>
                <span
                  className={cn(
                    "truncate",
                    collapsed && !hovering && "md:hidden"
                  )}
                >
                  {route.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Only show Pro Version section for non-admin users */}
        {userRole !== "admin" && (
          <div
            className={cn(
              "p-4 border-t border-border/40",
              collapsed && !hovering && "md:px-2"
            )}
          >
            <Link to="/store" className="block">
              <div
                className={cn(
                  "rounded-md bg-primary/10 p-3 relative overflow-hidden hover:bg-primary/20 transition-colors",
                  collapsed && !hovering && "md:p-2"
                )}
              >
                <div className="flex items-center mb-2">
                  <Zap size={16} className="text-primary mr-1.5" />
                  <div
                    className={cn(
                      "text-sm font-medium text-sidebar-primary truncate",
                      collapsed && !hovering && "md:hidden"
                    )}
                  >
                    Pro Version
                  </div>
                </div>
                <p
                  className={cn(
                    "text-xs text-sidebar-foreground/80",
                    collapsed && !hovering && "md:hidden"
                  )}
                >
                  Upgrade to access advanced AI features and analytics.
                </p>
                <div
                  className={cn(
                    "mt-2 text-xs font-medium text-sidebar-primary flex items-center",
                    collapsed && !hovering && "md:hidden"
                  )}
                >
                  Learn More <span className="ml-1">→</span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </aside>

      <div
        className={`  transition-all duration-300 ${
          collapsed && !hovering ? "md:w-[90px]" : "w-[300px] "
        }`}
      >
        {/* Main Content Goes Here */}
      </div>
    </>
  );
};

export default Sidebar;
