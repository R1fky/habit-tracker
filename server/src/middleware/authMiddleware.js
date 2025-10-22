// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateJWT = (req, res, next) => {
  let token = null;

  // Ambil token dari cookie dulu
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("✅ Token dari cookie:", token);
  }

  // Kalau tidak ada di cookie, cek header Authorization
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✅ Token dari header:", token);
  }

  if (!token) {
    console.warn("❌ Token tidak ditemukan");
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token valid, user:", decoded);
    next();
  } catch (err) {
    console.error("authenticateJWT error:", err);
    return res.status(403).json({ success: false, message: "Token tidak valid" });
  }
};
  