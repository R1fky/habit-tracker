const token = localStorage.getItem("token");
console.log(token);

// async function getHabits() {
//   try {
//     const response = await fetch("/habbit/list", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await response.json();

//     const habitList = document.getElementById("habitsList");
//     const emptyState = document.getElementById("emptyState");

//     habitList.innerHTML = "";

//     if (result.success && result.habits.length > 0) {
//       emptyState.style.display = "none";
//       result.habits.forEach((habit) => {
//         const card = document.createElement("div");
//         card.className = "p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all flex flex-col justify-between";

//         const statusClass = habit.isDone ? "px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full" : "px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full";

//         card.innerHTML = `
//     <div>
//       <h3 class="text-xl font-semibold text-gray-800 mb-2">${habit.title}</h3>
//       <p class="text-gray-500 text-sm">${habit.description || "Tidak ada deskripsi"}</p>
//     </div>
//     <div class="mt-4 flex justify-between items-center">
//       <span class="${statusClass}">${habit.isDone ? "Selesai" : "Belum"}</span>
//       <button class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">Toggle</button>
//     </div>
//   `;

//         const toggleBtn = card.querySelector("button");
//         const statusSpan = card.querySelector("span");

//         toggleBtn.addEventListener("click", () => toggleHabitDone(habit.id, statusSpan));

//         habitList.appendChild(card);
//       });
//     } else {
//       emptyState.style.display = "block";
//     }
//   } catch (error) {
//     console.error("Fetch error :", error);
//   }
// }

// Panggil saat page load
async function getHabits() {
  try {
    const response = await fetch("/habbit/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("response List dari back-end : ", result);

    const habitList = document.getElementById("habitsList");
    const emptyState = document.getElementById("emptyState");

    habitList.innerHTML = "";

    if (result.success && result.habits.length > 0) {
      emptyState.style.display = "none";

      result.habits.forEach((habit) => {
        const card = document.createElement("div");
        card.className = "p-5 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all flex flex-col justify-between";

        // buat elemen status
        const statusSpan = document.createElement("span");
        statusSpan.textContent = habit.isDone ? "Selesai" : "Belum";
        statusSpan.className = habit.isDone ? "px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full" : "px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full";

        // tombol toggle
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = habit.isDone ? "Batalkan" : "Tandai Selesai";
        toggleBtn.className = "px-3 py-1 text-white rounded-lg transition-all duration-200 font-medium shadow-md " + (habit.isDone ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600");

        toggleBtn.onclick = () => toggleHabitDone(habit.id, statusSpan, toggleBtn);

        card.innerHTML = `
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">${habit.title}</h3>
            <p class="text-gray-500 text-sm">${habit.description || "Tidak ada deskripsi"}</p>
          </div>
        `;

        const footer = document.createElement("div");
        footer.className = "mt-4 flex justify-between items-center";

        footer.appendChild(statusSpan);
        footer.appendChild(toggleBtn);

        card.appendChild(footer);
        habitList.appendChild(card);
      });
    } else {
      emptyState.style.display = "block";
    }
  } catch (error) {
    console.error("Fetch error :", error);
  }
}

document.addEventListener("DOMContentLoaded", getHabits);

// async function toggleHabitDone(habitId, statusSpan) {
//   try {
//     console.log(habitId);
//     const response = await fetch("/habbit/mark-done", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ habitId }),
//     });

//     const result = await response.json();
//     console.log("Ini data dari back-end : ", result);
//     if (result.success) {
//       if (result.done) {
//         statusSpan.textContent = "Selesai";
//         statusSpan.className = "px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full";
//       } else {
//         statusSpan.textContent = "Belum";
//         statusSpan.className = "px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full";
//       }
//     } else {
//       alert(result.message || "Gagal mengubah status habit");
//     }
//   } catch (error) {
//     console.log("Error Message : ", error);
//   }
// }

async function toggleHabitDone(habitId, statusSpan, toggleBtn) {
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
    console.log("API Response:", result);

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
