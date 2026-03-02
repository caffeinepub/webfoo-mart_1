import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="border-t border-border bg-card/50 py-4 px-4 mt-auto">
      <p className="text-center text-xs text-muted-foreground">
        © {year} WebFoo Mart. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
