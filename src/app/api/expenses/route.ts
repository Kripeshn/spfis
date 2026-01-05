// GET all expenses, POST new expense

import { connectToDatabase } from "@/lib/db";
import { Expense } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const category = url.searchParams.get("category");

    // Build filter
    const filter: any = { userId: session.user.id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (category) {
      filter.category = category;
    }

    // Fetch expenses
    const expenses = await db
      .collection("expenses")
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const body = await req.json();

    // Validation
    if (!body.category || !body.amount || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields: category, amount, date" },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create expense
    const expense: Expense = {
      userId: session.user.id,
      category: body.category,
      amount: parseFloat(body.amount),
      date: new Date(body.date),
      description: body.description || "",
      createdAt: new Date(),
    };

    const result = await db.collection("expenses").insertOne(expense);

    return NextResponse.json(
      { ...expense, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}