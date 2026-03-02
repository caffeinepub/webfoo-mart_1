import { Bell } from "lucide-react";
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationsPage() {
  const { customer } = useAuth();
  if (!customer)
    return <Navigate to="/login?returnUrl=/notifications" replace />;

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">
          Notifications
        </h1>

        <div className="wfm-card p-8 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">
            All caught up!
          </h2>
          <p className="text-sm text-muted-foreground">
            You have no new notifications. We'll let you know when your orders
            are updated.
          </p>
        </div>
      </div>
    </main>
  );
}
