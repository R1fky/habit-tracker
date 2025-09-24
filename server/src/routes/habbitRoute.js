import express from "express";
import * as habbitController from "../controller/habbitController.js";
import * as  authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("habbitPage", {
    title: "Habbit User",
    layout: "layout/main",
  });
});

router.post("/create", authMiddleware.authenticateJWT, habbitController.createHabbit);

export default router;
