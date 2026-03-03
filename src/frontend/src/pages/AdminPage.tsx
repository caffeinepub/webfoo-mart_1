import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  EyeOff,
  IndianRupee,
  LayoutDashboard,
  Lock,
  LogOut,
  Package,
  Plus,
  Save,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import WFLogo from "../components/shared/WFLogo";
import {
  type Customer,
  type Order,
  type OrderStatus,
  type Product,
  type Store as StoreType,
  formatPrice,
  generateId,
  getCustomers,
  getOrders,
  getProducts,
  getStores,
  saveOrders,
  saveProducts,
  saveStores,
} from "../data/seed";

const ADMIN_PASSWORD = "webfoo@admin2026";
const ADMIN_AUTH_KEY = "wfm_admin_auth";

// ─── Password Gate (Glassmorphism redesign) ────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
        onAuth();
      } else {
        setError("Incorrect password. Try again.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.35 0.12 213 / 0.25) 0%, oklch(0.08 0 0) 60%)",
      }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <WFLogo size="md" showLabel={false} />
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mt-3"
            style={{ color: "oklch(0.72 0.17 213 / 0.8)" }}
          >
            Admin Command Center
          </p>
        </div>

        {/* Glassmorphism card */}
        <div className="admin-glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.72 0.17 213 / 0.15)" }}
            >
              <Lock
                className="w-5 h-5"
                style={{ color: "oklch(0.72 0.17 213)" }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Secure Access
              </h1>
              <p className="text-xs text-muted-foreground">
                Admin credentials required
              </p>
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg px-4 py-3 mb-5 text-sm"
              style={{
                background: "oklch(0.62 0.22 25 / 0.12)",
                border: "1px solid oklch(0.62 0.22 25 / 0.3)",
                color: "oklch(0.75 0.18 25)",
              }}
              data-ocid="admin.password_error_state"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter admin password"
                className="wfm-input pr-11 h-12 text-base"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setError("");
                }}
                data-ocid="admin.password_input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !pw}
              className="wfm-btn-primary w-full h-12 text-base flex items-center justify-center gap-2"
              data-ocid="admin.password_submit_button"
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin"
                    style={{ borderColor: "currentColor" }}
                  />
                  Verifying…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Admin Panel
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Default password:{" "}
            <code className="text-primary">webfoo@admin2026</code>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    Pending: "status-badge-pending",
    Processing: "status-badge-processing",
    Shipped: "status-badge-shipped",
    Delivered: "status-badge-delivered",
  };
  return <span className={map[status]}>{status}</span>;
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const orders = getOrders();
  const stores = getStores();
  const customers = getCustomers();
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "oklch(0.72 0.17 213)",
      bg: "oklch(0.72 0.17 213 / 0.1)",
      border: "oklch(0.72 0.17 213 / 0.2)",
      delay: "0ms",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      icon: IndianRupee,
      color: "oklch(0.7 0.18 162)",
      bg: "oklch(0.7 0.18 162 / 0.1)",
      border: "oklch(0.7 0.18 162 / 0.2)",
      delay: "60ms",
    },
    {
      label: "Total Stores",
      value: stores.length,
      icon: Store,
      color: "oklch(0.75 0.18 303)",
      bg: "oklch(0.75 0.18 303 / 0.1)",
      border: "oklch(0.75 0.18 303 / 0.2)",
      delay: "120ms",
    },
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "oklch(0.8 0.18 84)",
      bg: "oklch(0.8 0.18 84 / 0.1)",
      border: "oklch(0.8 0.18 84 / 0.2)",
      delay: "180ms",
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="admin-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, Admin. Here's what's happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border, delay }) => (
          <div
            key={label}
            className="stat-card-animate rounded-xl p-5"
            style={{
              background: bg,
              border: `1px solid ${border}`,
              animationDelay: delay,
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.12 0 0)",
          border: "1px solid oklch(0.22 0 0)",
        }}
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Recent Orders
          </h3>
        </div>
        {recentOrders.length === 0 ? (
          <div
            className="py-10 text-center text-muted-foreground text-sm"
            data-ocid="admin.dashboard_orders_empty_state"
          >
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order, i) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-5 py-3"
                data-ocid={`admin.dashboard_order_item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-primary truncate">
                    {order.id}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.customerName} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <span className="text-sm font-bold text-foreground">
                  {formatPrice(order.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, status } : o));
      saveOrders(updated);
      return updated;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const FILTERS: Array<OrderStatus | "All"> = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];
  const STATUSES: OrderStatus[] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="admin-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Orders</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1.5 flex-wrap mb-5 p-1 rounded-xl"
        style={{
          background: "oklch(0.12 0 0)",
          border: "1px solid oklch(0.22 0 0)",
        }}
        data-ocid="admin.orders_filter.tab"
      >
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              filter === f
                ? {
                    background: "oklch(0.72 0.17 213)",
                    color: "oklch(0.08 0 0)",
                  }
                : {
                    color: "oklch(0.55 0 0)",
                  }
            }
          >
            {f}{" "}
            <span className="opacity-70">
              (
              {f === "All"
                ? orders.length
                : orders.filter((o) => o.status === f).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-3" data-ocid="admin.orders_table">
        {filtered.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground rounded-xl"
            style={{
              background: "oklch(0.12 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
            data-ocid="admin.orders_empty_state"
          >
            No orders found.
          </div>
        )}
        {filtered.map((order, i) => (
          <div
            key={order.id}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: "oklch(0.12 0 0)",
              border: `1px solid ${expanded.has(order.id) ? "oklch(0.72 0.17 213 / 0.3)" : "oklch(0.22 0 0)"}`,
            }}
            data-ocid={`admin.order_row.${i + 1}`}
          >
            {/* Row */}
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-primary text-sm font-bold">
                    {order.id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.customerName} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                  <span className="text-foreground">
                    {formatPrice(order.total)}
                  </span>
                </p>
              </div>

              {/* Status selector */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value as OrderStatus)
                }
                className="text-xs px-2 py-1.5 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring hidden sm:block"
                style={{
                  background: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.28 0 0)",
                }}
                data-ocid={`admin.order_status_select.${i + 1}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => toggleExpand(order.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                style={{ background: "oklch(0.16 0 0)" }}
                aria-expanded={expanded.has(order.id)}
              >
                {expanded.has(order.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Expanded details */}
            {expanded.has(order.id) && (
              <div
                className="px-4 pb-4 pt-0 border-t"
                style={{ borderColor: "oklch(0.22 0 0)" }}
              >
                {/* Mobile status selector */}
                <div className="sm:hidden mb-3 pt-3">
                  <label
                    htmlFor={`order-status-mobile-${order.id}`}
                    className="text-xs text-muted-foreground mb-1 block"
                  >
                    Update Status
                  </label>
                  <select
                    id={`order-status-mobile-${order.id}`}
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="text-xs px-2 py-1.5 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring w-full"
                    style={{
                      background: "oklch(0.16 0 0)",
                      border: "1px solid oklch(0.28 0 0)",
                    }}
                    data-ocid={`admin.order_status_select_mobile.${i + 1}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 mt-3">
                  <p className="text-xs text-muted-foreground">
                    📍 {order.address} · 📞 {order.phone}
                  </p>
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center gap-3 rounded-lg p-2"
                      style={{ background: "oklch(0.09 0 0)" }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-9 h-9 rounded object-cover bg-secondary flex-shrink-0"
                      />
                      <span className="text-sm text-foreground flex-1 truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ×{item.qty}
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Image Upload Helper ──────────────────────────────────────────────────────
function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [preview, setPreview] = useState(value);
  const [mode, setMode] = useState<"url" | "file">("url");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Convert to a stable data URL so it persists after refresh
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <p className="block text-sm font-medium text-foreground mb-2">{label}</p>
      <div
        className="flex gap-1.5 mb-2 p-1 rounded-lg w-fit"
        style={{ background: "oklch(0.1 0 0)" }}
      >
        <button
          type="button"
          onClick={() => setMode("url")}
          className="px-3 py-1 rounded-md text-xs font-medium transition-all"
          style={
            mode === "url"
              ? { background: "oklch(0.72 0.17 213)", color: "oklch(0.08 0 0)" }
              : { color: "oklch(0.55 0 0)" }
          }
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className="px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all"
          style={
            mode === "file"
              ? { background: "oklch(0.72 0.17 213)", color: "oklch(0.08 0 0)" }
              : { color: "oklch(0.55 0 0)" }
          }
          data-ocid="admin.image_upload_button"
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          placeholder="https://..."
          className="wfm-input text-sm"
          value={value}
          onChange={handleUrl}
        />
      ) : (
        <label
          className="flex items-center justify-center gap-2 w-full h-24 rounded-xl cursor-pointer transition-all"
          style={{
            background: "oklch(0.1 0 0)",
            border: "2px dashed oklch(0.28 0 0)",
          }}
          data-ocid="admin.image_dropzone"
        >
          {uploading ? (
            <span className="text-sm text-muted-foreground">Uploading…</span>
          ) : (
            <>
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to select image
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFile}
            data-ocid="admin.store_upload_button"
          />
        </label>
      )}

      {preview && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={preview}
            alt="preview"
            className="w-20 h-14 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onChange("");
            }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Manage Stores Tab ────────────────────────────────────────────────────────
function ManageStoresTab() {
  const [stores, setStores] = useState<StoreType[]>(() => getStores());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => setStores(getStores()), []);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", imageUrl: "" });
    setShowForm(true);
  };

  const openEdit = (store: StoreType) => {
    setEditId(store.id);
    setForm({ name: store.name, imageUrl: store.imageUrl });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      const updated = stores.map((s) =>
        s.id === editId
          ? { ...s, name: form.name, imageUrl: form.imageUrl }
          : s,
      );
      saveStores(updated);
    } else {
      const newStore: StoreType = {
        id: generateId("s"),
        name: form.name,
        imageUrl:
          form.imageUrl ||
          `https://picsum.photos/seed/${form.name.toLowerCase().replace(/\s+/g, "")}/400/300`,
        createdAt: new Date().toISOString(),
      };
      saveStores([...stores, newStore]);
    }
    refresh();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = stores.filter((s) => s.id !== id);
    saveStores(updated);
    setStores(updated);
    setDeleteId(null);
  };

  return (
    <div className="admin-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manage Stores</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stores.length} store{stores.length !== 1 ? "s" : ""} active
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="wfm-btn-primary flex items-center gap-1.5 text-sm px-4 py-2"
          data-ocid="admin.add_store_button"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.72 0.17 213 / 0.25)",
          }}
        >
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            {editId ? "Edit Store" : "New Store"}
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="store-form-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Store Name
              </label>
              <input
                id="store-form-name"
                type="text"
                className="wfm-input"
                placeholder="e.g., Bakery"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="admin.store_form_name_input"
              />
            </div>
            <ImageUploadField
              label="Store Image"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="wfm-btn-primary flex items-center gap-1.5 text-sm px-4 py-2"
                data-ocid="admin.store_form_save_button"
              >
                <Save className="w-3.5 h-3.5" />
                {editId ? "Update Store" : "Create Store"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="wfm-btn-secondary flex items-center gap-1.5 text-sm px-4 py-2"
                data-ocid="admin.store_form_cancel_button"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            background: "oklch(0.62 0.22 25 / 0.08)",
            border: "1px solid oklch(0.62 0.22 25 / 0.3)",
          }}
        >
          <p className="text-sm text-foreground mb-3">
            Delete &quot;{stores.find((s) => s.id === deleteId)?.name}&quot;?
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDelete(deleteId)}
              className="text-sm px-4 py-2 rounded-lg font-semibold"
              style={{
                background: "oklch(0.62 0.22 25)",
                color: "oklch(0.97 0 0)",
              }}
              data-ocid="admin.store_delete_confirm_button"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="wfm-btn-secondary text-sm px-4 py-2"
              data-ocid="admin.store_delete_cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Store Card Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="admin.stores_list"
      >
        {stores.map((store, i) => (
          <div
            key={store.id}
            className="rounded-xl overflow-hidden group"
            style={{
              background: "oklch(0.12 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
            data-ocid={`admin.store_item.${i + 1}`}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={store.imageUrl}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground truncate flex-1">
                {store.name}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(store)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  style={{ background: "oklch(0.16 0 0)" }}
                  data-ocid={`admin.store_edit_button.${i + 1}`}
                  title="Edit store"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(store.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  style={{ background: "oklch(0.16 0 0)" }}
                  data-ocid={`admin.store_delete_button.${i + 1}`}
                  title="Delete store"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Manage Products Tab ──────────────────────────────────────────────────────
function ManageProductsTab() {
  const stores = getStores();
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id ?? "");
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    inStock: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const storeProducts = products.filter((p) => p.storeId === selectedStoreId);

  const refresh = useCallback(() => setProducts(getProducts()), []);

  const openAdd = () => {
    setEditId(null);
    setForm({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      inStock: true,
    });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      imageUrl: p.imageUrl,
      inStock: p.inStock,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price)) return;

    if (editId) {
      const updated = products.map((p) =>
        p.id === editId
          ? {
              ...p,
              name: form.name,
              price,
              description: form.description,
              imageUrl: form.imageUrl,
              inStock: form.inStock,
            }
          : p,
      );
      saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: generateId("p"),
        storeId: selectedStoreId,
        name: form.name,
        price,
        description: form.description,
        imageUrl:
          form.imageUrl ||
          `https://picsum.photos/seed/${form.name.toLowerCase().replace(/\s+/g, "")}/300/300`,
        inStock: form.inStock,
        reviews: [],
      };
      saveProducts([...products, newProduct]);
    }
    refresh();
    setShowForm(false);
  };

  const toggleStock = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, inStock: !p.inStock } : p,
    );
    saveProducts(updated);
    setProducts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
    setDeleteId(null);
  };

  return (
    <div className="admin-fade-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manage Products</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {storeProducts.length} product
            {storeProducts.length !== 1 ? "s" : ""} in selected store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStoreId}
            onChange={(e) => {
              setSelectedStoreId(e.target.value);
              setShowForm(false);
            }}
            className="text-sm px-3 py-2 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.28 0 0)",
            }}
            data-ocid="admin.products_store_select"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openAdd}
            className="wfm-btn-primary flex items-center gap-1.5 text-sm px-4 py-2"
            data-ocid="admin.add_product_button"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.72 0.17 213 / 0.25)",
          }}
        >
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            {editId ? "Edit Product" : "New Product"}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="product-form-name"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Product Name
                </label>
                <input
                  id="product-form-name"
                  type="text"
                  className="wfm-input"
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="admin.product_form_name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="product-form-price"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Price (₹)
                </label>
                <input
                  id="product-form-price"
                  type="number"
                  className="wfm-input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  data-ocid="admin.product_form_price_input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="product-form-desc"
                className="block text-xs font-medium text-foreground mb-1.5"
              >
                Description
              </label>
              <textarea
                id="product-form-desc"
                rows={2}
                className="wfm-input resize-none"
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="admin.product_form_desc_textarea"
              />
            </div>
            <ImageUploadField
              label="Product Image"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, inStock: !p.inStock }))}
                className="relative inline-flex w-10 h-5.5 rounded-full transition-colors flex-shrink-0"
                style={{
                  background: form.inStock
                    ? "oklch(0.72 0.17 213)"
                    : "oklch(0.22 0 0)",
                  minWidth: "40px",
                  height: "22px",
                }}
                data-ocid="admin.product_form_instock_toggle"
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{
                    transform: form.inStock
                      ? "translateX(18px)"
                      : "translateX(0)",
                  }}
                />
              </button>
              <span className="text-sm text-foreground">
                {form.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="wfm-btn-primary flex items-center gap-1.5 text-sm px-4 py-2"
                data-ocid="admin.product_form_save_button"
              >
                <Save className="w-3.5 h-3.5" />
                {editId ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="wfm-btn-secondary text-sm px-4 py-2"
                data-ocid="admin.product_form_cancel_button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            background: "oklch(0.62 0.22 25 / 0.08)",
            border: "1px solid oklch(0.62 0.22 25 / 0.3)",
          }}
        >
          <p className="text-sm text-foreground mb-3">
            Delete &quot;{products.find((p) => p.id === deleteId)?.name}&quot;?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDelete(deleteId)}
              className="text-sm px-4 py-2 rounded-lg font-semibold"
              style={{
                background: "oklch(0.62 0.22 25)",
                color: "oklch(0.97 0 0)",
              }}
              data-ocid="admin.product_delete_confirm_button"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="wfm-btn-secondary text-sm px-4 py-2"
              data-ocid="admin.product_delete_cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {storeProducts.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl text-muted-foreground"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
          }}
          data-ocid="admin.products_list_empty_state"
        >
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No products in this store yet.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="admin.products_list"
        >
          {storeProducts.map((product, i) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
              }}
              data-ocid={`admin.product_item.${i + 1}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.62 0.22 25 / 0.9)",
                        color: "oklch(0.97 0 0)",
                      }}
                    >
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-foreground truncate mb-0.5">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-primary mb-2">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center justify-between">
                  {/* Stock toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStock(product.id)}
                    className="relative inline-flex rounded-full transition-colors flex-shrink-0"
                    style={{
                      background: product.inStock
                        ? "oklch(0.72 0.17 213)"
                        : "oklch(0.22 0 0)",
                      minWidth: "32px",
                      height: "18px",
                    }}
                    data-ocid={`admin.product_stock_toggle.${i + 1}`}
                    title={
                      product.inStock ? "Mark Out of Stock" : "Mark In Stock"
                    }
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform"
                      style={{
                        transform: product.inStock
                          ? "translateX(14px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      style={{ background: "oklch(0.16 0 0)" }}
                      data-ocid={`admin.product_edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(product.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                      style={{ background: "oklch(0.16 0 0)" }}
                      data-ocid={`admin.product_delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────
function CustomersTab() {
  const customers = getCustomers();
  const orders = getOrders();
  const [showPw, setShowPw] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const togglePw = (id: string) => {
    setShowPw((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="admin-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Customers</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {customers.length} registered customer
          {customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3" data-ocid="admin.customers_table">
        {customers.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground rounded-xl"
            style={{
              background: "oklch(0.12 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
            data-ocid="admin.customers_empty_state"
          >
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No customers registered.</p>
          </div>
        )}
        {customers.map((customer, i) => {
          const customerOrders = orders.filter(
            (o) => o.customerId === customer.id,
          );
          const totalSpent = customerOrders.reduce((s, o) => s + o.total, 0);

          return (
            <div
              key={customer.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: "oklch(0.12 0 0)",
                border: `1px solid ${expanded.has(customer.id) ? "oklch(0.72 0.17 213 / 0.3)" : "oklch(0.22 0 0)"}`,
              }}
              data-ocid={`admin.customer_row.${i + 1}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "oklch(0.72 0.17 213 / 0.15)",
                    color: "oklch(0.72 0.17 213)",
                    border: "1px solid oklch(0.72 0.17 213 / 0.25)",
                  }}
                >
                  {customer.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📱 {customer.mobile} · {customerOrders.length} order
                    {customerOrders.length !== 1 ? "s" : ""} ·{" "}
                    {formatPrice(totalSpent)} spent
                  </p>
                </div>

                {/* Password */}
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    {showPw.has(customer.id)
                      ? customer.password
                      : "•".repeat(Math.min(customer.password.length, 8))}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePw(customer.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid={`admin.customer_password_toggle.${i + 1}`}
                    aria-label="Toggle password visibility"
                  >
                    {showPw.has(customer.id) ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(customer.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                  style={{ background: "oklch(0.16 0 0)" }}
                  aria-expanded={expanded.has(customer.id)}
                >
                  {expanded.has(customer.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded orders */}
              {expanded.has(customer.id) && (
                <div
                  className="px-4 pb-4 border-t"
                  style={{ borderColor: "oklch(0.22 0 0)" }}
                >
                  {/* Mobile password */}
                  <div className="sm:hidden flex items-center gap-1.5 pt-3 mb-3">
                    <span className="text-xs text-muted-foreground">
                      Password:
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {showPw.has(customer.id)
                        ? customer.password
                        : "•".repeat(Math.min(customer.password.length, 8))}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePw(customer.id)}
                      className="text-muted-foreground"
                      data-ocid={`admin.customer_password_toggle_mobile.${i + 1}`}
                    >
                      {showPw.has(customer.id) ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {customer.address && (
                    <p className="text-xs text-muted-foreground pt-3 mb-3">
                      📍 {customer.address}
                    </p>
                  )}
                  {customerOrders.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {customerOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-3 text-xs rounded-lg p-2"
                          style={{ background: "oklch(0.09 0 0)" }}
                        >
                          <span className="font-mono text-primary">
                            {order.id}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                          <span className="text-foreground">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </span>
                          <span className="text-primary font-bold">
                            {formatPrice(order.total)}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin Dashboard (Command Center) ────────────────────────────────────────
type Tab = "dashboard" | "orders" | "stores" | "products" | "customers";

const TAB_CONFIG: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "stores", label: "Stores", icon: Store },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
];

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.reload();
  };

  const currentTab = TAB_CONFIG.find((t) => t.id === tab);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0 0)" }}>
      {/* Top Command Bar */}
      <header
        className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6"
        style={{
          height: "60px",
          background: "oklch(0.10 0 0 / 0.9)",
          borderBottom: "1px solid oklch(0.20 0 0)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <WFLogo size="sm" showLabel={false} />
          <div className="hidden md:block">
            <p className="text-xs font-bold text-foreground leading-tight">
              WebFoo Mart
            </p>
            <p
              className="text-[10px] uppercase tracking-wider leading-tight"
              style={{ color: "oklch(0.72 0.17 213 / 0.8)" }}
            >
              Admin
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block w-px h-6 flex-shrink-0"
          style={{ background: "oklch(0.22 0 0)" }}
        />

        {/* Tab Navigation (desktop) */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                tab === id
                  ? {
                      background: "oklch(0.72 0.17 213 / 0.15)",
                      color: "oklch(0.72 0.17 213)",
                      border: "1px solid oklch(0.72 0.17 213 / 0.3)",
                    }
                  : {
                      color: "oklch(0.55 0 0)",
                      border: "1px solid transparent",
                    }
              }
              data-ocid={`admin.${id}_tab`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile tab label */}
        <div className="md:hidden flex-1 flex items-center gap-2">
          {currentTab && (
            <>
              <currentTab.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {currentTab.label}
              </span>
            </>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "oklch(0.14 0 0)" }}
            aria-label="Open menu"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "oklch(0.14 0 0)" }}
            data-ocid="admin.logout_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-20 w-full h-full border-0 p-0"
            style={{ background: "oklch(0 0 0 / 0.5)" }}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div
            className="fixed top-[60px] left-0 right-0 z-30 mx-4 mt-2 rounded-xl overflow-hidden"
            style={{
              background: "oklch(0.13 0 0)",
              border: "1px solid oklch(0.22 0 0)",
              boxShadow: "0 16px 40px oklch(0 0 0 / 0.5)",
            }}
          >
            {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setTab(id);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left"
                style={
                  tab === id
                    ? {
                        color: "oklch(0.72 0.17 213)",
                        background: "oklch(0.72 0.17 213 / 0.08)",
                      }
                    : { color: "oklch(0.65 0 0)" }
                }
                data-ocid={`admin.${id}_mobile_tab`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid oklch(0.22 0 0)" }}>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left"
                style={{ color: "oklch(0.65 0.18 25)" }}
                data-ocid="admin.logout_mobile_button"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 page-enter">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "stores" && <ManageStoresTab />}
        {tab === "products" && <ManageProductsTab />}
        {tab === "customers" && <CustomersTab />}
      </main>
    </div>
  );
}

// ─── Admin Page (entry) ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(ADMIN_AUTH_KEY) === "1",
  );

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
