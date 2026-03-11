"use client";

export function Loader2({ className = "", size = 20 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function Loader({ text = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", gap: 8 }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid rgba(26, 116, 71, 0.2)",
          borderTopColor: "#1a7447",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {text && (
        <span style={{ fontSize: ".8rem", textAlign: "center", fontWeight: "bold" }}>{text}</span>
      )}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
