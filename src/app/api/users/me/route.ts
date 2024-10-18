

import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";
import { gettokendata } from "@/helpers/gettokendata";

connectDB()


// get user detale by id
export async function POST(request: NextRequest) {

    try {
        
// extract data from token

        const userid = await gettokendata(request);


        const user = await User.findOne({_id: userid}).select("-password");

        if(!user){
            return NextResponse.json({ error: "user not found" }, { status: 404 }) 
        }

        
        return NextResponse.json({message:"user detale", user}, { status: 200 })


    } catch (error) {
        
        return NextResponse.json({ error: "user detale error" }, { status: 500 }) 
    }
}