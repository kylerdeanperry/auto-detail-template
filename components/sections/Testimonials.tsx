import { clientConfig } from "@/config/client.config";

export function Testimonials() {
  return (
    <section
      id="reviews"
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
            Social proof
          </p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: clientConfig.branding.primaryColor,
              margin: "0 0 8px 0",
            }}
          >
            What customers say
          </h2>
          <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
            All reviews from Google
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {clientConfig.testimonials.map((testimonial) => {
            const initials = testimonial.name
              .split(" ")
              .map((n) => n.charAt(0))
              .join("");

            return (
              <div
                key={testimonial.name}
                style={{
                  background: "#F8F8F6",
                  borderRadius: 12,
                  border: "0.5px solid #e8e8e4",
                  padding: 20,
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        background: "#F59E0B",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p
                  style={{
                    fontSize: 13,
                    fontStyle: "italic",
                    color: "#555",
                    lineHeight: 1.7,
                    marginTop: 10,
                    marginBottom: 16,
                  }}
                >
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Reviewer row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: clientConfig.branding.primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: clientConfig.branding.primaryColor,
                      }}
                    >
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      Google review
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
