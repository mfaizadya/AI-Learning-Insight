import React from "react";
import { Outlet } from "react-router";
import SidebarNav from "../components/dashboard/SidebarNav";
import TopNav from "../components/dashboard/TopNav";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <>
      <main className="min-h-screen max-h-full bg-[#F5F5F5] font-sans flex">
        {/* aside */}
        <SidebarNav />
        {/* section main/content */}
        <section
          className="ml-64 h-full flex flex-col relative focus:outline-none mb-10"
          id="main-content"
        >
          <TopNav />
          <div className="px-8 pb-8 flex-1">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
