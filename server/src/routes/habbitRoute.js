import express from "express";
import * as habbitController from "../controller/habbitController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.authenticateJWT, (req, res) => {
  res.render("habbitPage", {
    title: "Habbit User",
    layout: "layout/main",
  });
});

router.post("/create", authMiddleware.authenticateJWT, habbitController.createHabbit);
router.get("/list", authMiddleware.authenticateJWT, habbitController.listHabits);
//penanda selesai atau belum
router.post("/mark-done", authMiddleware.authenticateJWT, habbitController.markHabitDone);

//statistik habit
router.get("/stats", authMiddleware.authenticateJWT, habbitController.getStats);

// test reminder Habit
router.post("/send-reminder", authMiddleware.authenticateJWT, habbitController.sendDailyReminderController);

export default router;
