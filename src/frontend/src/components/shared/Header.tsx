import { LogOut, ShoppingCart, User } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import WFLogo from "./WFLogo";

export default function Header() {
  const { customer, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="nav.home_link"
        >
          <WFLogo size="sm" showLabel={true} />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-secondary transition-colors"
            data-ocid="nav.cart_link"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {customer ? (
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                data-ocid="nav.account_link"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">
                  {customer.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-secondary transition-colors"
                title="Logout"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="wfm-btn-primary text-sm px-3 py-1.5"
              data-ocid="nav.login_link"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
