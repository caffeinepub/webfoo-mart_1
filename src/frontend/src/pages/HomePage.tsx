import { Search, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/shared/ProductCard";
import StoreCard from "../components/shared/StoreCard";
import WFLogo from "../components/shared/WFLogo";
import { getProducts, getStores } from "../data/seed";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const stores = useMemo(() => getStores(), []);
  const products = useMemo(() => getProducts(), []);

  const filteredStores = useMemo(() => {
    if (!query.trim()) return stores;
    const q = query.toLowerCase();
    return stores.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, stores]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, products]);

  const isSearching = query.trim().length > 0;

  return (
    <main className="min-h-screen pb-20 page-enter">
      {/* Hero */}
      <section className="flex flex-col items-center pt-10 pb-8 px-4">
        <div className="logo-float">
          <WFLogo size="lg" showLabel={false} />
        </div>
        <p className="mt-3 text-muted-foreground text-sm text-center max-w-xs">
          Shop from 12 curated stores — fresh, fast, and delivered to your door
        </p>

        {/* Search */}
        <div className="relative w-full max-w-md mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search stores or products..."
            className="wfm-input pl-9 pr-9 h-11 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-ocid="home.search_input"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* Search Results */}
      {isSearching && (
        <section className="max-w-6xl mx-auto px-4 mb-8">
          {filteredStores.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Matching Stores ({filteredStores.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredStores.map((store, i) => (
                  <StoreCard key={store.id} store={store} index={i + 1} />
                ))}
              </div>
            </div>
          )}
          {filteredProducts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Matching Products ({filteredProducts.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i + 1}
                  />
                ))}
              </div>
            </div>
          )}
          {filteredStores.length === 0 && filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No results for "{query}"</p>
            </div>
          )}
        </section>
      )}

      {/* Stores Grid */}
      {!isSearching && (
        <section className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold mb-4 shimmer-text">Our Stores</h2>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            data-ocid="home.stores_list"
          >
            {stores.map((store, i) => (
              <div
                key={store.id}
                className={`card-reveal stagger-${(i % 6) + 1}`}
              >
                <StoreCard store={store} index={i + 1} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
