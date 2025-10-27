const token = localStorage.getItem("token");

async function getHabits() {
  try {
    const response = await fetch("/habbit/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    const habitList = document.getElementById("habitList");

    habitList.innerHTML = ""; //hapus kotent lama paa html
    const habits = result.habits || result;
    // Pastikan result berisi array habit
    if (!Array.isArray(habits) || habits.length === 0) {
      habitList.innerHTML = `<p class="text-gray-500 italic">Belum ada kebiasaan hari ini.</p>`;
      return;
    }

    // // Loop dan tambahkan elemen baru
    habits.forEach((habit) => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center border-b pb-2";

      // status button style
      const isDone = habit.isDone || habit.status === "done";
      const btnClass = isDone ? "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition" : "bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition";
      const btnText = isDone ? "Selesai" : "Belum";

      div.innerHTML = `
        <span>${habit.icon || "✅"} ${habit.title}</span>
        <button class="${btnClass}" data-id="${habit.id}">${btnText}</button>
      `;

      // Tambahkan event toggle ke button
      const btn = div.querySelector("button");
      btn.addEventListener("click", () => toggleHabit(habit.id, btn));

      habitList.appendChild(div);
    });
  } catch (error) {
    console.log("error Mesage :", error);
  }
}
document.addEventListener("DOMContentLoaded", getHabits);

// --- Modal Handling ---
const modal = document.getElementById("modalAddHabit");
const btnAddHabit = document.getElementById("btnAddHabit");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCloseX = document.getElementById("btnCloseX");
const formAddHabit = document.getElementById("formAddHabit");

btnAddHabit.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

[btnCloseModal, btnCloseX].forEach((btn) => btn.addEventListener("click", () => modal.classList.add("hidden")));

// --- Submit Habit Baru ---
formAddHabit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("habitTitle").value.trim();
  const icon = document.getElementById("habitIcon").value.trim();

  if (!title) return alert("Nama kebiasaan wajib diisi!");

  try {
    const response = await fetch("/habbit/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, icon }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Habit berhasil ditambahkan!");
      modal.classList.add("hidden");
      formAddHabit.reset();
      getHabits(); // refresh daftar habit
    } else {
      alert(result.message || "Gagal menambah habit");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat menambah habit");
  }
});

async function toggleHabit(habitId, statusSpan, toggleBtn) {
  try {
    const response = await fetch("/habbit/mark-done", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ habitId }),
    });

    const result = await response.json();
    console.log("Ini data dari back-end : ", result);

    if (result.success) {
      if (result.done) {
        statusSpan.textContent = "Selesai";
        statusSpan.className = "px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full";

        toggleBtn.textContent = "Batalkan";
        toggleBtn.className = "px-3 py-1 text-white rounded-lg transition-all duration-200 font-medium shadow-md bg-red-500 hover:bg-red-600";
      } else {
        statusSpan.textContent = "Belum";
        statusSpan.className = "px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full";

        toggleBtn.textContent = "Tandai Selesai";
        toggleBtn.className = "px-3 py-1 text-white rounded-lg transition-all duration-200 font-medium shadow-md bg-blue-500 hover:bg-blue-600";
      }
    } else {
      Swal.fire("Oops", result.message || "Gagal mengubah status habit", "error");
    }
  } catch (error) {
    console.log("Error Message : ", error);
  }
}

async function addHabit() {
  const habbitData = {
    habbitInput: document.getElementById("habitInput").value.trim(),
    habitDescription: document.getElementById("habitDescription").value.trim(),
  };

  try {
    const response = await fetch("/habbit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(habbitData),
    });

    const result = await response.json();

    if (result.success) {
      Swal.fire({
        title: "Habit Berhasil Ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        const habitList = document.getElementById("habitsList");
        const emptyState = document.getElementById("emptyState");
        if (emptyState) emptyState.style.display = "none";

        const card = document.createElement("div");
        card.className = "p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all flex flex-col justify-between";

        card.innerHTML = `
    <div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">${result.habit.title}</h3>
      <p class="text-gray-500 text-sm">${result.habit.description || "Tidak ada deskripsi"}</p>
    </div>
    <div class="mt-4 flex justify-end">
      <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Baru</span>
    </div>
  `;

        habitList.appendChild(card);

        // kosongkan form input
        document.getElementById("habitInput").value = "";
        document.getElementById("habitDescription").value = "";
      });
    } else {
      Swal.fire({
        title: "Habit Gagal Ditambahkan",
        text: result.message || "Coba lagi nanti",
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    Swal.fire({
      title: "Terjadi Kesalahan",
      text: error.message,
      icon: "error",
    });
  }
}

async function loadStats() {
  try {
    const response = await fetch("/habbit/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      document.getElementById("completedToday").innerText = result.stats.completedToday;
      document.getElementById("totalHabits").innerText = result.stats.totalHabits;
      document.getElementById("longestStreak").innerText = result.stats.longestStreak;

      // update progress bar
      const progress = result.stats.progressPercent;
      const bar = document.getElementById("progressBar");
      bar.style.width = progress + "%";
      bar.innerText = progress + "%";
    }
  } catch (error) {
    console.error("Gagal load stats:", error);
  }
}
// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadStats();
});

document.getElementById("sendReminderBtn").addEventListener("click", async () => {
  const statusEl = document.getElementById("reminderStatus");
  statusEl.innerText = "Mengirim reminder...";

  try {
    const response = await fetch("/habbit/send-reminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      statusEl.innerText = "✅ Reminder terkirim!";
    } else {
      statusEl.innerText = "❌ Gagal mengirim reminder: " + result.message;
    }
  } catch (err) {
    console.error(err);
    statusEl.innerText = "❌ Terjadi kesalahan saat mengirim reminder";
  }
});
