import express from "express";
import passport from "../config/passport-google-jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//login dengan google meminta email dan profile
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

//callback Google
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/login", session: false }), (req, res) => {
  // Jika sampai sini, req.user berisi user yang ditemukan/dibuat
  const user = req.user;
  // payload JWT  (sesuai claim)

  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // Opsi A (direkomendasikan): Set httpOnly cookie lalu redirect ke aplikasi
  console.log("✅ Token berhasil dibuat:", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // di production pakai https
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
  });
  // Redirect ke halaman habit atau ke URL frontend
  return res.redirect(process.env.FRONTEND_URL + "/habbit");
});

//logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
