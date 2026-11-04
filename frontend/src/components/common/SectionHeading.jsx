function SectionHeading({ eyebrow, title, description, align = 'start' }) {
  return (
    <div className={`dm-section-heading text-${align}`}>
      {eyebrow && <div className="dm-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default SectionHeading
