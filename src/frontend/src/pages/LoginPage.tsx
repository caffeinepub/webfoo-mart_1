import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import WFLogo from "../components/shared/WFLogo";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login, customer } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") ?? "/";

  const [form, setForm] = useState({ mobile: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  if (customer) {
    navigate(returnUrl, { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.mobile.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const success = login(form.mobile, form.password);
    if (success) {
      navigate(returnUrl, { replace: true });
    } else {
      setError("Invalid mobile number or password.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <WFLogo size="md" showLabel={true} />
        </div>

        <div className="wfm-card p-6">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to your account
          </p>

          {error && (
            <div
              className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-3 py-2 mb-4"
              data-ocid="login.error_state"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-mobile"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="wfm-input pl-9"
                  value={form.mobile}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, mobile: e.target.value }));
                    setError("");
                  }}
                  data-ocid="login.mobile_input"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  className="wfm-input pl-9 pr-9"
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    setError("");
                  }}
                  data-ocid="login.password_input"
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              className="wfm-btn-primary w-full h-11 mt-2"
              data-ocid="login.submit_button"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
              data-ocid="login.register_link"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-card/50 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground text-center">
          <span className="font-medium text-foreground">Demo:</span> Mobile{" "}
          <code className="text-primary">9999999999</code> / Password{" "}
          <code className="text-primary">demo123</code>
        </div>
      </div>
    </main>
  );
}
