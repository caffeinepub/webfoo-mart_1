import { Package } from "lucide-react";
import React, { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { type OrderStatus, formatPrice, getOrders } from "../data/seed";

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    Pending: "status-badge-pending",
    Processing: "status-badge-processing",
    Shipped: "status-badge-shipped",
    Delivered: "status-badge-delivered",
  };
  return <span className={map[status]}>{status}</span>;
}

export default function OrdersPage() {
  const { customer } = useAuth();

  const orders = useMemo(() => {
    if (!customer) return [];
    const all = getOrders();
    return all
      .filter((o) => o.customerId === customer.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [customer]);

  if (!customer) return <Navigate to="/login?returnUrl=/orders" replace />;

  if (orders.length === 0) {
    return (
      <main className="min-h-screen pb-24 flex flex-col items-center justify-center px-4">
        <div className="text-center" data-ocid="orders.order_list_empty_state">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your orders here
          </p>
          <Link to="/" className="wfm-btn-primary">
            Browse Stores
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">My Orders</h1>

        <div className="space-y-4" data-ocid="orders.order_list">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="wfm-card p-4"
              data-ocid={`orders.order_card.${i + 1}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover bg-secondary flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} × {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-foreground flex-shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Delivered to:
                  </span>{" "}
                  {order.address}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium text-foreground">Phone:</span>{" "}
                  {order.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
