import { Outlet } from "react-router-dom";

export const Body = () => {
  return (
    <div className="h-screen w-full flex">
      <div className="md:w-[20%] lg:w-[15%] w-0  h-full   border  "></div>

      <div className="flex-1 h-full min-h-0 overflow-y-auto">
         <Outlet/>
      </div>
    </div>
  );
};