import express from "express"
import {Login, resendOTP, signUp, verifyUser, getUser } from "../controller/controller"

import { auth } from "../middleware/Auth";

const router = express.Router()

router.post('/signup', signUp)
router.post('/verify/:signature', verifyUser)
router.get('/resend-otp/:signature', resendOTP)
router.post('/login', Login)
router.get('/dashboard', auth, getUser)


export default router