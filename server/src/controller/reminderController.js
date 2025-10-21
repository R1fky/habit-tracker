import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail.js";

const prisma = new PrismaClient();

export const sendDailyReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    include: {
      habits: {
        include: {
          logs: {
            where: { date: today }, //log hari ini
          },
        },
      },
    },
  });

  for (const user of users) {
    // ambil habit yang belum selesai hari ini
    const pendingHabits = user.habits.filter((h) => h.logs.length === 0);
    if (pendingHabits.length === 0) continue;

    const html = `
      <h2>Hai ${user.email} 👋</h2>
      <p>Jangan lupa selesaikan habit kamu hari ini!</p>
      <ul>
        ${pendingHabits.map((h) => `<li>${h.title}</li>`).join("")}
      </ul>
      <p>Semangat terus 💪</p>
    `;
    await sendEmail(user.email, "Reminder Habit Hari Ini", html);
  }
};
