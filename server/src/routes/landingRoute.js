import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("landingPage", {
    title: "Beranda",
    layout: "layout/main",
  });
});

export default router
