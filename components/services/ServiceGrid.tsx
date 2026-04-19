import { config, expand } from "@/lib/config"

export function ServiceGrid() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {config.services.map((s, i) => (
            <div key={i} className="border-2 border-slate p-6">
              <div className="text-kicker uppercase text-[#666] mb-3">
                Service {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">{s.name}</h3>
              <div className="flex justify-between text-sm font-semibold border-b border-[#eee] pb-3 mb-3">
                <span>{s.price}</span>
                <span className="text-[#666]">{s.duration}</span>
              </div>
              <p className="text-sm text-[#444]">{expand(s.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
