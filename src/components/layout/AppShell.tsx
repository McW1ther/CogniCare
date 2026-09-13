import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 pb-28 md:pb-0">
          {/* One quiet, consistent transition across every route swap —
              not a per-section reveal, just enough to keep page changes
              from feeling like a hard cut. */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
