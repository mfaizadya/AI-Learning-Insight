import React from "react";
import { SidebarContent } from "./SidebarContent";

const SidebarNav = () => {
  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 w-64 h-screen flex-col z-50 shadow-md"
      aria-label="Sidebar Utama Desktop"
    >
      <SidebarContent />
    </aside>
  );
};

export default SidebarNav;
