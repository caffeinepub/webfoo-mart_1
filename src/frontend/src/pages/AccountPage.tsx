import { Edit3, MapPin, Phone, Save, User, X } from "lucide-react";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { customer, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name ?? "",
    address: customer?.address ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!customer) return <Navigate to="/login?returnUrl=/account" replace />;

  const handleEdit = () => {
    setForm({ name: customer.name, address: customer.address });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    updateProfile({ name: form.name.trim(), address: form.address.trim() });
    setEditing(false);
    setErrors({});
    toast.success("Profile updated successfully");
  };

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">My Account</h1>

        <div className="wfm-card p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {customer.name}
              </h2>
              <p className="text-sm text-muted-foreground">Customer</p>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="ml-auto wfm-btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                data-ocid="account.edit_button"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {editing ? (
            /* Edit Form */
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="account-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="account-name"
                  type="text"
                  className={`wfm-input ${errors.name ? "border-destructive" : ""}`}
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  data-ocid="account.name_input"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="account-address"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Delivery Address
                </label>
                <textarea
                  id="account-address"
                  rows={3}
                  className="wfm-input resize-none"
                  placeholder="Your delivery address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  data-ocid="account.address_input"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="wfm-btn-primary flex items-center gap-2 flex-1 h-10 justify-center"
                  data-ocid="account.save_button"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="wfm-btn-secondary flex items-center gap-2 px-4 h-10 justify-center"
                  data-ocid="account.cancel_button"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {customer.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Mobile Number</p>
                  <p className="text-sm font-medium text-foreground">
                    {customer.mobile}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Address
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {customer.address || (
                      <span className="text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
