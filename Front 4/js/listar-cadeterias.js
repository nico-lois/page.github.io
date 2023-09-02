var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo
localStorage.removeItem("cadeteriaEditar");
localStorage.removeItem("clienteEditar");
console.log("cad", cadeterias);

actualizarTabla();
cargarModoActual();

// Modo oscuro
function cargarModoActual() {
  if (modoOscuroGuardado === "true") {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.add("dark");
  } else {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.remove("dark");
  }
}

function actualizarTabla() {
  let tbody = document.querySelector("#tablaCadeterias tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (cadeterias && Array.isArray(cadeterias)) {
    cadeterias.forEach(function (cadeteria, index) {
      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = ` 
          <td>${cadeteria.id}</td>       
          <td>${cadeteria.nombreCadeteria}</td>
          <td>${cadeteria.direccionEntrega}</td>
          <td>${cadeteria.mail}</td>
          <td>${cadeteria.telefono}</td>  
          
          <td>
          <a href="#" onclick="editar(${cadeteria.id})">
          <i class='bx bx-edit-alt' ></i>
              </a>
          </td>
          
          <td>
          <a href="#" onclick="eliminar(${cadeteria.id})">
          <i class='bx bx-message-square-x'></i>
              </a>
          </td>`;
      if (index % 2 != 0) {
        row.classList.add("fila-par");
      }
      tbody.appendChild(row);
    });
  }
}

function buscarPorId(id) {
  for (let i = 0; i < cadeterias.length; i++) {
    const element = cadeterias[i];
    if (element.id == id) {
      return element;
    }
  }
}

function editar(cadeteriaId) {
  let cadeteria = buscarPorId(cadeteriaId);
  let usuario = localStorage.getItem("tipo");
  window.location.href = `editar-cadeteria-${usuario}.html`;
  localStorage.setItem("cadeteriaEditar", JSON.stringify(cadeteria));
}

function agregar() {
  window.location.href = "agregar-cadeteria.html";
}

async function eliminar(id) {
  let confirmacion = confirm(
    "¿Estás seguro de que quieres eliminar este elemento?"
  );
  if (confirmacion) {
    // Código para eliminar el elemento
    const request = await fetch(
      `http://localhost:8080/eliminarCadeteria?cadeteriaid=${id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const response = await request.json();
    if (request.ok) {
      if (response.cadeterias) {
        localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
        alert(response.mensaje);
        cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
        actualizarTabla();
      } else {
        alert(response.mensaje);
      }
    } else {
      alert(request.status);
    }
  } else {
    // Código para cancelar la acción
  }
}
