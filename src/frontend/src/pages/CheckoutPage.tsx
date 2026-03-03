import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { type Order, formatPrice, getOrders, saveOrders } from "../data/seed";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      style={{ backgroundColor: "oklch(0 0 0 / 0.75)" }}
      data-ocid="order_modal.modal"
    >
      <div
        className="relative w-full max-w-sm modal-card"
        style={{
          background: "oklch(0.13 0.01 213)",
          border: "1px solid oklch(0.72 0.17 213 / 0.25)",
          borderRadius: "1rem",
          boxShadow:
            "0 24px 80px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.72 0.17 213 / 0.08)",
          padding: "2rem",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onContinueShopping}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="order_modal.close_button"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated checkmark */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center pulse-ring"
            style={{
              background: "oklch(0.65 0.15 162 / 0.15)",
              border: "2px solid oklch(0.65 0.15 162 / 0.5)",
            }}
          >
            <div className="checkmark-animate">
              <CheckCircle2
                className="w-10 h-10"
                style={{ color: "oklch(0.7 0.18 162)" }}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-foreground mb-1">
          Order Placed!
        </h2>
        <p className="text-sm text-center text-muted-foreground mb-5">
          Your order is confirmed and will be delivered soon.
        </p>

        {/* Order summary card */}
        <div
          className="rounded-lg p-4 mb-5 space-y-2"
          style={{
            background: "oklch(0.09 0 0)",
            border: "1px solid oklch(0.22 0 0)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Order ID
            </span>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: "oklch(0.7 0.18 162)" }}
            >
              {order.id}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Items
            </span>
            <span className="text-sm text-foreground font-medium">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onViewDetails}
            className="wfm-btn-primary w-full h-11 text-sm flex items-center justify-center gap-2"
            data-ocid="order_modal.view_details_button"
          >
            <ShoppingBag className="w-4 h-4" />
            View Order Details
          </button>
          <button
            type="button"
            onClick={onContinueShopping}
            className="wfm-btn-secondary w-full h-11 text-sm"
            data-ocid="order_modal.continue_shopping_button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
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
