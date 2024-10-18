import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log(email, password);
        

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Please verify your email" }, { status: 401 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create token data
        const tokendata = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        // Check for TOKEN_SECRET
        const tokenSecret = process.env.TOKEN_SECRET;
        if (!tokenSecret) {
            throw new Error("Token secret is not defined");
        }

        // Generate JWT
        const token = jwt.sign(tokendata, tokenSecret, { expiresIn: '1d' });
        console.log("jwt token", token);

        // Create response with token cookie
        const response = NextResponse.json({ message: "Login successful", success: true });
        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/', // Specify the path if needed
        });

        return response;

    } catch (error: any) {
        console.error("Login error:", error); // Log error for debugging
        return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
    }
}
