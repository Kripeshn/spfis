
"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Navigation items
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      href: "/dashboard/expenses",
      label: "Expenses",
      icon: "💰",
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: "📈",
    },
    {
      href: "/dashboard/goals",
      label: "Goals",
      icon: "🎯",
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("🔓 Logout initiated...");
      setIsLoggingOut(true);
      toast.loading("Logging out...");

      // Call NextAuth signOut
      // callbackUrl redirects to login after logout
      const result = await signOut({
        redirect: true,
        callbackUrl: "/auth/login",
      });

      console.log("✅ Logout successful!");
      toast.success("Logged out successfully!");
    } catch (error: any) {
      console.error("❌ Logout error:", error.message);
      toast.error("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col h-screen shadow-lg">
      {/* Logo Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SPFIS</h1>
        <p className="text-gray-400 text-xs mt-1">
          Smart Personal Finance
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Menu
        </p>

        {navItems.map((item) => {
          // Check if this is the active page
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section - Divider */}
      <div className="border-t border-gray-700 pt-6 pb-4">
        {/* User Info */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Account
          </p>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-white font-medium truncate text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoggingOut ? (
            <>
              <span className="animate-spin">⏳</span>
              Logging out...
            </>
          ) : (
            <>
              <span>🔓</span>
              Logout
            </>
          )}
        </Button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}