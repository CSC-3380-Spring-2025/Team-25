import React from "react";
import Link from "next/link";                // If you use React Router, change this to NavLink
import { Home, ListChecks, Settings, Medal, Banknote } from "lucide-react";

const navItems = [
  { href: "/dashboard",            label: "Overview", icon: Home },
  { href: "/dashboard/budgets",   label: "Budgets",  icon: ListChecks },
  {href:"/dashboard/transactions", label: "Transactions", icon: Banknote},
  { href: "/dashboard/leaderboard",  label: "Leaderboard", icon: Medal },
  //{ href: "/dashboard/settings",  label: "Settings", icon: Settings },
  
  
];

export default function SideNav() {
  return (
    <nav className="h-full flex flex-col py-8 px-4">
      <h1 className="text-2xl font-semibold mb-8">LeveUp&nbsp;Budget</h1>

      <ul className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
