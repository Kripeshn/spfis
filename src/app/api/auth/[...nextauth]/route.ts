
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// ============================================
// PART 7: SIGNUP API ENDPOINT
// ============================================

// FILE: src/app/api/auth/register/route.ts
// This handles user registration

import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("📝 Registration request received");

    // Get form data
    const body = await req.json();
    const { name, email, password, confirmPassword, monthlyIncome } = body;

    console.log("📋 Received:", { name, email, monthlyIncome });

    // ===== VALIDATION =====
    // Check if all fields provided
    if (!name || !email || !password || !monthlyIncome) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("❌ Passwords don't match");
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      console.log("❌ Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ===== DATABASE CHECK =====
    console.log("🔗 Connecting to database...");
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("✅ Email is available");

    // ===== PASSWORD HASHING =====
    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // ===== CREATE USER =====
    console.log("👤 Creating user in database...");
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      monthlyIncome: Number(monthlyIncome),
      createdAt: new Date(),
    });

    console.log("✅ User created with ID:", result.insertedId);

    // ===== RETURN SUCCESS =====
    return NextResponse.json(
      {
        message: "Account created successfully!",
        userId: result.insertedId,
        email: email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}