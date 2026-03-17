import type { Role } from "@/lib/types";

interface AppHeaderProps {
  onLogout?: () => void;
  role?: Role;
}

export function AppHeader({ onLogout, role }: AppHeaderProps) {
  return (
    <header className="panel topbar" role="banner" aria-label="Application header">
      <div className="topbar-title">
        <p className="eyebrow">Clinic Queue Console</p>
        <h1 className="title-main">Clinic Queue Management</h1>
      </div>

      <div className="topbar-actions">
        {role ? (
          <span className={`role-pill role-${role}`} aria-label={`Role: ${role}`}>
            {role}
          </span>
        ) : null}

        {onLogout ? (
          <button className="button button-danger" onClick={onLogout} type="button">
            Sign out
          </button>
        ) : null}
      </div>
    </header>
  );
}
