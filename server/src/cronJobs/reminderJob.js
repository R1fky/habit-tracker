import cron from "node-cron";
import { sendDailyReminders } from "../controller/reminderController.js";

// Jalankan setiap hari jam 08:00
cron.schedule("0 8 * * *", async () => {
  console.log("📨 Mengirim reminder harian...");
  await sendDailyReminders();
});
