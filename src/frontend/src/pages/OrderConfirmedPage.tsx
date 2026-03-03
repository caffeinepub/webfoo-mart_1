import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { type Order, formatPrice } from "../data/seed";

export default function OrderConfirmedPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) return <Navigate to="/" replace />;

  const statusColor: Record<string, string> = {
    Pending: "oklch(0.8 0.15 84)",
    Processing: "oklch(0.7 0.15 240)",
    Shipped: "oklch(0.7 0.15 280)",
    Delivered: "oklch(0.7 0.18 162)",
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen pb-24">
      {/* Hero success header */}
      <div
        className="relative overflow-hidden py-12 px-4"
        style={{
          background:
            "radial-gradient(ellipse 60% 120% at 50% 0%, oklch(0.65 0.15 162 / 0.15) 0%, transparent 70%)",
          borderBottom: "1px solid oklch(0.22 0 0)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Animated pulsing ring + checkmark */}
          <div className="relative mb-6">
            {/* Outer ring – CSS pulse */}
            <div
              className="absolute inset-0 rounded-full pulse-ring"
              style={{
                background: "transparent",
                border: "2px solid oklch(0.65 0.15 162 / 0.4)",
              }}
            />
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center checkmark-animate"
              style={{
                background: "oklch(0.65 0.15 162 / 0.15)",
                border: "2px solid oklch(0.65 0.15 162 / 0.5)",
              }}
            >
              <CheckCircle2
                className="w-12 h-12"
                style={{ color: "oklch(0.7 0.18 162)" }}
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            Thank you for your order. We'll get it to you as soon as possible.
          </p>

          {/* Order ID pill */}
          <div
            className="mt-4 px-4 py-2 rounded-full text-sm font-mono font-bold"
            style={{
              background: "oklch(0.7 0.18 162 / 0.12)",
              border: "1px solid oklch(0.7 0.18 162 / 0.3)",
              color: "oklch(0.75 0.18 162)",
            }}
          >
            #{order.id}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Status & Date */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
          }}
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Order Status
              </p>
              <p
                className="text-sm font-bold mt-0.5"
                style={{
                  color: statusColor[order.status] ?? "oklch(0.7 0.18 162)",
                }}
              >
                {order.status}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Date
            </p>
            <p className="text-xs text-foreground mt-0.5">{orderDate}</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div
          className="rounded-xl p-4"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery Address
            </h3>
          </div>
          <p className="text-sm text-foreground">{order.address}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Phone: {order.phone}
          </p>
          <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Payment:</span>
            <span className="text-xs font-semibold text-foreground">
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
          }}
        >
          <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Items ({order.items.length})
            </h3>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item, i) => (
              <div
                key={`${item.productId}-${i}`}
                className="flex items-center gap-3 p-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-secondary flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Qty: {item.qty} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: "oklch(0.09 0 0)",
              borderTop: "1px solid oklch(0.22 0 0)",
            }}
          >
            <span className="text-sm font-bold text-foreground">
              Total Paid
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: "oklch(0.7 0.18 162)" }}
            >
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="wfm-btn-secondary flex-1 text-center h-11 flex items-center justify-center"
            data-ocid="order_confirmed.continue_button"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="wfm-btn-primary flex-1 text-center h-11 flex items-center justify-center gap-2"
            data-ocid="order_confirmed.orders_button"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
