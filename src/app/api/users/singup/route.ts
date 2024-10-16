
import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connectDB()


export async function POST(request: NextRequest) {
    
    try {

        const body = await request.json();
        
        const { name, email, password } = body;


        console.log(body);
        
        const user =await User.findOne({email});
        
        if(user){
            return NextResponse.json({ error: "User already exists","message": "User already exists" }, { status: 409 });
        }

        const salt= await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();

        console.log(savedUser);

        // send varification email

        await sendEmail(email, "verify", savedUser._id);

        return NextResponse.json({ message: "User created successfully",success: true,savedUser }, { status: 200 });

        

    } catch (error:any) {
        return NextResponse.json({ error: error.message,"message": "Internal Server Error" }, { status: 500 });
    }
}