import React from "react";

interface WFLogoProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  sm: { circle: 36, text: 14, label: "text-sm" },
  md: { circle: 56, text: 22, label: "text-base" },
  lg: { circle: 88, text: 34, label: "text-xl" },
} as const;

export default function WFLogo({
  size = "md",
  showLabel = true,
  className = "",
}: WFLogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <svg
        width={s.circle}
        height={s.circle}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="WebFoo Mart Logo"
      >
        <title>WebFoo Mart Logo</title>
        <circle cx="50" cy="50" r="50" fill="#06B6D4" />
        <circle cx="50" cy="50" r="44" fill="#06B6D4" />
        {/* Subtle inner ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={s.text}
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-1"
        >
          WF
        </text>
      </svg>
      {showLabel && (
        <span
          className={`font-bold tracking-tight text-white ${s.label}`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          WebFoo Mart
        </span>
      )}
    </div>
  );
}
