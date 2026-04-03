import { clientConfig } from "@/config/client.config";

const stats = [
  { value: "500+", label: "Cars detailed" },
  { value: "4.9\u2605", label: "Average rating" },
  { value: "7 yrs", label: "In business" },
  { value: "Same day", label: "Available" },
];

export function About() {
  return (
    <section
      id="about"
      style={{
        background: clientConfig.branding.backgroundColor,
        padding: "72px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          {/* Left Column */}
          <div>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: clientConfig.branding.accentColor,
                marginBottom: 8,
              }}
            >
              About us
            </p>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: clientConfig.branding.primaryColor,
                margin: "0 0 24px 0",
              }}
            >
              Seattle&apos;s Mobile Detail Experts
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: "#666",
                margin: 0,
              }}
            >
              {clientConfig.business.about}
            </p>

            {/* Trust badges */}
            <div
              style={{
                display: "inline-flex",
                gap: 10,
                marginTop: 24,
              }}
            >
              <span
                style={{
                  background: clientConfig.branding.primaryColor,
                  color: "#fff",
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: 99,
                }}
              >
                Est. {clientConfig.business.founded}
              </span>
              <span
                style={{
                  background: clientConfig.branding.primaryColor,
                  color: "#fff",
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: 99,
                }}
              >
                {clientConfig.business.jobsCompleted} Cars Detailed
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Placeholder image */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: 16,
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                Before &amp; After
              </span>
            </div>

            {/* Stat boxes 2x2 grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 16,
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#fff",
                    border: "0.5px solid #e8e8e4",
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: clientConfig.branding.primaryColor,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
