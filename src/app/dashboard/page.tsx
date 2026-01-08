
"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-gray-600 text-sm font-medium">Total Spent</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">$0.00</p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-gray-600 text-sm font-medium">Remaining Budget</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">$5,000.00</p>
          <p className="text-xs text-gray-500 mt-2">Based on income</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h3 className="text-gray-600 text-sm font-medium">Savings Rate</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">100%</p>
          <p className="text-xs text-gray-500 mt-2">No expenses yet</p>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="p-8 bg-white border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎉 Welcome to SPFIS!
        </h2>

        <p className="text-gray-600 mb-6">
          You're all set up and ready to start managing your finances. Here's
          what you can do:
        </p>

        {/* Quick Start Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              1️⃣ Add Your Expenses
            </h3>
            <p className="text-sm text-gray-600">
              Track your spending by adding daily expenses. This helps us
              analyze your spending patterns.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              2️⃣ View Analytics
            </h3>
            <p className="text-sm text-gray-600">
              Get AI-powered insights about your spending behavior and personalized
              recommendations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              3️⃣ Set Financial Goals
            </h3>
            <p className="text-sm text-gray-600">
              Create goals like emergency funds or vacation savings. We'll track
              your progress.
            </p>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              4️⃣ Get Recommendations
            </h3>
            <p className="text-sm text-gray-600">
              Receive smart budget suggestions and alerts when you're overspending.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <a
            href="/dashboard/expenses"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            ➕ Add First Expense
          </a>
          <a
            href="/dashboard/goals"
            className="inline-block px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
          >
            🎯 Create a Goal
          </a>
        </div>
      </Card>

      {/* Session Info (For Debugging) */}
      <Card className="p-6 mt-8 bg-gray-50 border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Session Information (Debug)
        </h3>
        <div className="space-y-2 text-sm font-mono text-gray-700">
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Name:</strong> {session?.user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {session?.user?.email || "N/A"}
          </p>
          <p>
            <strong>ID:</strong> {session?.user?.id || "N/A"}
          </p>
          <p>
            <strong>Expires:</strong>{" "}
            {session?.expires
              ? new Date(session.expires).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </Card>
    </div>
  );
}
