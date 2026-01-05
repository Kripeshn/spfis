"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Expense {
  _id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Subscriptions",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800",
  Transport: "bg-blue-100 text-blue-800",
  Entertainment: "bg-purple-100 text-purple-800",
  Utilities: "bg-green-100 text-green-800",
  Healthcare: "bg-red-100 text-red-800",
  Shopping: "bg-pink-100 text-pink-800",
  Subscriptions: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load expenses");
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/expenses/${editingId}`
        : "/api/expenses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!res.ok) throw new Error("Failed to save expense");

      toast.success(
        editingId
          ? "Expense updated successfully"
          : "Expense added successfully"
      );
      setFormData({
        category: "Food",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setEditingId(null);
      setOpen(false);
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to save expense");
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date.split("T")[0],
      description: expense.description,
    });
    setEditingId(expense._id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading expenses...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  category: "Food",
                  amount: "",
                  date: new Date().toISOString().split("T")[0],
                  description: "",
                });
              }}
            >
              + Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update expense details"
                  : "Create a new expense record"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange(e, "amount")}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(e, "date")}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e, "description")}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
              >
                {editingId ? "Update Expense" : "Add Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No expenses yet. Add one to get started!</p>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense._id} className="p-4 flex justify-between items-center hover:shadow-lg transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={CATEGORY_COLORS[expense.category]}>
                    {expense.category}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{expense.description}</p>
              </div>

              <div className="text-right mr-4">
                <p className="text-2xl font-bold text-gray-800">
                  ${expense.amount.toFixed(2)}
                </p>
              </div>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(expense)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(expense._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}