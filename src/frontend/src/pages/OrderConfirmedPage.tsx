import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import React, { useRef } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { type Order, formatPrice } from "../data/seed";

// ── Confetti particle config ─────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "oklch(0.65 0.18 162)", // green
  "oklch(0.82 0.15 85)", // gold
  "oklch(0.72 0.17 213)", // cyan
  "oklch(0.75 0.18 303)", // purple
  "oklch(0.80 0.18 60)", // amber
];

interface ConfettiParticle {
  id: number;
  left: string;
  width: string;
  height: string;
  color: string;
  delay: string;
  duration: string;
  borderRadius: string;
}

export default function OrderConfirmedPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  // Stable confetti particles computed once
  const particles = useRef<ConfettiParticle[]>([]);
  if (particles.current.length === 0) {
    particles.current = Array.from({ length: 28 }, (_, i) => {
      const size = 4 + (i % 7);
      return {
        id: i,
        left: `${(i * 3.7 + (i % 5) * 2.3) % 100}%`,
        width: `${size}px`,
        height: `${size + (i % 3)}px`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${0.3 + (i % 8) * 0.12}s`,
        duration: `${1.8 + (i % 4) * 0.3}s`,
        borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
      };
    });
  }

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
    <main
      className="min-h-screen pb-24 oc-bg-fade-in"
      style={{ background: "oklch(0.08 0 0)" }}
    >
      {/* Confetti burst */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ zIndex: 10 }}
      >
        {particles.current.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: "-20px",
              left: p.left,
              width: p.width,
              height: p.height,
              background: p.color,
              borderRadius: p.borderRadius,
              animation: `confettifall ${p.duration} ease-in ${p.delay} both`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Hero success header */}
      <div
        className="relative overflow-hidden py-14 px-4 oc-hero-slide-up"
        style={{
          background:
            "radial-gradient(ellipse 70% 140% at 50% -10%, oklch(0.65 0.15 162 / 0.18) 0%, oklch(0.72 0.17 213 / 0.04) 50%, transparent 80%)",
          borderBottom: "1px solid oklch(0.22 0 0)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Animated ring + checkmark */}
          <div className="relative mb-6">
            {/* Expanding outer ring */}
            <div
              className="absolute rounded-full oc-ring-expand"
              style={{
                inset: "-16px",
                border: "2px solid oklch(0.65 0.15 162 / 0.35)",
                boxShadow: "0 0 24px oklch(0.65 0.15 162 / 0.2)",
              }}
            />
            {/* Mid ring */}
            <div
              className="absolute rounded-full pulse-ring"
              style={{
                inset: "-6px",
                border: "1.5px solid oklch(0.65 0.15 162 / 0.3)",
              }}
            />
            {/* Main checkmark circle */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center checkmark-animate"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, oklch(0.7 0.18 162 / 0.25), oklch(0.65 0.15 162 / 0.1))",
                border: "2px solid oklch(0.65 0.15 162 / 0.55)",
                boxShadow:
                  "0 0 32px oklch(0.65 0.15 162 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.08)",
              }}
            >
              <CheckCircle2
                className="w-12 h-12"
                style={{
                  color: "oklch(0.72 0.18 162)",
                  filter: "drop-shadow(0 0 8px oklch(0.65 0.15 162 / 0.6))",
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2 oc-title-scale"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0 0) 0%, oklch(0.75 0.18 162) 60%, oklch(0.82 0.15 85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Order Placed Successfully!
          </h1>
          <p
            className="text-sm max-w-xs leading-relaxed oc-title-scale"
            style={{
              color: "oklch(0.6 0 0)",
              animationDelay: "0.7s",
            }}
          >
            Your order has been successfully placed and should arrive within the
            same day.
          </p>

          {/* Order ID pill */}
          <div
            className="mt-5 px-5 py-2 rounded-full text-sm font-mono font-bold oc-id-spring inline-flex items-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.18 162 / 0.14), oklch(0.72 0.17 213 / 0.1))",
              border: "1px solid oklch(0.7 0.18 162 / 0.4)",
              color: "oklch(0.78 0.18 162)",
              boxShadow: "0 2px 16px oklch(0.7 0.18 162 / 0.15)",
            }}
          >
            <span style={{ color: "oklch(0.55 0 0)" }}>#</span>
            {order.id}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Status & Date */}
        <div
          className="rounded-xl p-4 flex items-center justify-between oc-card-1"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 162 / 0.8), oklch(0.12 0 0))",
            border: "1px solid oklch(0.22 0 0)",
            boxShadow: "0 2px 12px oklch(0 0 0 / 0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.72 0.17 213 / 0.12)",
                border: "1px solid oklch(0.72 0.17 213 / 0.25)",
              }}
            >
              <Truck
                className="w-4 h-4"
                style={{ color: "oklch(0.72 0.17 213)" }}
              />
            </div>
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
          className="rounded-xl p-4 oc-card-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.01 213 / 0.5), oklch(0.12 0 0))",
            border: "1px solid oklch(0.22 0 0)",
            boxShadow: "0 2px 12px oklch(0 0 0 / 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: "oklch(0.82 0.15 85 / 0.12)",
                border: "1px solid oklch(0.82 0.15 85 / 0.2)",
              }}
            >
              <MapPin
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.82 0.15 85)" }}
              />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery Address
            </h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {order.address}
          </p>
          {order.pinCode && (
            <p className="text-xs text-muted-foreground mt-1">
              PIN: {order.pinCode}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Phone: {order.phone}
          </p>
          <div className="mt-3 pt-2.5 border-t border-border flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.65 0.15 162 / 0.1)",
                border: "1px solid oklch(0.65 0.15 162 / 0.25)",
                color: "oklch(0.72 0.18 162)",
              }}
            >
              ✓ Cash on Delivery
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div
          className="rounded-xl overflow-hidden oc-card-3"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            boxShadow: "0 2px 12px oklch(0 0 0 / 0.3)",
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2 border-b border-border"
            style={{ background: "oklch(0.10 0 0)" }}
          >
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
                data-ocid={`order_confirmed.item.${i + 1}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-secondary flex-shrink-0"
                  style={{ border: "1px solid oklch(0.22 0 0)" }}
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
            className="flex items-center justify-between px-4 py-3.5"
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
              style={{
                color: "oklch(0.72 0.18 162)",
                textShadow: "0 0 12px oklch(0.65 0.15 162 / 0.4)",
              }}
            >
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 oc-actions">
          {/* Secondary: Continue Shopping */}
          <Link
            to="/"
            className="text-center h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "oklch(0.14 0 0)",
              border: "1px solid oklch(0.25 0 0)",
              color: "oklch(0.65 0 0)",
            }}
            data-ocid="order_confirmed.continue_button"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "oklch(0.35 0 0)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "oklch(0.85 0 0)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "oklch(0.25 0 0)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "oklch(0.65 0 0)";
            }}
          >
            Continue Shopping
          </Link>

          {/* Primary CTA: Your Orders — gold shimmer button */}
          <Link
            to="/orders"
            className="orders-cta-btn oc-orders-btn relative overflow-hidden h-16 rounded-xl flex items-center px-5 gap-4 no-underline transition-transform duration-200"
            data-ocid="order_confirmed.orders_button"
          >
            {/* Left icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.1 0 0 / 0.3)",
                border: "1px solid oklch(0.1 0 0 / 0.25)",
              }}
            >
              <ShoppingBag
                className="w-5 h-5"
                style={{ color: "oklch(0.1 0.01 0)" }}
              />
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <p
                className="font-bold text-base leading-tight"
                style={{ color: "oklch(0.08 0 0)" }}
              >
                View Your Orders
              </p>
              <p
                className="text-xs font-medium mt-0.5 leading-tight"
                style={{ color: "oklch(0.2 0 0 / 0.7)" }}
              >
                Track &amp; manage all your orders
              </p>
            </div>

            {/* Right chevron */}
            <ChevronRight
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.15 0 0 / 0.6)" }}
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
