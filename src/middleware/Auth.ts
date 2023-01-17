import { Request, Response, NextFunction } from "express"
import {JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { APP_SECRET } from "../config"
import { UserAttribute, UserInstance } from "../model/model"

export const auth= async(req: JwtPayload,res:Response, next:NextFunction)=>{
    try {
       const authorization = req.headers.authorization  //req.cookie.Jwt can also be used but Jwt must be imported
   
       if(!authorization){
           return res.status(401).json({Error:" Unauthorized, kindly login"})
       }
       //Bearer token
       const token = authorization.slice(7, authorization.length)
       let verified =jwt.verify(token, APP_SECRET)
       if(!verified){
   
           return res.status(401).json({
               Error:"unauthorized"
           })
       }
       const {id} = verified as {[key:string]:string}
       const user = await UserInstance.findOne({where:{id:id}}) as unknown as UserAttribute;
       if(!user){
           return res.status(401).json({
               Error:"Invalid Credentials"
           })
       }
       req.user = verified 
       next()
    } catch (error) {
       return res.status(401).json({Error:" Unauthorized user"})
    }
   }