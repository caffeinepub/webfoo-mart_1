import { Bell, Home, Package, User } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home", ocid: "bottomnav.home_link" },
  {
    to: "/orders",
    icon: Package,
    label: "Orders",
    ocid: "bottomnav.orders_link",
  },
  {
    to: "/account",
    icon: User,
    label: "Account",
    ocid: "bottomnav.account_link",
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "Alerts",
    ocid: "bottomnav.notifications_link",
  },
] as const;

export default function BottomNav() {
  const { customer } = useAuth();
  const location = useLocation();

  if (!customer) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label, ocid }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={ocid}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-10 h-0.5 bg-primary rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
