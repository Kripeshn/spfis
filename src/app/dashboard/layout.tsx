
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🔐 Checking authentication for dashboard...");

  // Get session from NextAuth
  const session = await getServerSession(authOptions);

  console.log("📋 Session status:", session ? "✅ Logged in" : "❌ Not logged in");

  // If not logged in, redirect to login page
  if (!session) {
    console.log("⛔ No session found, redirecting to login...");
    redirect("/auth/login");
  }

  console.log("✅ User authenticated:", session.user?.email);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <DashboardNav user={session.user} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, {session.user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
