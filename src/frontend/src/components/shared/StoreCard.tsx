import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Store } from "../../data/seed";

interface StoreCardProps {
  store: Store;
  index: number;
}

export default function StoreCard({ store, index }: StoreCardProps) {
  const [popping, setPopping] = useState(false);

  return (
    <Link
      to={`/store/${store.id}`}
      className={`group block wfm-card hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 ${popping ? "card-pop-active" : ""}`}
      data-ocid={`home.store_card.${index}`}
      onMouseDown={() => setPopping(true)}
      onAnimationEnd={() => setPopping(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={store.imageUrl}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>
      {/* Name */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {store.name}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}
