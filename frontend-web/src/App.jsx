import { useEffect, useState } from "react";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import authAPI from "./api/authAPI";

export default function App() {
  /**
   * authState:
   *  - loading
   *  - unauth
   *  - unverified
   *  - verified
   */
  const [authState, setAuthState] = useState("loading");

  /**
   * page (only relevant when unauth):
   *  - login
   *  - signup
   *  - verify
   */
  const [page, setPage] = useState("login");

  // 🔹 Initial auth bootstrap
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const status = await authAPI.getAuthStatus();

        if (!status.authenticated) {
          setAuthState("unauth");
          setPage("login");
        } else if (!status.emailVerified) {
          setAuthState("unverified");
        } else {
          setAuthState("verified");
        }
      } catch {
        setAuthState("unauth");
        setPage("login");
      }
    };

    bootstrap();
  }, []);

  if (authState === "loading") return null;

  /**
   * ─────────────────────────────
   * UNAUTHENTICATED FLOW
   * ─────────────────────────────
   */
  if (authState === "unauth") {
    if (page === "signup") {
      return <SignupPage onNavigate={setPage} />;
    }

    if (page === "verify") {
      return (
        <VerifyEmailPage
          onVerified={async () => {
            const refreshed = await authAPI.refreshToken();
            if (refreshed.refreshed) {
              setAuthState("verified");
            } else {
              setPage("login");
            }
          }}
        />
      );
    }

    // default → login
    return (
      <LoginPage
        onNavigate={setPage}
        onLoginSuccess={(data) => {
          if (data.emailVerified) {
            setAuthState("verified");
          } else {
            setAuthState("unverified");
          }
        }}
      />
    );
  }

  /**
   * ─────────────────────────────
   * EMAIL NOT VERIFIED FLOW
   * ─────────────────────────────
   */
  if (authState === "unverified") {
    return (
      <VerifyEmailPage
        onVerified={async () => {
          const refreshed = await authAPI.refreshToken();

          if (refreshed.refreshed) {
            setAuthState("verified");
          } else {
            // session expired or invalid
            setAuthState("unauth");
            setPage("login");
          }
        }}
      />
    );
  }

  /**
   * ─────────────────────────────
   * AUTHENTICATED + VERIFIED
   * ─────────────────────────────
   */
  return (
    <DashboardPage
      onLogout={() => {
        setAuthState("unauth");
        setPage("login");
      }}
    />
  );
}
