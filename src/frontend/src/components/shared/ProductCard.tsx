import React from "react";
import { Link } from "react-router-dom";
import { type Product, formatPrice } from "../../data/seed";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block wfm-card hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5"
      data-ocid={`store.product_card.${index}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <p className="mt-1.5 text-base font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
