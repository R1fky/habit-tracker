import express from 'express'
import * as authController from '../controller/authController.js'

const router = express.Router()

router.get('/register', authController.getregisterUser)
router.post('/regis', authController.registerUser)

export default router