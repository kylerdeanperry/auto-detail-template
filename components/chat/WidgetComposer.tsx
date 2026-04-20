"use client"

export function WidgetComposer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="border-t border-stone p-3 flex gap-2">
      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Describe your project…"
        className="flex-grow rounded-md border border-stone bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-muted/70 outline-none focus:border-bronze transition disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-bronze disabled:opacity-50"
      >
        Send
      </button>
    </form>
  )
}
