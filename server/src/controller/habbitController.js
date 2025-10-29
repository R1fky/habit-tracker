import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { sendDailyReminders } from "../controller/reminderController.js";

export const createHabbit = async (req, res) => {
  try {
    const userId = req.user?.userId; // pastikan ambil userId dengan benar
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan (unauthorized)",
      });
    }

    const { title, icon } = req.body;

    const newHabit = await prisma.habit.create({
      data: {
        title,
        userId,
      },
    });

    res.json({
      success: true,
      message: "Habit berhasil ditambahkan",
      habit: newHabit,
    });
  } catch (error) {
    console.error("Error createHabbit:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan di server",
    });
  }
};

export const listHabits = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!userId) {
      res.json({
        message: "User Not Found",
      });
    }
    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
      },
      include: {
        logs: {
          where: { date: today },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = habits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      isDone: habit.logs.length > 0, // ✅ cek apakah sudah ada log untuk hari ini
    }));
    res.json({
      success: true,
      habits: formatted,
    });
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({
      success: false,
      message: "Terjadi Kesalahan Pada Server",
    });
  }
};

//mark habit done/not done
export const markHabitDone = async (req, res) => {
  try {
    const { habitId } = req.body;
    const userId = req.user?.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset waktu

    // cek apakah habit milik user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });
    if (!habit || habit.userId !== userId) {
      return res.status(400).json({
        success: false,
        message: "Habit tidak ditemukan",
      });
    }

    // cek log hari ini
    const existingLog = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId, date: today } },
    });

    if (existingLog) {
      // kalau sudah ada → hapus (jadi belum selesai)
      await prisma.habitLog.delete({ where: { id: existingLog.id } });
      return res.json({
        success: true,
        done: false,
        message: "Habit ditandai belum selesai",
      });
    } else {
      // kalau belum ada → buat baru (jadi selesai)
      await prisma.habitLog.create({
        data: { habitId, date: today },
      });
      return res.json({
        success: true,
        done: true,
        message: "Habit ditandai selesai",
      });
    }
  } catch (error) {
    console.error("Errornya disini : ", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// status habit
export const getStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User tidak ditemukan" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total habit user
    const totalHabits = await prisma.habit.count({ where: { userId } });

    // Total habits selesai hari ini
    const completedToday = await prisma.habitLog.count({
      where: {
        habit: { userId },
        date: today,
      },
    });

    // Ambil semua habit + log untuk hitung streak
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: { logs: { orderBy: { date: "desc" } } },
    });

    let longestStreak = 0;
    for (let habit of habits) {
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let log of habit.logs) {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break; // streak terputus
        }
      }
      longestStreak = Math.max(longestStreak, streak);
    }

    res.json({
      success: true,
      stats: {
        totalHabits,
        completedToday,
        longestStreak,
        progressPercent: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error getStats:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

export const sendDailyReminderController = async (req, res) => {
  try {
    await sendDailyReminders();
    res.json({ success: true, message: "Reminder terkirim" });
  } catch (error) {
    console.error("Error kirim reminder:", error);
    res.status(500).json({ success: false, message: "Gagal mengirim reminder" });
  }
};

// progres mingguan
export const getWeeklyProgress = async (req, res) => {
  try {
    const userId = req.user?.userId;

    //ambil 7 hari kebelakang dimulai dari start
    const end = new Date(); //ambil tanggal hari
    const start = new Date();
    start.setDate(end.getDate() - 6);

    //ambil semua habit user login lognya 7 hari terakhir
    //gte = greater than or equal → tanggal lebih besar atau sama dengan start.
    //lte = less than or equal → tanggal lebih kecil atau sama dengan end.
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
        },
      },
    });

    const data = habits.map((habit) => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start); //log pada start berisi 7 hari sebelumnya
        d.setDate(start.getDate() + i);

        //membuat log true jika ada yang sama dengan tanggal log pada database
        const isDone = habit.logs.some((log) => new Date(log.date).toDateString() === d.toDateString());

        days.push({
          date: d.toDateString().split("T")[0],
          done: isDone, //
        });
      }

      return {
        id: habit.id,
        title: habit.title,
        progress: days,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error getWeeklyProgress:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil progress mingguan" });
  }
};
