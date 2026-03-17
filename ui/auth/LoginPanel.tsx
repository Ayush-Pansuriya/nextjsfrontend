"use client";

import { AlertMessage } from "@/ui/common/AlertMessage";
import { FormEvent, useState } from "react";

interface LoginPanelProps {
  error: string | null;
  loading: boolean;
  notice: string | null;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}
export function LoginPanel({
  notice,
  onSubmit,
  error,
  loading,
}: LoginPanelProps) {
  const [user_data, setUserData] = useState("enrollment@darshan.ac.in");
  const [pwdVal, setPwdVal] = useState("password123");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ email: user_data, password: pwdVal });
  };

  return (
    <section className="panel login-panel" aria-labelledby="login-heading">
      <div className="section-stack">
        <header>
          <h2 id="login-heading" className="section-title">
            Sign in
          </h2>
          <p className="meta-text">
            Use your assigned clinic credentials. The sample credentials are prefilled for quick testing.
          </p>
        </header>

        <AlertMessage kind="error" message={error} />
        <AlertMessage kind="success" message={notice} />

        <form className="form-grid" onSubmit={handleSubmit}>
          <fieldset className="field-group">
            <label className="field-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="input-control"
              type="email"
              value={user_data}
              onChange={(event) => setUserData(event.target.value)}
              autoComplete="username"
              required
            />
          </fieldset>

          <fieldset className="field-group">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="input-control"
              type="password"
              value={pwdVal}
              onChange={(event) => setPwdVal(event.target.value)}
              autoComplete="current-password"
              required
            />
          </fieldset>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}

