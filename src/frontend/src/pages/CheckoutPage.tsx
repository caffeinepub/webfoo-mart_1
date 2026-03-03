import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { type Order, formatPrice, getOrders, saveOrders } from "../data/seed";

// ─── Confetti particle config ─────────────────────────────────────────────────
const CONFETTI_PARTICLES = [
  {
    id: "cf-1",
    color: "oklch(0.72 0.17 213)",
    x: 15,
    delay: 0,
    dur: 1.1,
    rot: 35,
  },
  {
    id: "cf-2",
    color: "oklch(0.82 0.15 85)",
    x: 28,
    delay: 0.05,
    dur: 0.95,
    rot: -20,
  },
  {
    id: "cf-3",
    color: "oklch(0.7 0.18 162)",
    x: 42,
    delay: 0.1,
    dur: 1.2,
    rot: 60,
  },
  {
    id: "cf-4",
    color: "oklch(0.75 0.18 303)",
    x: 55,
    delay: 0,
    dur: 1.0,
    rot: -45,
  },
  {
    id: "cf-5",
    color: "oklch(0.72 0.17 213)",
    x: 68,
    delay: 0.08,
    dur: 1.15,
    rot: 15,
  },
  {
    id: "cf-6",
    color: "oklch(0.82 0.15 85)",
    x: 80,
    delay: 0.03,
    dur: 0.9,
    rot: 80,
  },
  {
    id: "cf-7",
    color: "oklch(0.7 0.18 162)",
    x: 90,
    delay: 0.12,
    dur: 1.05,
    rot: -60,
  },
  {
    id: "cf-8",
    color: "oklch(0.75 0.18 303)",
    x: 35,
    delay: 0.07,
    dur: 1.3,
    rot: 25,
  },
  {
    id: "cf-9",
    color: "oklch(0.72 0.17 213)",
    x: 60,
    delay: 0.15,
    dur: 0.85,
    rot: -10,
  },
  {
    id: "cf-10",
    color: "oklch(0.82 0.15 85)",
    x: 48,
    delay: 0.02,
    dur: 1.0,
    rot: 50,
  },
];

// ─── Order Confirmation Modal ─────────────────────────────────────────────────
function OrderConfirmModal({
  order,
  onContinueShopping,
  onViewDetails,
}: {
  order: Order;
  onContinueShopping: () => void;
  onViewDetails: () => void;
}) {
  return (
    <>
      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes confetti-fall {
          0%   { opacity: 1; transform: translateY(-10px) rotate(0deg) scale(1); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(180px) rotate(var(--rot)) scale(0.5); }
        }
        @keyframes modal-pop {
          0%   { opacity: 0; transform: scale(0.88) translateY(16px); }
          60%  { opacity: 1; transform: scale(1.03) translateY(-3px); }
          80%  { transform: scale(0.98) translateY(1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes success-ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.7 0.18 162 / 0.55), 0 0 24px 6px oklch(0.7 0.18 162 / 0.15); }
          50%       { box-shadow: 0 0 0 14px oklch(0.7 0.18 162 / 0), 0 0 32px 10px oklch(0.7 0.18 162 / 0.2); }
        }
        @keyframes check-bounce {
          0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
          55%  { transform: scale(1.22) rotate(6deg); opacity: 1; }
          78%  { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes order-id-shine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes total-pop {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .order-id-text {
          background: linear-gradient(90deg, oklch(0.72 0.17 213), oklch(0.82 0.15 85), oklch(0.72 0.17 213));
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: order-id-shine 2.5s linear infinite;
        }
      `}</style>

      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{
          backgroundColor: "oklch(0 0 0 / 0.78)",
          backdropFilter: "blur(4px)",
          animation: "modal-backdrop-in 0.25s ease both",
        }}
        data-ocid="order_modal.modal"
      >
        {/* Modal card */}
        <div
          className="relative w-full max-w-md overflow-hidden"
          style={{
            background: "oklch(0.11 0.005 213)",
            border: "1px solid oklch(0.72 0.17 213 / 0.3)",
            borderRadius: "1.25rem",
            boxShadow:
              "0 32px 100px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(0.72 0.17 213 / 0.1), 0 0 60px oklch(0.7 0.18 162 / 0.06)",
            animation: "modal-pop 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both",
          }}
        >
          {/* ── Confetti burst layer ── */}
          <div
            className="absolute inset-x-0 top-0 h-36 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {CONFETTI_PARTICLES.map((p, i) => (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: `${p.x}%`,
                  width: i % 3 === 0 ? "7px" : "5px",
                  height: i % 3 === 0 ? "7px" : "10px",
                  borderRadius: i % 2 === 0 ? "50%" : "1px",
                  background: p.color,
                  // @ts-expect-error CSS custom prop
                  "--rot": `${p.rot}deg`,
                  animation: `confetti-fall ${p.dur}s ease-in ${p.delay}s both`,
                }}
              />
            ))}
          </div>

          {/* ── Top gradient accent ── */}
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-[1.25rem]"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.17 213), oklch(0.82 0.15 85), oklch(0.7 0.18 162))",
            }}
          />

          <div className="relative p-7 pt-8">
            {/* Close button */}
            <button
              type="button"
              onClick={onContinueShopping}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              data-ocid="order_modal.close_button"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ── Success icon ── */}
            <div className="flex justify-center mb-5">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.15 162 / 0.2) 0%, oklch(0.65 0.15 162 / 0.05) 70%)",
                  border: "2.5px solid oklch(0.7 0.18 162 / 0.6)",
                  animation: "success-ring-pulse 2s ease-in-out 0.5s infinite",
                }}
              >
                <div
                  style={{
                    animation:
                      "check-bounce 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both",
                  }}
                >
                  <CheckCircle2
                    className="w-12 h-12"
                    style={{
                      color: "oklch(0.75 0.2 162)",
                      filter: "drop-shadow(0 0 10px oklch(0.7 0.18 162 / 0.6))",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── Heading ── */}
            <h2
              className="text-3xl font-bold text-center mb-1"
              style={{ color: "oklch(0.97 0 0)" }}
            >
              Order Placed! 🎉
            </h2>
            <p
              className="text-sm text-center mb-1"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Your order is confirmed
            </p>
            <p className="text-xs text-center font-mono mb-5 order-id-text">
              {order.id}
            </p>

            {/* ── Item list ── */}
            <div
              className="rounded-xl mb-3"
              style={{
                background: "oklch(0.08 0 0)",
                border: "1px solid oklch(0.2 0 0)",
              }}
            >
              {/* Items scrollable area */}
              <div
                style={{ maxHeight: "160px", overflowY: "auto" }}
                className="divide-y divide-border"
              >
                {order.items.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                    data-ocid={`order_modal.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                        style={{
                          background: "oklch(0.72 0.17 213 / 0.15)",
                          color: "oklch(0.72 0.17 213)",
                        }}
                      >
                        {item.qty}
                      </span>
                      <span
                        className="text-sm truncate"
                        style={{ color: "oklch(0.85 0 0)" }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold flex-shrink-0"
                      style={{ color: "oklch(0.72 0.17 213)" }}
                    >
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-b-xl"
                style={{
                  background: "oklch(0.72 0.17 213 / 0.07)",
                  borderTop: "1px solid oklch(0.72 0.17 213 / 0.2)",
                }}
              >
                <span
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: "oklch(0.65 0 0)" }}
                >
                  Total
                </span>
                <span
                  className="text-2xl font-extrabold"
                  style={{
                    color: "oklch(0.82 0.15 85)",
                    animation:
                      "total-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both",
                    display: "inline-block",
                  }}
                >
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* ── Estimated delivery row ── */}
            <div
              className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 mb-5"
              style={{
                background: "oklch(0.82 0.15 85 / 0.08)",
                border: "1px solid oklch(0.82 0.15 85 / 0.2)",
              }}
            >
              <Truck
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "oklch(0.82 0.15 85)" }}
              />
              <p className="text-xs" style={{ color: "oklch(0.75 0 0)" }}>
                Estimated Delivery:{" "}
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.82 0.15 85)" }}
                >
                  2–4 business days
                </span>
              </p>
            </div>

            {/* ── Action buttons ── */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onViewDetails}
                className="wfm-btn-primary w-full h-12 text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  borderRadius: "0.75rem",
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.17 213), oklch(0.65 0.2 220))",
                  boxShadow: "0 4px 20px oklch(0.72 0.17 213 / 0.35)",
                }}
                data-ocid="order_modal.view_details_button"
              >
                <ShoppingBag className="w-4 h-4" />
                View Order Details
              </button>
              <button
                type="button"
                onClick={onContinueShopping}
                className="w-full h-11 text-sm font-medium transition-all"
                style={{
                  borderRadius: "0.75rem",
                  background: "transparent",
                  border: "1px solid oklch(0.3 0 0)",
                  color: "oklch(0.6 0 0)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.5 0 0)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.85 0 0)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.3 0 0)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.6 0 0)";
                }}
                data-ocid="order_modal.continue_shopping_button"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { customer } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: customer?.name ?? "",
    address: customer?.address ?? "",
    phone: customer?.mobile ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!customer) return <Navigate to="/login?returnUrl=/checkout" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setPlacing(true);

    const order: Order = {
      id: `ORD${Date.now().toString().slice(-8)}`,
      customerId: customer.id,
      customerName: customer.name,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        imageUrl: i.imageUrl,
      })),
      total,
      address: form.address,
      phone: form.phone,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const orders = getOrders();
    saveOrders([order, ...orders]);
    clearCart();
    // Show modal first, then navigate to dedicated page
    setPlacedOrder(order);
    setPlacing(false);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    },
  });

  return (
    <>
      {/* Order Confirmation Modal */}
      {placedOrder && (
        <OrderConfirmModal
          order={placedOrder}
          onContinueShopping={() => navigate("/")}
          onViewDetails={() => navigate("/orders")}
        />
      )}

      <main className="min-h-screen pb-24 page-enter">
        <div className="max-w-xl mx-auto px-4 py-6">
          <h1 className="text-xl font-bold text-foreground mb-6">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Details */}
            <div className="wfm-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Details
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="Your full name"
                      className={`wfm-input pl-9 ${errors.name ? "border-destructive" : ""}`}
                      data-ocid="checkout.name_input"
                      {...field("name")}
                    />
                  </div>
                  {errors.name && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="checkout-address"
                    placeholder="House no., street, city, state, PIN"
                    rows={3}
                    className={`wfm-input resize-none ${errors.address ? "border-destructive" : ""}`}
                    data-ocid="checkout.address_input"
                    {...field("address")}
                  />
                  {errors.address && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.address_error"
                    >
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`wfm-input pl-9 ${errors.phone ? "border-destructive" : ""}`}
                      data-ocid="checkout.phone_input"
                      {...field("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.phone_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="wfm-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Method
              </h2>
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Cash on Delivery
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Free
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="wfm-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Order Summary
              </h2>
              <div className="space-y-1.5 text-sm">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span className="truncate max-w-[200px]">
                      {item.name} × {item.qty}
                    </span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={placing}
              className="wfm-btn-primary w-full h-12 text-base"
              data-ocid="checkout.place_order_button"
            >
              {placing
                ? "Placing Order..."
                : `Place Order — ${formatPrice(total)}`}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
