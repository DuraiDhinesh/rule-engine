// src/components/Sidebar.jsx
import React from "react";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CubeIcon,
  CogIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const navItems = [
    { name: "Main", icon: HomeIcon },
    { name: "Dashboard", icon: ChartBarIcon },
    { name: "Users", icon: UserGroupIcon },
    { name: "Analytics", icon: ChartBarIcon },
    { name: "Orders", icon: ShoppingCartIcon },
    { name: "Products", icon: CubeIcon },
    { name: "Settings", icon: CogIcon },
    { name: "Security", icon: ShieldCheckIcon },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8 text-center">Admin</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
