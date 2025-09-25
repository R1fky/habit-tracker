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
router.get("/list", authMiddleware.authenticateJWT, habbitController.listHabits);
//penanda selesai atau belum
router.post("/mark-done", authMiddleware.authenticateJWT, habbitController.markHabitDone);

export default router;
