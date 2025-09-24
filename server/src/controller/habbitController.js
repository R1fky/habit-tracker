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
