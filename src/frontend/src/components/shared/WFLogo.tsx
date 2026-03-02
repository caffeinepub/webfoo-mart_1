import React from "react";

interface WFLogoProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  sm: { img: 36, label: "text-sm" },
  md: { img: 56, label: "text-base" },
  lg: { img: 88, label: "text-xl" },
} as const;

export default function WFLogo({
  size = "md",
  showLabel = false,
  className = "",
}: WFLogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/uploads/cropped_circle_image-1.png"
        alt="WebFoo Mart Logo"
        width={s.img}
        height={s.img}
        style={{
          width: s.img,
          height: s.img,
          objectFit: "contain",
          borderRadius: "50%",
        }}
      />
      {showLabel && (
        <span
          className={`font-bold tracking-tight ${s.label}`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          WebFoo Mart
        </span>
      )}
    </div>
  );
}
