import Link from "next/link";
import { Button } from "@/components/ui/button";
import { clientConfig } from "@/config/client.config";

interface HeroProps {
  imageUrl?: string;
}

const stats = [
  { value: "500+", label: "Cars Detailed" },
  { value: "5.0", label: "Star Rating" },
  { value: "7", label: "Years" },
  { value: "Same Day", label: "Available" },
];

export function Hero({ imageUrl = "/hero-car.jpg" }: HeroProps) {
  const hasImage = Boolean(imageUrl);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background: Image with Overlay (0.35) + Vignette */}
      {hasImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${imageUrl}')`,
          }}
        >
          {/* Reduced opacity overlay (0.35) so car is clearly visible */}
          <div className="absolute inset-0 bg-[#0a0a0a]/35" />
          {/* Vignette effect */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,10,10,0.6) 100%)'
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 hero-gradient-fallback" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-32 flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          {/* Left Side - Text Content with subtle gradient behind for readability */}
          <div className="relative flex-1 max-w-2xl">
            {/* Subtle dark gradient behind text area only */}
            <div 
              className="absolute -inset-8 -z-10 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(10,10,10,0.6) 0%, transparent 70%)'
              }}
            />
            
            {/* Eyebrow Badge - Smaller, with pulsing red dot */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="text-white/80 text-[11px] font-medium tracking-wide font-sans">
                  Now serving {clientConfig.business.serviceArea}
                </span>
              </div>
            </div>

            {/* Headlines - Both 58px, different weights */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-[58px] text-white tracking-[-0.02em] font-sans"
              style={{ lineHeight: '1.15' }}
            >
              <span className="font-light">Premium Mobile Detailing</span>
              <br />
              <span className="font-semibold">We Come To You</span>
            </h1>

            {/* Subtext */}
            <p 
              className="mt-6 text-base font-light max-w-xl font-sans"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {clientConfig.business.about}
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white text-base font-sans px-8 py-6 rounded-lg"
              >
                <Link href="#booking">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white text-base font-sans px-8 py-6 rounded-lg"
              >
                <Link href="#services">View Services</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Next Available Slot Card */}
          <div className="lg:flex-shrink-0">
            <div 
              className="bg-[#0f0f0f]/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-[280px]"
              style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
            >
              <p 
                className="text-[11px] font-sans font-medium"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Next available
              </p>
              <p className="mt-2 text-[28px] font-semibold text-white font-sans">
                Today, 2:00 PM
              </p>
              <p 
                className="mt-1 text-[12px] font-sans"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Seattle &amp; Eastside
              </p>
              <Button
                asChild
                className="mt-4 w-full bg-accent hover:bg-accent/90 text-white text-[13px] font-medium font-sans rounded-lg h-10"
              >
                <Link href="#booking">Book this slot</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar - Grid with 4 equal columns and dividers */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-4 gap-0">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="relative flex flex-col items-center justify-center text-center px-2"
              >
                {/* Vertical Divider (not on first item) */}
                {index > 0 && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  />
                )}
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white font-sans whitespace-nowrap">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider font-sans truncate max-w-full">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
