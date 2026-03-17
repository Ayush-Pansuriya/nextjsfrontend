import { ROLE_RIGHTS } from "@/lib/constants";
import { getInitials } from "@/lib/format";
import type { AuthSession } from "@/lib/types";

export function IdentitySidebar({ session }: { session: AuthSession }) {
  return (
    <aside className="panel sidebar" role="complementary" aria-label="User profile">
      <div className="section-stack">
        <header>
          <h2 className="section-title">Profile</h2>
          <p className="meta-text">
            Access is based on your role and clinic assignment.
          </p>
        </header>

        <section className="identity-card" aria-label="User information">
          <div className="identity-row">
            <div className="avatar-badge" aria-hidden="true">
              {getInitials(session.user.name)}
            </div>
            <div>
              <p className="identity-name">{session.user.name}</p>
              <p className="identity-mail">{session.user.email}</p>
            </div>
          </div>

          <dl>
            <div>
              <dt className="meta-text">Role</dt>
              <dd>
                <span className={`role-pill role-${session.user.role}`}>{session.user.role}</span>
              </dd>
            </div>
            <div>
              <dt className="meta-text">Clinic</dt>
              <dd className="meta-text">{session.user.clinicName ?? "Your clinic"}</dd>
            </div>
            <div>
              <dt className="meta-text">Code</dt>
              <dd className="meta-text mono-text">{session.user.clinicCode ?? "Not set"}</dd>
            </div>
          </dl>
        </section>

        <section className="card-section" aria-label="User permissions">
          <h3 className="card-title">What You Can Do</h3>
          <ul className="rights-list">
            {ROLE_RIGHTS[session.user.role].map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
