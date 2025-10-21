// middleware/authJwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateJWT = (req, res, next) => {
  try {
    // 1) cek header Authorization
    const authHeader = req.headers.authorization || "";
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) jika tidak ada di header, cek cookie "token"
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // isi req.user sesuai sistemmu
    req.user = { userId: decoded.userId, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    console.error("authenticateJWT error:", err);
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }
};
