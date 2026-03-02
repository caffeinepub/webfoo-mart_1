import { CreditCard, MapPin, Phone, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  type Order,
  formatPrice,
  generateId,
  getOrders,
  saveOrders,
} from "../data/seed";

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
    navigate("/order-confirmed", { state: { order } });
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
    <main className="min-h-screen pb-24">
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
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
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
                  <p className="text-xs text-destructive mt-1">
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
                  <p className="text-xs text-destructive mt-1">
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
  );
}
