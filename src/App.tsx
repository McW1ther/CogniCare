import { useEffect } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppShell } from "./components/layout/AppShell";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Diary from "./pages/Diary";
import DiaryEntry from "./pages/DiaryEntry";
import Quotes from "./pages/Quotes";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/** Runs the one-time session check + subscribes to auth changes.
 * Nothing routes until this resolves, so there's no signed-out flash
 * before redirecting a returning, already-signed-in user home. */
function AppBoot({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  if (status === "loading") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-paper">
        <div className="aurora" />
      </div>
    );
  }
  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const onboarded = useAuthStore((s) => s.profile?.onboarded ?? false);
  if (status === "signedOut") return <Navigate to="/sign-in" replace />;
  if (!onboarded) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

function RequireWelcome({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const onboarded = useAuthStore((s) => s.profile?.onboarded ?? false);
  if (status === "signedOut") return <Navigate to="/sign-in" replace />;
  if (onboarded) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  if (status === "signedIn") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBoot>
        <ThemeProvider>
          <Routes>
            <Route path="/support" element={<Support />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/sign-up"
              element={
                <RedirectIfAuthed>
                  <SignUp />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/sign-in"
              element={
                <RedirectIfAuthed>
                  <SignIn />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RedirectIfAuthed>
                  <ForgotPassword />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/welcome"
              element={
                <RequireWelcome>
                  <Welcome />
                </RequireWelcome>
              }
            />

            <Route
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/diary/new" element={<DiaryEntry />} />
              <Route path="/diary/:id" element={<DiaryEntry />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AppBoot>
    </BrowserRouter>
  );
}
