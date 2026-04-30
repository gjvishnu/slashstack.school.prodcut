import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const Body = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#eef2f6] lg:h-screen lg:overflow-hidden">
      <div className="hidden h-screen w-72 shrink-0 lg:block">
        <Sidebar />
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-slate-950/35"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-xs">
            <Sidebar
              isMobile
              onClose={() => setIsSidebarOpen(false)}
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                School ERP
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                Teacher Workspace
              </p>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
