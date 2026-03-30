console.log("🔥 JS cargó");

async function cargarEmpleados() {
  try {
    console.log("🚀 llamando API...");

    const res = await fetch("http://localhost:3000/api/9box");
    const data = await res.json();

    console.log("📦 DATA:", data); // 👈 CLAVE

    const contenedor = document.getElementById("contenedor");

    data.empleados.forEach(emp => {
      const card = document.createElement("div");
      card.className = "card";

      let imgSrc = emp.FOTO || "https://via.placeholder.com/200x180";

      card.innerHTML = `
        <img class="card-img" src="${imgSrc}" />
        <div class="card-body">
          <div class="nombre">${emp.NOMBRE}</div>
          <div class="cargo">${emp.CARGO}</div>
        </div>
      `;

      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error("❌ ERROR:", error);
  }
}

cargarEmpleados();