import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createHabbit = async (req, res) => {
  const { habbitInput, habitDescription } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "User tidak ditemukan", success: false });
  }

  try {
    const habit = await prisma.habit.create({
      data: {
        title: habbitInput,
        description: habitDescription,
        user: { connect: { id: userId } },
      },
    });

    res.json({
      message: "Habbit berhasil ditambahkan",
      success: true,
      habit,
    });
  } catch (error) {
    res.json({
      message: `Gagal Menambahkan Habbit ${error}`,
      success: false,
    });
  }
};

export const listHabits = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.json({
        message: "User Not Found",
      });
    }
    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      success: true,
      habits,
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

    //cek apakah habit milik user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });
    if (!habit || habit.userId !== userId) {
      res.status(400).json({
        success: false,
        message: "Habit tidak ditemukan",
      });
    }

    //cek log hari ini 
    const existingLog = await prisma.habitLog

  } catch (error) {
    console.error("Errornya disini : ", error);
  }
};
