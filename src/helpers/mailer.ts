

const nodemailer = require("nodemailer")
import User from "@/models/userModel";
import bcrypt from 'bcryptjs'



const varifyTemplate = (verifytoken: string)=>{ 
    
    `<p> click <a href="${process.env.DOMAIN}/verifyemail?token=${verifytoken}"> here </a> to verify your account or copy and paste this link in your browser ${process.env.DOMAIN}/verifyemail?token=${verifytoken} </p>`

}

const forgotPasswordTemplate = (forgotpasswordtoken: string) => {

    `<p> click <a href="${process.env.DOMAIN}/forgotpassword?token=${forgotpasswordtoken}"> here </a> to verify your account or copy and paste this link in your browser ${process.env.DOMAIN}/forgotpassword?token=${forgotpasswordtoken} </p>`
}



export const sendEmail = async (email: string, emailtype: string, userid: string) => {

    try {


        const location = window.location

        const hashedtoken = await bcrypt.hash(userid.toString(), 12)

        if (emailtype === 'verify') {

            await User.findByIdAndUpdate(userid,
                {
                    isVerified: true,
                    verifyToken: hashedtoken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            );
        }
        else if (emailtype === 'reset') {

            await User.findByIdAndUpdate(userid,
                {
                    forgotPasswordToken: hashedtoken,
                    forgotPasswordExpiry: Date.now() + 3600000
                }
            );
        }


        const transporter = nodemailer.createTransport({
            host: location.hostname,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'chatterjeekushal89@gmail.com', // generated ethereal user
                pass: 'Kushal@2004', // generated ethereal password
            },
        });

        const mailOptions = {
            from: 'chatterjeekushal89@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailtype === 'verify' ? 'Verify your email' : 'Reset Password', // Subject line
            html: emailtype === 'verify' ? varifyTemplate(hashedtoken) : forgotPasswordTemplate(hashedtoken)    // plain text body
        };


        const mailresponce = await transporter.sendMail(mailOptions);

        if (mailresponce) {
            return mailresponce
        }

    } catch (error: any) {

        throw new Error(error.message)

    }

}