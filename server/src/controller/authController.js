import * as authModel from "../model/authModel.js";

export const registerUser = async (req, res) => {
  try {
    const data = "Ini adalah Nilai dikirim dari Controller";

    res.render("pages/register", {
      layout: "layout/main",
      data: data,
      title: "Register Page",
    });
  } catch (error) {
    res.json({
      message: "Error View Layouts",
      error: error.message,
    });
  }
};
