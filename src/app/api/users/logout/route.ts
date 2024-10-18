

import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";


connectDB()



export async function GET(request: NextRequest) {

    try {

      const responce= NextResponse.json({ message: "Logout successful" }, { status: 200 })
      
    responce.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
    })

        return responce

    } catch (error) {
        
        return NextResponse.json({ error: "logout error" }, { status: 500 })
    }
}