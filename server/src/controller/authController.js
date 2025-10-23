import * as authModel from "../model/authModel.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const getregisterUser = async (req, res) => {
  try {
    res.render("pages/register", {
      layout: "layout/main",
      title: "Register Page",
    });
  } catch (error) {
    res.json({
      message: "Error View Layouts",
      error: error.message,
    });
  }
};

//proses register
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.json({
        message: "pengguna seudah terdaftar",
      });
    }

    await authModel.regis(email, password);
    res.status(201).json({
      message: "Register Anda Berhasil",
      success: true,
    });
  } catch (error) {
    console.error(" Error saat registrasi:", error); // Log error
    res.status(400).json({
      message: "Register Gagal",
      success: false,
      error: error.message,
    });
  }
};

export const getLoginPage = (req, res) => {
  res.render("pages/login", {
    title: "Silahkan Login",
    layout: "layout/main",
  });
};

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.json({
//         message: "User Not Found",
//       });
//     }

//     const math = await bcrypt.compare(password, user.password);

//     const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

//     if (!math) {
//       return res.json({
//         message: "Invalid Password",
//       });
//     }
//     res.status(200).json({
//       message: "Login Berhasil",
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(200).json({
//       message: "Login Berhasil",
//       success: false,
//     });
//     console.log("ERROR : ", error);
//   }
// };

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ success: false, message: "Password salah" });
    }

    //create token jwt
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true kalau pakai HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
    });

    return res.json({
      success: true,
      message: "Login berhasil",
      user: { id: user.id, name: user.name, email: user.email },
    });

    console.log("✅ Token lokal berhasil dibuat:", token);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};
