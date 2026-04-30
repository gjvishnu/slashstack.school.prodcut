import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const Body = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef2f6]">
      <div className="h-screen w-64 shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
