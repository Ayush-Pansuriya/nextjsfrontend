"use client";

import { useState } from "react";
import { LoginPanel } from "@/ui/auth/LoginPanel";
import { AdminDashboard } from "@/ui/dashboard/AdminDashboard";
import { DoctorDashboard } from "@/ui/dashboard/DoctorDashboard";
import { PatientDashboard } from "@/ui/dashboard/PatientDashboard";
import { ReceptionistDashboard } from "@/ui/dashboard/ReceptionistDashboard";
import { AlertMessage } from "@/ui/common/AlertMessage";
import { AppHeader } from "@/ui/layout/AppHeader";
import { IdentitySidebar } from "@/ui/layout/IdentitySidebar";
import { AuthProvider } from "@/state/AuthContext";
import { useAuth } from "@/custom-hooks/useAuth";
import { useAutoClearMessage } from "@/custom-hooks/useAutoClearMessage";
import { extractErrorMessage } from "@/api/api";
import type { LoginCredentials } from "@/lib/types";

export function ClinicQueueApp() {
  return (
    <AuthProvider>
      <ClinicQueueScreen />
    </AuthProvider>
  );
}

function ClinicQueueScreen() {
  const { hydrated, login, loginLoading, logout, session }= useAuth();
  const [errMsg, setErrMsg] =useState<string | null>(null);
  const [okMsg, setOkMsg]= useState<string | null>(null);

  useAutoClearMessage(okMsg, setOkMsg);

  const handleLogin= async (credentials: LoginCredentials) => {
    setErrMsg(null);
    setOkMsg(null);

   try {
      const nextSession =await login(credentials.email, credentials.password);
      setOkMsg(`Welcome back, ${nextSession.user.name}.`);
    } catch (error) {
      setErrMsg(extractErrorMessage(error, "We couldn't sign you in. Please try again."));
    }
  };

  const handleLogout= () => {
   logout();
    setErrMsg(null);
    setOkMsg("Logged out successfully.");
  };

  const handleUnauthorized= () => {
    logout();
    setOkMsg(null);
    setErrMsg("Your session has expired. Please sign in again.");
  };

  const roleNow= session?.user.role;

  return (
    <div className="app-root">
      <main className="page-wrap" role="main">
        <AppHeader onLogout={session ? handleLogout : undefined} role={roleNow} />

        {!hydrated ? (
          <section className="panel loading-panel" aria-live="polite">
            <p className="loading-text">Preparing your dashboard…</p>
          </section>
        ) : null}

        {hydrated && !session ? (
          <div className="auth-page" aria-labelledby="login-heading">
            <LoginPanel
              error={errMsg}
              loading={loginLoading}
              notice={okMsg}
              onSubmit={handleLogin}
            />
          </div>
        ) : null}

        {hydrated && session ? (
          <div className="dashboard-grid">
            <IdentitySidebar session={session} />

            <section className="panel content" aria-label="Dashboard">
              <div className="section-stack">
                <AlertMessage kind="error" message={errMsg} />
                <AlertMessage kind="success" message={okMsg} />

                {roleNow === "admin" ? (
                  <AdminDashboard
                    onUnauthorized={handleUnauthorized}
                    session={session}
                    setError={setErrMsg}
                    setNotice={setOkMsg}
                  />
                ) : null}

                {roleNow === "patient" ? (
                  <PatientDashboard
                    onUnauthorized={handleUnauthorized}
                    session={session}
                    setError={setErrMsg}
                    setNotice={setOkMsg}
                  />
                ) : null}

                {roleNow === "receptionist" ? (
                  <ReceptionistDashboard
                    onUnauthorized={handleUnauthorized}
                    session={session}
                    setError={setErrMsg}
                    setNotice={setOkMsg}
                  />
                ) : null}

                {roleNow === "doctor" ? (
                  <DoctorDashboard
                    onUnauthorized={handleUnauthorized}
                    session={session}
                    setError={setErrMsg}
                    setNotice={setOkMsg}
                  />
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
