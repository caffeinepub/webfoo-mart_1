import { ChevronLeft } from "lucide-react";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/shared/ProductCard";
import { getProducts, getStores } from "../data/seed";

export default function StorePage() {
  const { storeId } = useParams<{ storeId: string }>();

  const stores = useMemo(() => getStores(), []);
  const products = useMemo(() => getProducts(), []);

  const store = stores.find((s) => s.id === storeId);
  const storeProducts = products.filter((p) => p.storeId === storeId);

  if (!store) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Store not found.</p>
          <Link to="/" className="wfm-btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 page-enter">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={store.imageUrl}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-2"
            data-ocid="store.back_link"
          >
            <ChevronLeft className="w-4 h-4" />
            All Stores
          </Link>
          <h1 className="text-2xl font-bold text-white">{store.name}</h1>
          <p className="text-sm text-white/70 mt-0.5">
            {storeProducts.length} product
            {storeProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        {storeProducts.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="store.product_list_empty_state"
          >
            <p>No products available in this store yet.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            data-ocid="store.product_list"
          >
            {storeProducts.map((product, i) => (
              <div
                key={product.id}
                className={`card-reveal stagger-${(i % 6) + 1}`}
              >
                <ProductCard product={product} index={i + 1} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
