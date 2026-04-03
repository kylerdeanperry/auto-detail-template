import { clientConfig } from "@/config/client.config";

export function BookingCTA() {
  return (
    <section
      id="booking"
      style={{
        background: clientConfig.branding.primaryColor,
        padding: "64px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          className="booking-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#fff",
                margin: 0,
              }}
            >
              Ready for a showroom shine?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                marginTop: 12,
              }}
            >
              Serving {clientConfig.business.serviceArea} — same-day slots
              available
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 28,
                flexWrap: "wrap",
              }}
            >
              <a
                href="#booking"
                style={{
                  background: clientConfig.branding.accentColor,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "12px 28px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Book Your Detail
              </a>
              <a
                href={`tel:${clientConfig.business.phone}`}
                style={{
                  background: "transparent",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "12px 28px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.25)",
                  cursor: "pointer",
                }}
              >
                {clientConfig.business.phone}
              </a>
            </div>
          </div>

          {/* Right - Quick booking card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: clientConfig.branding.primaryColor,
                margin: "0 0 16px 0",
              }}
            >
              Quick booking
            </h3>
            {["No shop visit required", "Same-day availability", "Free cancellation up to 24hrs"].map(
              (feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M11.5 3.5L5.5 10L2.5 7"
                      stroke={clientConfig.branding.accentColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontSize: 13, color: "#666" }}>
                    {feature}
                  </span>
                </div>
              )
            )}
            <a
              href="#booking"
              style={{
                display: "block",
                width: "100%",
                background: clientConfig.branding.accentColor,
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                padding: 10,
                borderRadius: 8,
                textAlign: "center",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 8,
                boxSizing: "border-box",
              }}
            >
              Start booking
            </a>
          </div>
        </div>

        {/* Chatbot mount point */}
        <div id="chatbot-mount" />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
