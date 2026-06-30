export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="center">
      <div className="card card-pad stack" style={{ width: "min(100%, 520px)", position: "relative", overflow: "hidden" }}>
        <div className="glow-orb orb1" style={{ width: 180, height: 180 }} />
        <div className="glow-orb orb2" style={{ width: 140, height: 140 }} />
        <div className="glow-orb orb3" style={{ width: 120, height: 120 }} />
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <div className="badge" style={{ width: "fit-content" }}>Shop Auto Final</div>
          <h1 style={{ margin: 0, fontSize: 34 }}>{title}</h1>
          <p className="muted" style={{ marginTop: 0 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
