// import {Response} from "express"
// import { JwtPayload } from 'jsonwebtoken';
// import { UserInstance } from "../model/model";

// export const getUser = async(req:JwtPayload, res:Response) =>{
//     try {
//       const {id} = req.user;
//       const User = await UserInstance.findOne({ where: { id: id} });
//       if(User){
//         return res.status(200).json({
//             message:"you have successfully retrived user", 
//             User
//         })
//       }
//       res.status(400).json({
//         Error:"user not found"
//       })
//     } catch (error) {
//       res.status(500).json({
//         Error:"Internal server error",
//        route:  "/users/getuser"
//       })
//     }
  
//    }
  