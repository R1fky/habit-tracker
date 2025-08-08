import * as authModel from "../model/authModel.js";

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
