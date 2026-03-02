import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Customer,
  STORAGE_KEYS,
  generateId,
  getCustomers,
  saveCustomers,
} from "../data/seed";

interface AuthContextValue {
  customer: Customer | null;
  login: (mobile: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, mobile: string, password: string) => boolean;
  updateProfile: (
    data: Partial<Pick<Customer, "name" | "address" | "mobile">>,
  ) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): Customer | null {
  try {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.session);
    if (!sessionId) return null;
    const customers = getCustomers();
    return customers.find((c) => c.id === sessionId) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() =>
    loadSession(),
  );

  const login = useCallback((mobile: string, password: string): boolean => {
    const customers = getCustomers();
    const found = customers.find(
      (c) => c.mobile === mobile && c.password === password,
    );
    if (found) {
      sessionStorage.setItem(STORAGE_KEYS.session, found.id);
      setCustomer(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.session);
    sessionStorage.removeItem(STORAGE_KEYS.cart);
    setCustomer(null);
  }, []);

  const register = useCallback(
    (name: string, mobile: string, password: string): boolean => {
      const customers = getCustomers();
      if (customers.some((c) => c.mobile === mobile)) return false;
      const newCustomer: Customer = {
        id: generateId("c"),
        name,
        mobile,
        password,
        address: "",
      };
      saveCustomers([...customers, newCustomer]);
      sessionStorage.setItem(STORAGE_KEYS.session, newCustomer.id);
      setCustomer(newCustomer);
      return true;
    },
    [],
  );

  const updateProfile = useCallback(
    (data: Partial<Pick<Customer, "name" | "address" | "mobile">>) => {
      setCustomer((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...data };
        const customers = getCustomers();
        const idx = customers.findIndex((c) => c.id === prev.id);
        if (idx !== -1) {
          customers[idx] = updated;
          saveCustomers(customers);
        }
        return updated;
      });
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ customer, login, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
