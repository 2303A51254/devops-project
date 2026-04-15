const SectionHeading = ({ eyebrow, title, text, align = 'left' }) => (
  <div className={`section-heading ${align === 'center' ? 'center' : ''}`}>
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
    <h2>{title}</h2>
    {text ? <p>{text}</p> : null}
  </div>
);

export default SectionHeading;
