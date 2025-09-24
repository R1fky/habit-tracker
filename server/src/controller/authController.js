import * as authModel from "../model/authModel.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({
        message: "User Not Found",
      });
    }

    const math = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    if (!math) {
      return res.json({
        message: "Invalid Password",
      });
    }
    res.status(200).json({
      message: "Login Berhasil",
      success: true,
      token,
      user : {
        id : user.id,
        email : user.email,
      }
    });
  } catch (error) {
    res.status(200).json({
      message: "Login Berhasil",
      success: false,
    });
    console.log("ERROR : ", error);
  }
};
