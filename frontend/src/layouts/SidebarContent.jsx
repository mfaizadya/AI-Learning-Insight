import React from "react";
import { Link, useLocation } from "react-router";
import { LayoutGrid, ClipboardList, User } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export const SidebarContent = ({ onItemClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { data, isLoading } = useDashboardData();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutGrid size={20} />,
      exact: true,
    },
    {
      label: "Pretest",
      href: "/dashboard/pretest",
      icon: <ClipboardList size={20} />,
      exact: false,
    },
    {
      label: "Akun",
      href: "/dashboard/account",
      icon: <User size={20} />,
      exact: false,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-primary text-white">
      {" "}
      <section className="h-[240px] bg-secondary flex flex-col items-center justify-center pt-6 pb-12 shrink-0">
        <figure className="relative mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white">
            <img
              src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
              alt="Foto Profil User"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute bottom-0 right-0 bg-green-400 p-1 rounded-full border-2 border-white"
            aria-hidden="true"
          >
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </figure>
        {isLoading ? (
          <h2 className="text-primary font-bold text-lg">...</h2>
        ) : (
          <h2 className="text-primary font-bold text-lg">
            {data?.user?.username || "User"}
          </h2>
        )}
      </section>
      {/* nav's list */}
      <div className="flex-1 bg-primary rounded-tr-3xl -mt-10 pt-8 px-4 z-10">
        <nav aria-label="Navigasi Utama Sidebar">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = item.exact
                ? currentPath === item.href
                : currentPath.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={onItemClick}
                    className={`
                      flex items-center gap-5 px-4 py-3 rounded-xl transition-all duration-200 w-full group
                      ${
                        isActive
                          ? "bg-[#6D5DA6] bg-opacity-50 text-white shadow-inner"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-[0.95rem] tracking-wide">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
