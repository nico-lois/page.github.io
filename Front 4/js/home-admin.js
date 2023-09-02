var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var clientes = JSON.parse(localStorage.getItem("clientes"));
var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
let admin = JSON.parse(localStorage.getItem("admin"));
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo
localStorage.removeItem("cadeteriaEditar");
localStorage.removeItem("clienteEditar");
console.log(pedidos);
console.log("Prueba de Clientes", clientes);
console.log("Prueba de Cadeterias", cadeterias);

actualizarNombreAdmin();
actualizarTablaPedidos();
cargarClientes();
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

function cargarClientes() {
  var clienteSelect = document.getElementById("filtroCliente");
  // Agregar la opción "Seleccione..." al principio del select
  var optionSeleccione = document.createElement("option");
  optionSeleccione.value = ""; // Valor vacío
  optionSeleccione.textContent = "Seleccione...";
  clienteSelect.appendChild(optionSeleccione);

  if (clientes && clientes.length > 0) {
    clientes.forEach(function (cliente) {
      var option = document.createElement("option");
      option.value = cliente.id;
      option.textContent = cliente.nombreFantasia + " - " + cliente.razonSocial;
      clienteSelect.appendChild(option);
    });
  }
}

function actualizarTablaPedidos() {
  let tbody = document.querySelector("#tablaPedidos tbody");
  console.log("Prueba de Clientes", clientes);
  console.log("Prueba de Cadeterias", cadeterias);
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (pedidos && Array.isArray(pedidos)) {
    let filtro = document.getElementById("estado").value;
    let pedidosFiltrados = pedidos;

    if (filtro == "Facturados") {
      pedidosFiltrados = pedidos.filter(
        (p) =>
          p.estado == "FACTURADO" ||
          p.estado == "ENTREGADO" ||
          p.estado == "LISTO"
      );
    } else if (filtro == "Pendientes") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "FACTURACION");
    }

    //EN AMBOS CASOS: 1 usar la variable anterior para aplicar el filter

    //SEGUNDO FILTRO
    let filtroFechaDesde = document.getElementById("filtroFechaDesde").value;
    let filtroFechaHasta = document.getElementById("filtroFechaHasta").value;
    let filtroCliente = document.getElementById("filtroCliente").value;
    console.log("filtrofechaDESDE", filtroFechaDesde);
    console.log("filtroFechaHASTA", filtroFechaHasta);
    console.log("filtroCLIENTE", filtroCliente);
    if (filtroFechaDesde != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.fecha >= filtroFechaDesde
      );
    }

    if (filtroFechaHasta != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.fecha <= filtroFechaHasta
      );
    }

    if (filtroCliente != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.cliente.id == filtroCliente
      );
    }

    pedidosFiltrados.forEach(function (pedido, index) {
      // Formatear la fecha en formato de fecha
      let fecha = new Date(pedido.fecha);
      let fechaFormateada = fecha.toLocaleDateString("es-ES", {
        dateStyle: "medium",
      });

      // Formatear el estado con espacios
      let estadoFormateado = pedido.estado.replace(/_/g, " ");

      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = `  
          <td>${pedido.id}</td>      
          <td>${fechaFormateada}</td>
          <td>${estadoFormateado}</td>
          <td>${pedido.vendedor.nombreCompleto}</td>
          <td>${
            pedido.cliente.nombreFantasia + " -  " + pedido.cliente.razonSocial
          }</td>
          <td>${pedido.cadeteria.nombreCadeteria}</td>
          <td>${pedido.marcadoEntregadoPorCLiente ? "SI" : "NO"}</td>  

          <td>
        <a href="#" onclick="mostrarDetallePedido(${pedido.id})">
        <i class='bx bx-search-alt-2'></i>
            </a>
        </td>`;
      if (pedido.estado == "FACTURACION") {
        row.innerHTML += `
        <td>
        <a href="#" onclick="pedidoFacturado(${pedido.id})">
        <i class='bx bx-spreadsheet'></i>
            </a>
        </td>`;
      } else {
        row.innerHTML += `
        <td>-</td>`;
      }
      // if (pedido.pdfData != null) {
      row.innerHTML += `<td>
              <a href="#" onclick="generarPDF(${pedido.id})">
              <i class='bx bxs-file-pdf'></i>
              </a>
            </td>`;
      //     } else {
      //       row.innerHTML += `<td>
      // -
      //         </td>`;
      //     }

      if (index % 2 != 0) {
        row.classList.add("fila-par");
      }
      tbody.appendChild(row);
    });
  }
}

// Función para mostrar los detalles del pedido en el modal
function mostrarDetallePedido(idPedido) {
  // Buscar el pedido por su ID en el arreglo de pedidos
  var pedido = pedidos.find((p) => p.id === idPedido);
  if (pedido) {
    // Actualizar el contenido del modal con los detalles del pedido
    document.getElementById("detalleIdPedido").innerHTML = pedido.id;
    document.getElementById("detalleFechaPedido").innerHTML = new Date(
      pedido.fecha
    ).toLocaleDateString("es-ES", { dateStyle: "medium" });
    document.getElementById("detalleEstadoPedido").innerHTML =
      pedido.estado.replace(/_/g, " ");
    document.getElementById("detalleClientePedido").innerHTML =
      pedido.cliente.nombreFantasia + " - " + pedido.cliente.razonSocial;
    document.getElementById("detalleCadeteriaPedido").innerHTML =
      pedido.cadeteria.nombreCadeteria;
    pedido.marcadoEntregadoPorCLiente
      ? (document.getElementById("detalleRecibido").innerHTML = "SI")
      : (document.getElementById("detalleRecibido").innerHTML = "NO");

    // Llenar la tabla con los artículos del pedido
    const tablaArticulos = document.getElementById("tablaArticulos");
    tablaArticulos.innerHTML = "";

    pedido.articulos.forEach((articulo) => {
      if (articulo.eliminado == false) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${articulo.nombre}</td>
        <td>${articulo.cantidad}</td>
      `;
        tablaArticulos.appendChild(fila);
      }
    });

    // Mostrar el modal
    let modal = document.getElementById("pedidoModal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  } else {
    // Si no se encuentra el pedido, mostrar un mensaje de error
    alert("El pedido no existe.");
  }
}

// Función para cerrar el modal
function cerrarModal() {
  let modal = document.getElementById("pedidoModal");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

// Evento para cerrar el modal al hacer clic en la "x" de la derecha y fuera del modal
document
  .querySelector(".modal-header .close")
  .addEventListener("click", cerrarModal);
document.querySelector(".modal").addEventListener("click", function (event) {
  if (event.target === this) {
    cerrarModal();
  }
});

async function pedidoFacturado(idPedido) {
  const request = await fetch(
    //HAY QUE AGREGAR EL ADMINISTRATIVO EN EL FETCH (EL ID)
    `http://localhost:8080/admin/pedidoFacturado?pedidoId=${idPedido}&admin=${admin.id}`,
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
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      actualizarTablaPedidos();
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function actualizarNombreAdmin() {
  if (admin) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreAdmin"
    ).textContent = `Hola, ${admin.nombreCompleto}.`;
  }
}

async function actualizarPedidos() {
  const request = await fetch(`http://localhost:8080/admin/actualizar`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await request.json();

  if (request.ok) {
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      clientes = JSON.parse(localStorage.getItem("clientes"));
      cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
      alert("La tabla se ha actualizado con exito");
      actualizarTablaPedidos();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}
