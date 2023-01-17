import express from "express";
import logger from 'morgan'
import cors from 'cors'
import {db} from "./config"
import cookieParser from "cookie-parser"
import userRouter from "./route/user"
import dotenv from 'dotenv';

dotenv.config();

//Database connection
db.sync().then(() =>{
    console.log("db connected succcessfully")
}).catch((error: any) =>{
    console.log(error)
});


const app = express();
const port = process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));

app.use('/users', userRouter)

app.listen(port,() =>{
    console.log(`server running on http://localhost: ${port}`)
})


export default app