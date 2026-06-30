export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', action }) {
  const centered = align === 'center'

  return (
    <div
      className={`flex flex-col gap-3 mb-10 md:mb-14 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={centered ? 'max-w-xl' : ''}>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-bronze font-medium mb-3">{eyebrow}</p>
        )}
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-ink">{title}</h2>
        {subtitle && <p className="mt-3 text-stone leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
