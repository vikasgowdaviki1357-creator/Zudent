import "./StatCard.css";

function StatCard({
  title,
  value,
  icon,
  color = "#4F46E5",
  trend,
  description,
}) {
  return (
    <div className="stat-card-ui">

      <div className="stat-card-top">

        <div
          className="stat-card-icon"
          style={{
            background: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>

        {trend && (
          <span className="trend">
            {trend}
          </span>
        )}

      </div>

      <h2>{value}</h2>

      <h4>{title}</h4>

      {description && (
        <p>{description}</p>
      )}

    </div>
  );
}

export default StatCard;