import { Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WFLogo from "../components/shared/WFLogo";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const { register, customer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (customer) {
    navigate("/", { replace: true });
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^\d{10}$/.test(form.mobile))
      errs.mobile = "Enter a valid 10-digit mobile number";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const success = register(form.name, form.mobile, form.password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      setErrors({ mobile: "This mobile number is already registered" });
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    },
  });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <WFLogo size="md" showLabel={false} />
        </div>

        <div className="wfm-card p-6">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Join WebFoo Mart today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Your full name"
                  className={`wfm-input pl-9 ${errors.name ? "border-destructive" : ""}`}
                  data-ocid="register.name_input"
                  autoComplete="name"
                  {...field("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="reg-mobile"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`wfm-input pl-9 ${errors.mobile ? "border-destructive" : ""}`}
                  data-ocid="register.mobile_input"
                  autoComplete="tel"
                  {...field("mobile")}
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-destructive mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={`wfm-input pl-9 pr-9 ${errors.password ? "border-destructive" : ""}`}
                  data-ocid="register.password_input"
                  autoComplete="new-password"
                  {...field("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-confirm-password"
                  type={showCpw ? "text" : "password"}
                  placeholder="Repeat your password"
                  className={`wfm-input pl-9 pr-9 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  data-ocid="register.confirm_password_input"
                  autoComplete="new-password"
                  {...field("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCpw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCpw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="wfm-btn-primary w-full h-11 mt-2"
              data-ocid="register.submit_button"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
              data-ocid="register.login_link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
