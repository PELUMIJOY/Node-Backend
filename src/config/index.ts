import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()



 export const db = new Sequelize(process.env.DB_CONNECT!,{
   database:"postgres",
   dialect:"postgres",
   logging:false
 });

export const GMAIL_USER=process.env.GMAIL_USER
export const GMAIL_PASS=process.env.GMAIL_PASS
export const FromAdminMail=process.env.FromAdminMail!
export const userSubject=process.env.userSubject!
export const APP_SECRET=process.env.APP_SECRET!
