import * as authModel from "../model/authModel.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

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

// proses login

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export const getLoginPage = (req, res) => {
  res.render("pages/login", {
    layout: "layout/main",
    title: "Silahkan Login",
  });
};

export const getLogin = async (req, res) => {
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

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        message: "Password Invalid",
      });
    }

    const token = generateToken();
    res.json({
      token,
    });
  } catch (error) {
    return res.json({
      message: "Server Error",
    });
  }
};
