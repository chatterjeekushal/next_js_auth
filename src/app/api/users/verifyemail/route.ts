
import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connectDB()


export async function POST(request: NextRequest) {

    try {

        const body = await request.json();
        const { token } = body;
        console.log(token);


        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        console.log(user);


        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;


        await user.save();


        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });



    } catch (error: any) {

        console.log("veryfy email error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}