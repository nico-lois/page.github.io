var clientes = JSON.parse(localStorage.getItem("clientes")); // Lista de clientes
localStorage.removeItem("cadeteriaEditar");
localStorage.removeItem("clienteEditar");
console.log("clientes", clientes);
actualizarTabla();

function actualizarTabla() {
  let tbody = document.querySelector("#tablaClientes tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (clientes && Array.isArray(clientes)) {
    clientes.forEach(function (cliente, index) {
      console.log("index", index);
      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = `  
      <td>${cliente.id}</td>          
      <td>${cliente.nombreFantasia}</td>
      <td>${cliente.razonSocial}</td>
      <td>${cliente.mail}</td>
      <td>${cliente.nombreCompleto}</td>  
      <td>${cliente.nombreResponsable}</td>  
      <td>${cliente.celular}</td>  
      <td>${cliente.cadeteriaDePreferencia.nombreCadeteria}</td>`;
      if (index % 2 != 0) {
        row.classList.add("fila-par");
      }
      tbody.appendChild(row);
    });
  }
}

function buscarPorId(id) {
  for (let i = 0; i < clientes.length; i++) {
    const element = clientes[i];
    if (element.id == id) {
      return element;
    }
  }
}

function editar(clienteid) {
  let cliente = buscarPorId(clienteid);
  window.location.href = "editar-cliente-Aux.html";
  localStorage.setItem("clienteEditar", JSON.stringify(cliente));
}

function agregar() {
  window.location.href = "agregar-cliente.html";
}

async function eliminar(id) {
  let confirmacion = confirm(
    "¿Estás seguro de que quieres eliminar este elemento?"
  );
  if (confirmacion) {
    // Código para eliminar el elemento
    const request = await fetch(
      `http://localhost:8080/eliminarCliente?idCliente=${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const response = await request.json();
    if (request.ok) {
      if (response.clientes) {
        clientes = localStorage.setItem(
          "clientes",
          JSON.stringify(response.clientes)
        );
        alert(response.mensaje);
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

//Aca el fetch /eliminarCliente
