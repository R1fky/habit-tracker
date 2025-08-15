import express from 'express'
import * as authController from '../controller/authController.js'

const router = express.Router()

router.get('/register', authController.getregisterUser)
router.post('/regis', authController.registerUser)

//login
router.get('/login', authController.getLoginPage)

export default router