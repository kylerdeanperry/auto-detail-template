import { clientConfig } from "@/config/client.config";

export function Services() {
  return (
    <section
      id="services"
      style={{
        background: clientConfig.branding.backgroundColor,
        padding: "72px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header - left aligned */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: clientConfig.branding.accentColor,
              marginBottom: 8,
            }}
          >
            What we offer
          </p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: clientConfig.branding.primaryColor,
              margin: 0,
            }}
          >
            Our Services
          </h2>
          <p style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
            All services performed at your location
          </p>
        </div>

        {/* Service Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
          className="services-grid"
        >
          {clientConfig.services.map((service) => (
            <div
              key={service.name}
              className="service-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "0.5px solid #e8e8e4",
                padding: 20,
                position: "relative",
                overflow: "hidden",
                transition: "transform 200ms ease, border-color 200ms ease",
                cursor: "default",
              }}
            >
              {/* Top row: icon + price */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: clientConfig.branding.primaryColor,
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
                <span
                  style={{
                    background: clientConfig.branding.primaryColor,
                    color: "#fff",
                    fontSize: 13,
                    padding: "4px 12px",
                    borderRadius: 99,
                  }}
                >
                  {service.price}
                </span>
              </div>

              {/* Middle: name + description */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: clientConfig.branding.primaryColor,
                  marginTop: 14,
                  marginBottom: 0,
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#666",
                  lineHeight: 1.6,
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                {service.description}
              </p>

              {/* Bottom row: duration + book button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                }}
              >
                <span style={{ fontSize: 11, color: "#aaa" }}>
                  {service.duration}
                </span>
                <a
                  href="#booking"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: clientConfig.branding.accentColor,
                    background: `${clientConfig.branding.accentColor}14`,
                    borderRadius: 99,
                    border: "none",
                    padding: "5px 14px",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Book this
                </a>
              </div>

              {/* Bottom accent bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: clientConfig.branding.accentColor,
                  borderRadius: "0 0 12px 12px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .service-card:hover {
          transform: translateY(-2px);
          border-color: rgba(200,16,46,0.3) !important;
        }
      `}</style>
    </section>
  );
}
