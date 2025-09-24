import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  // Ambil token dari header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan", success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded; // simpan info user di req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid", success: false });
  }
};
