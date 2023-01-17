import Joi from "joi"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import nodemailer from "nodemailer"
import { GMAIL_PASS, GMAIL_USER, FromAdminMail, userSubject, APP_SECRET } from "../config"
import { AuthPayLoad } from "../interface/Auth.dto"



  // Users Signup
  export const UserSchema = Joi.object().keys({
    name:Joi.string(),
    email:Joi.string().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
confirm_password:Joi.string().equal(Joi.ref('password')).required().label('confirm password').messages({'any.only':'{{#label}} does not match'})
   

  });

  //Users login
export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    
  });

  export const option = {
    abortearly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  export const GenerateSalt = async()=>{
    return await bcrypt.genSalt()
}
export const GeneratePassword = async(password:string, salt:string) =>{
    return await bcrypt.hash(password, salt)
 }
 export const GenerateSignature = async (payload:AuthPayLoad) => {
    return jwt.sign(payload, APP_SECRET, {expiresIn:'1d'})
 }



export const validatePassword = async( enteredPassword:string,savedPassword:string, salt:string)=>{
    return await GeneratePassword(enteredPassword, salt)=== savedPassword
}


 export const GenerateOtp = () => {
    const otp = Math.floor(1000000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
  };

  // send otp to email
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // export const sendEmail = () => {
  
  // }
  // create function to help send mail
  export const mailSent = async (
    from: string,
    to: string,
    subject: string,
    html: string
  ) => {
    try {
      const response = await transport.sendMail({
        from: FromAdminMail,
        to,
        subject: userSubject,
        html,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  export const emailHtml = (otp: number): string => {
    let response = ` <div style="max-width:700px;
          margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
  
          <h2 style="text-align:center; text-transform:uppercase; color:teal;">
          Welcome to Pelum's Technologies
          </h2>
  
          <p style="padding:50px; margin:2Opx;"> DO NOT DISCLOSE, verify your account with this  OTP ${otp}. It expires in 30minutes</p>
  
          </div>`;
    return response;
  };
  export const verifySignature = async(signature:string) =>{
    return jwt.verify(signature, APP_SECRET) as JwtPayload
 }