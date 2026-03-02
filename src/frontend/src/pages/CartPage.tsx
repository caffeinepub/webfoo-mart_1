import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../data/seed";

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!customer) {
      navigate("/login?returnUrl=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-center" data-ocid="cart.empty_state">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add items from our stores to get started
          </p>
          <Link to="/" className="wfm-btn-primary">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">
          Shopping Cart
          <span className="text-muted-foreground text-sm font-normal ml-2">
            ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
        </h1>

        {/* Items */}
        <div className="space-y-3 mb-6" data-ocid="cart.item_list">
          {items.map((item, i) => (
            <div
              key={item.productId}
              className="wfm-card p-3 flex gap-3"
              data-ocid={`cart.item.${i + 1}`}
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-base font-bold text-primary mt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Qty + Remove */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors rounded-l-md"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm select-none">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors rounded-r-md"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Line total */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="wfm-card p-4 mb-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm">
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
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          onClick={handleCheckout}
          className="wfm-btn-primary w-full h-12 text-base"
          data-ocid="cart.checkout_button"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}
