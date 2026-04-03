import { clientConfig } from "@/config/client.config";

export function HowItWorks() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "72px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header - centered */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: clientConfig.branding.accentColor,
              marginBottom: 8,
            }}
          >
            Simple process
          </p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: clientConfig.branding.primaryColor,
              margin: 0,
            }}
          >
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div
          className="how-it-works-steps"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 0,
            position: "relative",
          }}
        >
          {clientConfig.process.map((item, index) => (
            <div
              key={item.step}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "0 0 auto",
                width: 240,
                position: "relative",
              }}
            >
              {/* Connecting dashed line (desktop only) */}
              {index < clientConfig.process.length - 1 && (
                <div
                  className="step-connector"
                  style={{
                    position: "absolute",
                    top: 24,
                    left: "calc(50% + 30px)",
                    width: "calc(100% - 12px)",
                    height: 0,
                    borderTop: "1px dashed #e0e0e0",
                  }}
                />
              )}

              {/* Number circle */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: `1.5px solid ${clientConfig.branding.accentColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 500,
                  color: clientConfig.branding.accentColor,
                  position: "relative",
                  zIndex: 1,
                  background: "#fff",
                }}
              >
                {item.step}
              </div>

              {/* Step title */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: clientConfig.branding.primaryColor,
                  marginTop: 16,
                  marginBottom: 0,
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: "#999",
                  lineHeight: 1.6,
                  maxWidth: 200,
                  marginTop: 8,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-it-works-steps {
            flex-direction: column !important;
            align-items: center !important;
            gap: 32px !important;
          }
          .step-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
