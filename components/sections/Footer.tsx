import { clientConfig } from "@/config/client.config";

export function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", padding: "48px 0 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 48,
          }}
        >
          {/* Left: Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: clientConfig.branding.accentColor,
                  }}
                />
              </div>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 500 }}>
                {clientConfig.business.name}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                marginTop: 12,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 300,
              }}
            >
              {clientConfig.business.about}
            </p>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 4px 0" }}>
                {clientConfig.business.phone}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                {clientConfig.business.email}
              </p>
            </div>
          </div>

          {/* Center: Services */}
          <div>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Services
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {clientConfig.services.map((service) => (
                <span
                  key={service.name}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 2,
                  }}
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Service Area */}
          <div>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Service Area
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              {clientConfig.business.serviceArea}
            </p>
            <a
              href="#booking"
              style={{
                display: "inline-block",
                background: clientConfig.branding.accentColor,
                color: "#fff",
                fontSize: 13,
                padding: "8px 20px",
                borderRadius: 7,
                textDecoration: "none",
                marginTop: 16,
              }}
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.08)",
            marginTop: 40,
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            &copy; 2026 {clientConfig.business.name}. All rights reserved.
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            Privacy Policy &middot; Terms
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
