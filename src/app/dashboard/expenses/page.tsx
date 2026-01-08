
"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          ➕ Add Expense
        </Button>
      </div>

      {/* Empty State */}
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <p className="text-gray-600 text-lg">
          No expenses yet. Add your first expense to get started!
        </p>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
          Add Your First Expense
        </Button>
      </Card>

      {/* Debug Info */}
      <Card className="p-4 mt-8 bg-gray-50">
        <p className="text-xs text-gray-600">
          You're viewing this because you're logged in as:{" "}
          <strong>{session?.user?.email}</strong>
        </p>
      </Card>
    </div>
  );
}