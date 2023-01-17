"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        // if (typeof req.body === "object" && req.body !== null){ 
        //     const {name, email, password, confirm_password} = req.body
        //     const uuiduser = uuidv4();
        //     const validateUser = UserSchema.validate(req.body, option)
        //     if (validateUser.error) {
        //         return res.status(400).json({ Error: validateUser.error.details[0].message });
        //       }}
        //       // generate salt
        // const salt = await GenerateSalt();
        // const userPassword = await GeneratePassword(password, salt);
        // // generate otp and expiry
        // const { otp, expiry } = GenerateOtp();
        // console.log(otp, expiry);
        // //  check if user is existing
        // const User = await UserInstance.findOne({ where: { email: email } });
        // if (!User) {
        //    await UserInstance.create({
        //     id: uuiduser,
        //     name,
        //     email,
        //     password: userPassword,
        //     salt,
        //     otp,
        //     otp_expiry: expiry
        //   });
        //   //send otp to user
        //   const html = emailHtml(otp);
        //  await mailSent(FromAdminMail, email, userSubject, html);
        //   //check if user exist
        //   const Users = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttribute;
        //   // Generate a signature
        // //   let signature = await GenerateSignature({
        // //     id: Users.id,
        // //     email:Users.email,
        // //     verified:Users.verified
        // //   });
        //   return res.status(201).json({ message: "User created successfully check your email or phone for OTP verification"
        //     });
        // }
        // return res.status(400).json({ Error: "user already exist" });
    }
    catch (err) {
        // res.status(500).json({
        //   Error: "Internal server Error",
        //   route: "/users/signup",
        // });
    }
});
/** ==============Login user============= **/
// export const Login = async(req:Request, res:Response)=>{
//     try {
//      const {email, password} =req.body; 
//      const validateUser = loginSchema.validate(req.body, option);
//      if(validateUser.error){
//       return res.status(400).json({
//         Error:validateUser.error.details[0].message
//       });
//      }
//      const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttributes;
//     if(User){
//      const validation = await validatePassword(password, User.password, User.salt)
//      if(validation){
// //       // Generate signature for user
// //       let signature =await GenerateSignature({
// //         id:User.id,
// //         email:User.email,
// //         verified:User.verified
// //   });
//   return res.status(200).json({message: "You are successfully logged in",
//   email:User.email,
//   })
//      }
//     }
//     return res.status(400).json({Error:"wrong username or password"})
//     } catch (error) {
//       res.status(500).json({
//         Error: "Internal server Error",
//               route: "/users/login",
//       })
//     }
//   };
