import { clientConfig } from "@/config/client.config";

const trustSignals = [
  "Fully Insured & Bonded",
  "Eco-Friendly Products",
  "Same-Day Booking",
  "5-Star Rated on Google",
];

export function TrustBar() {
  return (
    <section
      style={{ background: "#1a1a1a", padding: "14px 0" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {trustSignals.map((signal) => (
            <div
              key={signal}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: clientConfig.branding.accentColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                {signal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
