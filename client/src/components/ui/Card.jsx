import "./Card.css";

function Card({
  children,
  title,
  subtitle,
  icon,
  actions,
  hover = true,
  padding = "md",
  className = "",
}) {
  return (
    <div
      className={`
        card
        ${hover ? "card-hover-effect" : ""}
        card-padding-${padding}
        ${className}
      `}
    >
      {(title || subtitle || icon || actions) && (
        <div className="card-header">
          <div className="card-title-section">
            {icon && <div className="card-icon">{icon}</div>}

            <div>
              {title && <h3>{title}</h3>}
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>

          {actions && (
            <div className="card-actions">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;