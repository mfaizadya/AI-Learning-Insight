import React from "react";
import { Outlet } from "react-router";
import SidebarNav from "../components/dashboard/SidebarNav";
import TopNav from "../components/dashboard/TopNav";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans flex overflow-hidden">
      {/* aside */}
      <SidebarNav />
      {/* main */}
      <main
        className="flex-1 flex flex-col relative overflow-y-auto focus:outline-none"
        id="main-content"
      >
        <TopNav />
        <div className="px-8 pb-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
