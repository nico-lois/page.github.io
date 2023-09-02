var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
var cliente = JSON.parse(localStorage.getItem("cliente"));

actualizarTabla();

function actualizarTabla() {
  console.log("cad", cadeterias);
  console.log(cliente);
  let tbody = document.querySelector("#tablaCadeterias tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";

  if (cadeterias && Array.isArray(cadeterias)) {
    cadeterias.forEach(function (cadeteria) {
      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = ` 
          <td>${cadeteria.id}</td>       
          <td>${cadeteria.nombreCadeteria}</td>
          <td>${cadeteria.direccionEntrega}</td>
          <td>${cadeteria.nombreContacto}</td>
          <td>${cadeteria.mail}</td>
          <td>${cadeteria.telefono}</td>     
          <td>
          <a href="#" onclick="modificarCadeteriaPreferencia(${cadeteria.id})">
          <i class='${
            cliente.cadeteriaDePreferencia &&
            cadeteria.id === cliente.cadeteriaDePreferencia.id
              ? "bx bx-heart"
              : "bx bx-like"
          }'></i>
          </a>
          </td> `;
      tbody.appendChild(row);
    });
  }
}

async function modificarCadeteriaPreferencia(valorSeleccionado) {
  const request = await fetch(
    "http://localhost:8080/cliente/modificarCadeteria?id=" +
      cliente.id +
      "&cadeteriaDePreferencia=" +
      valorSeleccionado,
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
      localStorage.setItem("cliente", JSON.stringify(response.cliente));
      cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
      cliente = JSON.parse(localStorage.getItem("cliente"));
      alert(response.mensaje);
      actualizarTabla();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}
