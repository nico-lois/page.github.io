var clientes = JSON.parse(localStorage.getItem("clientes")); // Lista de clientes
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo

localStorage.removeItem("cadeteriaEditar");
localStorage.removeItem("clienteEditar");
console.log("clientes", clientes);

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
  let tbody = document.querySelector("#tablaClientes tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (clientes && Array.isArray(clientes)) {
    clientes.forEach(function (cliente, index) {
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
          <td>${cliente.cadeteriaDePreferencia.nombreCadeteria}</td>  
          
          <td>
        <a href="#" onclick="editar(${cliente.id})">
        <i class='bx bx-edit-alt' ></i>
            </a>
        </td>`;
      if (localStorage.getItem("tipo") == "Admin") {
        row.innerHTML += `<td>
        <a href="#" onclick="modalCargarPDF(${cliente.id})">
        <i class='bx bx-upload'></i>
        </a>
      </td>`;
      }
      if (cliente.pdfData != null) {
        row.innerHTML += `<td>
      <a href="#" onclick="abrirPDF(${cliente.id})">
      <i class='bx bx-download'></i>
          </a>
      </td>`;
      } else {
        row.innerHTML += `<td>-</td>`;
      }
      row.innerHTML += `
        <td>
        <a href="#" onclick="eliminar(${cliente.id})">
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
  for (let i = 0; i < clientes.length; i++) {
    const element = clientes[i];
    if (element.id == id) {
      return element;
    }
  }
}

function editar(clienteid) {
  let cliente = buscarPorId(clienteid);
  let usuario = localStorage.getItem("tipo");
  window.location.href = `editar-cliente-${usuario}.html`;
  localStorage.setItem("clienteEditar", JSON.stringify(cliente));
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
        localStorage.setItem("clientes", JSON.stringify(response.clientes));
        alert(response.mensaje);
        clientes = JSON.parse(localStorage.getItem("clientes"));
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

function modalCargarPDF(idcliente) {
  let cliente = clientes.find((c) => c.id === idcliente);
  if (cliente) {
    // Mostrar el modal
    let pdfModal = document.getElementById("pdfModal");
    pdfModal.classList.add("show");
    pdfModal.style.display = "block";

    // Obtener los elementos del modal
    let pdfFileInput = document.getElementById("pdfFile");
    let btnSave = document.getElementById("btnSavePDF");

    // Agregar evento al botón de guardar
    btnSave.addEventListener("click", function () {
      if (pdfFileInput.files.length > 0) {
        guardarPDF(pdfFileInput.files[0], cliente);
        pdfModal.style.display = "none";
        clientes = JSON.parse(localStorage.getItem("clientes"));
        actualizarTabla();
      } else {
        alert("Por favor, selecciona un archivo PDF.");
      }
    });
  } else {
    alert("Cliente No Encontrado");
  }
}

async function guardarPDF(pdfFile, cliente) {
  //ACA SE HACE EL TECH
  if (pdfFile) {
    cargarPDF(cliente, pdfFile);
    actualizarTablaClientes();
  } else {
    alert("No se seleccionó ningún archivo PDF.");
  }
}
