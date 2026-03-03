import { CreditCard, Hash, MapPin, Phone, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { type Order, formatPrice, getOrders, saveOrders } from "../data/seed";

// ─── Checkout Page ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { customer } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: customer?.name ?? "",
    address: customer?.address ?? "",
    pinCode: "",
    phone: customer?.mobile ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [exiting, setExiting] = useState(false);

  if (!customer) return <Navigate to="/login?returnUrl=/checkout" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (!/^\d{6}$/.test(form.pinCode))
      errs.pinCode = "Enter a valid 6-digit PIN code";
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
    setExiting(true);

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
      pinCode: form.pinCode,
      phone: form.phone,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const orders = getOrders();
    saveOrders([order, ...orders]);
    clearCart();

    // Wait for exit animation (~900ms) before navigating
    setTimeout(() => {
      navigate("/order-confirmed", { state: { order } });
    }, 900);
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
      {/* Full-screen exit overlay with spinner */}
      {exiting && (
        <div
          className="checkout-placing-overlay fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, oklch(0.12 0.04 213 / 0.97) 0%, oklch(0.06 0 0 / 0.99) 100%)",
          }}
          data-ocid="checkout.placing_overlay"
          aria-live="polite"
          aria-label="Placing your order"
        >
          {/* Spinner ring */}
          <div className="relative w-20 h-20">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid oklch(0.72 0.17 213 / 0.15)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid transparent",
                borderTopColor: "oklch(0.72 0.17 213)",
                borderRightColor: "oklch(0.82 0.15 85 / 0.6)",
                animation: "spin 0.9s linear infinite",
              }}
            />
            {/* Inner glow dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.82 0.15 85)",
                  boxShadow: "0 0 12px 4px oklch(0.82 0.15 85 / 0.5)",
                }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <p
              className="text-base font-semibold tracking-wide"
              style={{ color: "oklch(0.97 0 0)" }}
            >
              Placing your order…
            </p>
            <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
              Please wait while we confirm your order
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.72 0.17 213)",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <main
        className={`min-h-screen pb-24 page-enter${exiting ? " checkout-exit-anim" : ""}`}
      >
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
                      data-ocid="checkout.name_error_state"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
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
                      data-ocid="checkout.phone_error_state"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    PIN Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="checkout-pincode"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      className={`wfm-input pl-9 ${errors.pinCode ? "border-destructive" : ""}`}
                      data-ocid="checkout.pincode_input"
                      {...field("pinCode")}
                    />
                  </div>
                  {errors.pinCode && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.pincode_error_state"
                    >
                      {errors.pinCode}
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
                    placeholder="House no., street, city, state"
                    rows={3}
                    className={`wfm-input resize-none ${errors.address ? "border-destructive" : ""}`}
                    data-ocid="checkout.address_input"
                    {...field("address")}
                  />
                  {errors.address && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.address_error_state"
                    >
                      {errors.address}
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
