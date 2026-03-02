import { CheckCircle2 } from "lucide-react";
import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { type Order, formatPrice } from "../data/seed";

export default function OrderConfirmedPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pb-24">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-6">
          Your order has been confirmed and will be delivered soon.
        </p>

        {/* Order Details */}
        <div className="wfm-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-foreground">
              Order ID
            </span>
            <span className="text-sm font-mono text-primary font-bold">
              {order.id}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover bg-secondary flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Qty: {item.qty}
                  </p>
                </div>
                <span className="text-foreground font-medium flex-shrink-0">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
            <span className="text-foreground">Total Paid</span>
            <span className="text-primary text-lg">
              {formatPrice(order.total)}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Delivery to:</span>{" "}
              {order.address}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">Payment:</span> Cash
              on Delivery
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="wfm-btn-secondary flex-1 text-center h-11 flex items-center justify-center"
            data-ocid="order_confirmed.continue_button"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="wfm-btn-primary flex-1 text-center h-11 flex items-center justify-center"
            data-ocid="order_confirmed.orders_button"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
