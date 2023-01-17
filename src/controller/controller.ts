import {Request, Response, NextFunction}  from "express"
import { UserAttribute, UserInstance } from "../model/model";
import {v4 as uuidv4} from 'uuid'
import { emailHtml, GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, mailSent, option, UserSchema, validatePassword, verifySignature } from '../utils/utility';
import { FromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";

//signup
export const signUp = async(req: Request, res: Response)=>{
    try {
        console.log(req.body)
    // if (typeof req.body === "object" && req.body !== null){ 
        const {name, email, password, confirm_password} = req.body
        const uuiduser = uuidv4();
        const validateUser = UserSchema.validate(req.body, option)

        if (validateUser.error) {
            return res.status(400).json({ 
              Error: validateUser.error.details[0].message 
            });
          }
        
    // generate salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    // generate otp and expiry
    const { otp, expiry } = GenerateOtp();
    console.log(otp, expiry);

    // //  check if user is existing
    const User = await UserInstance.findOne({ where: { email: email } });
    if (!User) {
       await UserInstance.create({
        id: uuiduser,
        name,
        email,
        password: userPassword,
        salt,
        otp,
        otp_expiry: expiry,
        verified: false
      });

      //send otp to user
      const html = emailHtml(otp);
     await mailSent(FromAdminMail, email, userSubject, html);

      //check if user exist
      const Users = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttribute;

      // Generate a signature
     let signature = await GenerateSignature({
       id: Users.id,
       email: Users.email,
       verified: Users.verified
     });

      return res.status(201).json({ 
        message: "User created successfully check your email for OTP verification",
        Users,
        signature
        });
    }

    return res.status(400).json({ 
      Error: "user already exist" 
    });

  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/signup",
    });
  }
};
/**========verify user====== **/
export const verifyUser = async(req:Request, res:Response) =>{
  try {
      const token =req.params.signature
      const decode = await verifySignature(token) as JwtPayload
      // console.log(decode)

      // check if useris register user
      const User= await UserInstance.findOne({ 
        where: { email: decode.email } 
      }) as unknown as JwtPayload;

      const {otp} = req.body;

      if(User.verified){
        res.status(400).json({
          Error: 'You are already verified'
        })
      }

      if(User.otp !== parseInt(otp)){
        res.status(400).json({
          Error: 'Wrong OTP'
        })
       
      }

      if(User){
          

          if(User.otp === parseInt(otp) && User.otp_expiry >= new Date() ){

          const updatedUser = await User.update({
            verified:true
          
          })
          
           // Generate a new signature
           let signature =await GenerateSignature({
              id:updatedUser.id,
              email:updatedUser.email,
              verified:updatedUser.verified
      });

      if(updatedUser){
        const User =(await UserInstance.findOne({
          where: {email:decode.email},
        })) as unknown as UserAttribute;
      }
     
      return res.status(200).json({
          message:"you are successfully verified your accout",
          token,
          verified:User.verified
          
      })
     
  }
}
return res.status(400).json({
  Error:"OTP already expired"
})

  } catch (error) {
      res.status(500).json({
          Error: "Internal server Error",
          route: "/users/verify",
        });
      
  }
}

/** =============== Resend OTP================ **/
export const resendOTP = async (req:Request, res:Response)=>{
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttribute;
    if(User){
      // Generate otp
      const { otp, expiry } = GenerateOtp();
    const updatedUser = await UserInstance.update ({
      otp,
      otp_expiry:expiry
    },{where: {email: decode.email}}) as unknown as UserAttribute;
    console.log("updatedUser is ", updatedUser)
    if(updatedUser){
      const User = await UserInstance.findOne({ where: { email:decode.email }}) as unknown as UserAttribute;
      
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, decode.email, userSubject, html);
     console.log("html is", html)

      return res.status(200).json({
        message:"OTP resend to registered email"
      });
    }
  }  
  return res.status(400).json({
    Error: "Error sending OTp"
  })
  } catch (error) {
    res.status(500).json({
      Error:"Internal server Error",
      route:"/user/resend-otp/:signature"
    })
   
  }

}

/** ==============Login user============= **/
export const Login = async(req:Request, res:Response)=>{
    try {
     const {email, password} =req.body; 
     const validateUser = loginSchema.validate(req.body, option);
     if(validateUser.error){
      return res.status(400).json({
        Error:validateUser.error.details[0].message
      });
     }
     const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttribute;
    if(User){
     const validation = await validatePassword(password, User.password, User.salt)
     if(validation){
  // Generate signature for user
    let signature =await GenerateSignature({
      id:User.id,
      email:User.email,
       verified:User.verified
});
  return res.status(200).json({message: "You are successfully logged in",
  email:User.email,
  signature,
  verified:User.verified,
  
  })
     }
    }
    return res.status(400).json({Error:"wrong username or password"})
    } catch (error) {
      res.status(500).json({
        Error: "Internal server Error",
              route: "/users/login",
      })
      
    }
  };

/** ==============getuser/homepage============= **/
  export const getUser = async(req:JwtPayload, res:Response) =>{
    try {
      const {id} = req.user;
      const User = await UserInstance.findOne({ where: { id: id} });
      if(User){
        return res.status(200).json({
            message:"you have successfully retrived user", 
            User
        })
      }
      res.status(400).json({
        Error:"user not found"
      })
    } catch (error) {
      res.status(500).json({
        Error:"Internal server error",
       route:  "/users/getuser"
      })
    }
  
   }
  



  


