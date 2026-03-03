import { ChevronLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { formatPrice, getProducts, getStores } from "../data/seed";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const products = useMemo(() => getProducts(), []);
  const stores = useMemo(() => getStores(), []);

  const product = products.find((p) => p.id === productId);
  const store = product
    ? stores.find((s) => s.id === product.storeId)
    : undefined;

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found.</p>
          <Link to="/" className="wfm-btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    navigate("/cart");
  };

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <main className="min-h-screen pb-24 page-enter">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          {store && (
            <>
              <Link
                to={`/store/${store.id}`}
                className="hover:text-foreground transition-colors"
              >
                {store.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {!product.inStock && (
              <div className="absolute top-3 left-3">
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({product.reviews.length} review
                  {product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                incl. all taxes
              </span>
            </div>

            {/* Stock status */}
            <div className="mt-3">
              {product.inStock ? (
                <span className="text-xs font-medium text-emerald-400">
                  ✓ In Stock
                </span>
              ) : (
                <span className="text-xs font-medium text-destructive">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Qty:
              </span>
              <div className="flex items-center border border-border rounded-md">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors rounded-l-md disabled:opacity-50"
                  disabled={qty <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number.parseInt(e.target.value) || 1))
                  }
                  className="w-12 h-8 text-center text-sm bg-transparent border-x border-border focus:outline-none"
                  data-ocid="product.qty_input"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors rounded-r-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="wfm-btn-secondary flex items-center justify-center gap-2 flex-1 h-11"
                data-ocid="product.add_to_cart_button"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="wfm-btn-primary flex-1 h-11"
                data-ocid="product.buy_now_button"
              >
                Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                Description
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-10" data-ocid="product.reviews_list">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Customer Reviews
            {product.reviews.length > 0 && (
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({product.reviews.length})
              </span>
            )}
          </h2>

          {product.reviews.length === 0 ? (
            <div className="bg-card border border-border rounded-lg px-6 py-8 text-center text-muted-foreground">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {product.reviews.map((review) => (
                <div
                  key={`${review.author}-${review.date}`}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {review.author}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {review.date}
                    </time>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
