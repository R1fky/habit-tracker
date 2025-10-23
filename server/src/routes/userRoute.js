import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateJWT, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});


export default router