"use client";

import React, { ReactNode } from "react";
import SideNav from "./_components/SideNav";
import type { JSX } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-gray-900 text-white shadow-lg">
        <SideNav />
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
