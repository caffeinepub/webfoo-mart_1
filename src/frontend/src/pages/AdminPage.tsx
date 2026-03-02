import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  EyeOff,
  Lock,
  Package,
  Plus,
  Save,
  ShoppingBag,
  Store,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
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

// ─── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      onAuth();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <WFLogo size="md" showLabel={true} />
        </div>
        <div className="wfm-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Admin Access</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Enter the admin password to continue.
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Admin password"
                className="wfm-input pr-9"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setError("");
                }}
                data-ocid="admin.password_input"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              className="wfm-btn-primary w-full h-11"
              data-ocid="admin.password_submit_button"
            >
              Unlock Admin Panel
            </button>
          </form>
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
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Orders</h2>

      {/* Filter Tabs */}
      <div
        className="flex gap-1.5 flex-wrap mb-5"
        data-ocid="admin.orders_filter.tab"
      >
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}{" "}
            {f === "All"
              ? `(${orders.length})`
              : `(${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border border-border overflow-hidden"
        data-ocid="admin.orders_table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left">
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Order ID
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Customer
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Items
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Total
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Address
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
              {filtered.map((order, i) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="bg-card hover:bg-secondary/50 transition-colors"
                    data-ocid={`admin.order_row.${i + 1}`}
                  >
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-primary text-xs">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-foreground text-xs">
                        {order.customerName}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                        {expanded.has(order.id) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-primary text-xs">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 max-w-[180px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {order.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.phone}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-secondary border border-border rounded text-xs px-1.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        data-ocid={`admin.order_status_select.${i + 1}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded.has(order.id) && (
                    <tr className="bg-background">
                      <td colSpan={6} className="px-4 py-2.5">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={`${order.id}-${item.productId}`}
                              className="flex items-center gap-3 text-xs"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover bg-secondary"
                              />
                              <span className="text-foreground">
                                {item.name}
                              </span>
                              <span className="text-muted-foreground">
                                ×{item.qty}
                              </span>
                              <span className="text-primary">
                                {formatPrice(item.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(url);
  };

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  const inputId = `img-upload-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <p className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </p>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-2 py-1 rounded text-xs ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${mode === "file" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
          data-ocid="admin.store_upload_button"
        >
          <Upload className="w-3 h-3" /> File
        </button>
      </div>
      {mode === "url" ? (
        <input
          id={inputId}
          type="url"
          placeholder="https://..."
          className="wfm-input text-sm"
          value={value}
          onChange={handleUrl}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          className="wfm-input text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/20 file:text-primary file:text-xs cursor-pointer"
          onChange={handleFile}
          data-ocid="admin.store_upload_button"
        />
      )}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-2 w-24 h-16 object-cover rounded border border-border"
        />
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Manage Stores</h2>
        <button
          type="button"
          onClick={openAdd}
          className="wfm-btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
          data-ocid="admin.add_store_button"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="wfm-card p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {editId ? "Edit Store" : "New Store"}
          </h3>
          <div className="space-y-3">
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
                className="wfm-input text-sm"
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
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="wfm-btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
                data-ocid="admin.store_form_save_button"
              >
                <Save className="w-3.5 h-3.5" />
                {editId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="wfm-btn-secondary flex items-center gap-1.5 text-sm px-3 py-2"
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
        <div className="wfm-card p-4 mb-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm text-foreground mb-3">
            Delete &quot;{stores.find((s) => s.id === deleteId)?.name}&quot;?
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground text-sm px-3 py-1.5 rounded-md"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="wfm-btn-secondary text-sm px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2" data-ocid="admin.stores_list">
        {stores.map((store, i) => (
          <div
            key={store.id}
            className="wfm-card p-3 flex items-center gap-3"
            data-ocid={`admin.store_item.${i + 1}`}
          >
            <img
              src={store.imageUrl}
              alt={store.name}
              className="w-12 h-9 object-cover rounded"
            />
            <span className="flex-1 text-sm font-medium text-foreground">
              {store.name}
            </span>
            <button
              type="button"
              onClick={() => openEdit(store)}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              data-ocid={`admin.store_edit_button.${i + 1}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(store.id)}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              data-ocid={`admin.store_delete_button.${i + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
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
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-foreground">Manage Products</h2>
        <div className="flex items-center gap-3">
          <select
            value={selectedStoreId}
            onChange={(e) => {
              setSelectedStoreId(e.target.value);
              setShowForm(false);
            }}
            className="bg-secondary border border-border rounded text-sm px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
            className="wfm-btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
            data-ocid="admin.add_product_button"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="wfm-card p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {editId ? "Edit Product" : "New Product"}
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="product-form-name"
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  Name
                </label>
                <input
                  id="product-form-name"
                  type="text"
                  className="wfm-input text-sm"
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
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  Price (₹)
                </label>
                <input
                  id="product-form-price"
                  type="number"
                  className="wfm-input text-sm"
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
                className="block text-xs font-medium text-foreground mb-1"
              >
                Description
              </label>
              <textarea
                id="product-form-desc"
                rows={2}
                className="wfm-input text-sm resize-none"
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <ImageUploadField
              label="Product Image"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, inStock: !p.inStock }))}
                className={`relative inline-flex w-9 h-5 rounded-full transition-colors ${form.inStock ? "bg-primary" : "bg-secondary border border-border"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.inStock ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
              <span className="text-sm text-foreground">
                {form.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="wfm-btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
                data-ocid="admin.product_form_save_button"
              >
                <Save className="w-3.5 h-3.5" />
                {editId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="wfm-btn-secondary text-sm px-3 py-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <div className="wfm-card p-4 mb-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm text-foreground mb-3">
            Delete &quot;{products.find((p) => p.id === deleteId)?.name}&quot;?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground text-sm px-3 py-1.5 rounded-md"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="wfm-btn-secondary text-sm px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {storeProducts.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="admin.products_list_empty_state"
        >
          No products in this store yet.
        </div>
      ) : (
        <div className="space-y-2" data-ocid="admin.products_list">
          {storeProducts.map((product, i) => (
            <div
              key={product.id}
              className="wfm-card p-3 flex items-center gap-3"
              data-ocid={`admin.product_item.${i + 1}`}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </p>
                <p className="text-xs text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
              {/* Stock Toggle */}
              <button
                type="button"
                onClick={() => toggleStock(product.id)}
                className={`relative inline-flex w-8 h-4.5 rounded-full transition-colors flex-shrink-0 ${product.inStock ? "bg-primary" : "bg-secondary border border-border"}`}
                style={{ minWidth: "32px", height: "18px" }}
                data-ocid={`admin.product_stock_toggle.${i + 1}`}
                title={product.inStock ? "Mark Out of Stock" : "Mark In Stock"}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${product.inStock ? "translate-x-3.5" : "translate-x-0"}`}
                />
              </button>
              <button
                type="button"
                onClick={() => openEdit(product)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(product.id)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                data-ocid={`admin.product_delete_button.${i + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Customers</h2>

      <div
        className="rounded-lg border border-border overflow-hidden"
        data-ocid="admin.customers_table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left">
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  #
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Name
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Mobile
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Password
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No customers registered.
                  </td>
                </tr>
              )}
              {customers.map((customer, i) => {
                const customerOrders = orders.filter(
                  (o) => o.customerId === customer.id,
                );
                return (
                  <React.Fragment key={customer.id}>
                    <tr
                      className="bg-card hover:bg-secondary/50 transition-colors"
                      data-ocid={`admin.customer_row.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-foreground text-xs">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {customer.address || "—"}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-foreground">
                        {customer.mobile}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono text-muted-foreground">
                            {showPw.has(customer.id)
                              ? customer.password
                              : "•".repeat(customer.password.length)}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePw(customer.id)}
                            className="text-muted-foreground hover:text-foreground"
                            data-ocid={`admin.customer_password_toggle.${i + 1}`}
                          >
                            {showPw.has(customer.id) ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => toggleExpand(customer.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {customerOrders.length} order
                          {customerOrders.length !== 1 ? "s" : ""}
                          {expanded.has(customer.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expanded.has(customer.id) && (
                      <tr className="bg-background">
                        <td colSpan={5} className="px-4 py-2.5">
                          {customerOrders.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No orders yet.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {customerOrders.map((order) => (
                                <div
                                  key={order.id}
                                  className="flex items-center gap-3 text-xs border border-border rounded p-2"
                                >
                                  <span className="font-mono text-primary">
                                    {order.id}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("en-IN")}
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
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
type Tab = "orders" | "stores" | "products" | "customers";

const TAB_CONFIG: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "stores", label: "Manage Stores", icon: Store },
  { id: "products", label: "Manage Products", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
];

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-56 bg-sidebar border-r border-sidebar-border flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex
      `}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-sidebar-border flex items-center gap-2">
          <WFLogo size="sm" showLabel={false} />
          <div>
            <p className="text-xs font-bold text-foreground">WebFoo Mart</p>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              }`}
              data-ocid={`admin.${id}_tab`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-background/50 md:hidden w-full h-full border-0 p-0"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Menu"
            >
              <title>Menu</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-sm font-bold text-foreground">
            {TAB_CONFIG.find((t) => t.id === tab)?.label}
          </span>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {tab === "orders" && <OrdersTab />}
          {tab === "stores" && <ManageStoresTab />}
          {tab === "products" && <ManageProductsTab />}
          {tab === "customers" && <CustomersTab />}
        </main>
      </div>
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
