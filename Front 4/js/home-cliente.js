// Aca vemos que hacer con lo que trajimos del fetch del login
var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var cliente = JSON.parse(localStorage.getItem("cliente"));
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo

actualizarNombreCliente();
actualizarTablaPedidos();
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

// Funcion para actualizar tabla de pedidos
function actualizarTablaPedidos() {
  console.log("pedidos al inciar actualizar tabla", pedidos);
  let tbody = document.querySelector("#tablaPedidos tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (pedidos && Array.isArray(pedidos)) {
    let filtro = document.getElementById("estado").value;
    let pedidosFiltrados = pedidos;

    if (filtro == "preparacion") {
      pedidosFiltrados = pedidos.filter(
        (p) => p.marcadoRecibidoPorCliente == false
      );
    } else if (filtro == "recibido") {
      pedidosFiltrados = pedidos.filter(
        (p) => p.marcadoRecibidoPorCliente == true
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
        <td>${estadoFormateado}</td>
        <td>${pedido.vendedor.nombreCompleto}</td>
        <td>${pedido.cadeteria.nombreCadeteria}</td>   
        <td>${fechaFormateada}</td>
        <td>${pedido.marcadoRecibidoPorCliente ? "SI" : "NO"}</td> 
         
        <td>
          <a href="#" onclick="mostrarDetallePedido(${pedido.id})">
            <i class='bx bx-search-alt-2'></i>
          </a>
        </td>`;

      if (!pedido.marcadoRecibidoPorCliente && pedido.estado === "ENTREGADO") {
        row.innerHTML += `
        <td>
          <a href="#" onclick="marcacionEntregado(${pedido.id})">
            <i class='bx bx-check-circle' ></i>
          </a>
        </td>`;
      } else {
        row.innerHTML += `
        <td>
          -
        </td>`;
      }

      //esto hay que cambiarlo a  if (pedido.estado === "ENTREGADO") { despues de testearlo
      if (pedido.estado == "ENTREGADO" && pedido.valoracion == 0) {
        row.innerHTML += `
        <td>
          <a href="#" onclick="modalValorarPedido(${pedido.id})">
          <i class="bx bx-star"></i>
          </a>
        </td>`;
      } else if (pedido.estado == "ENTREGADO" && pedido.valoracion != 0) {
        row.innerHTML += `
        <td>
          <a href="#" onclick="modalValorarPedido(${pedido.id})">
          <i class="bx bxs-star"></i>
          </a>
        </td>`;
      } else {
        row.innerHTML += `
        <td>
          -
        </td>`;
      }
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
  console.log("Pedido id", idPedido);
  let pedido = pedidos.find((p) => p.id === idPedido);
  if (pedido) {
    console.log("pedido encontrado", pedido);
    // Actualizar el contenido del modal con los detalles del pedido
    document.getElementById("detalleIdPedido").innerHTML = pedido.id;
    document.getElementById("detalleEstadoPedido").innerHTML =
      pedido.estado.replace(/_/g, " ");
    document.getElementById("detalleVendedorPedido").innerHTML =
      pedido.vendedor.nombreCompleto;
    document.getElementById("detalleCadeteriaPedido").innerHTML =
      pedido.cadeteria.nombreCadeteria;
    document.getElementById("detalleFechaPedido").innerHTML = new Date(
      pedido.fecha
    ).toLocaleDateString("es-ES", { dateStyle: "medium" });

    pedido.marcadoEntregadoPorCliente
      ? (document.getElementById("detalleRecibido").innerHTML = "SI")
      : (document.getElementById("detalleRecibido").innerHTML = "NO");

    // Llenar la tabla con los artículos del pedido
    const tablaArticulos = document.getElementById("tablaArticulos");
    tablaArticulos.innerHTML = "";
    let contador = 0;
    pedido.articulos.forEach((articulo) => {
      if (articulo.eliminado == false) {
        contador++;
        const fila = document.createElement("tr");
        fila.className = articulo.eliminado
          ? "fila-eliminada"
          : articulo.agregado
          ? "fila-agregada"
          : "";
        fila.innerHTML = `
      <td>${articulo.nombre}</td>
      <td>${articulo.cantidad}</td>
    `;
        tablaArticulos.appendChild(fila);
      }
    });

    // Mostrar el modal utilizando las clases de Bootstrap
    let modal = document.getElementById("pedidoModal");
    modal.classList.add("show");
    modal.style.display = "block";
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
}

// Evento para cerrar el modal al hacer clic en la "x" de la derecha y fuera del modal
document
  .querySelector(".modal-header .close")
  .addEventListener("click", cerrarModal);
document.querySelector(".modal").addEventListener("click", function (event) {
  if (event.target === this) {
    cerrarModal();
    document.getElementById("modalValoracion").style.display = "none";
  }
});

async function marcacionEntregado(idPedido) {
  const request = await fetch(
    `http://localhost:8080/cliente/marcadoRecibidoPorCliente?id=${idPedido}&idCliente=${cliente.id}`,
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
      console.log("Esto es response.pedidos", response.pedidos);
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

function actualizarNombreCliente() {
  if (cliente) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreCliente"
    ).textContent = `Hola, ${cliente.nombreCompleto}.`;
  }
}

async function estadoDeCuenta() {
  abrirPDF(cliente.id);
}

async function actualizarPedidos() {
  const request = await fetch(
    `http://localhost:8080/actualizarPedidosClientes?idCliente=${cliente.id}`,
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
      alert("La tabla se ha actualizado con exito");
      actualizarTablaPedidos();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function modalValorarPedido(idPedido) {
  let pedido = pedidos.find((p) => p.id === idPedido);
  if (pedido) {
    // Mostrar el modal
    let modalValoracion = document.getElementById("modalValoracion");
    modalValoracion.classList.add("show");
    modalValoracion.style.display = "block";

    // Obtener los botones de estrella
    const botonesEstrella = document.querySelectorAll(".btnValorar");

    // Agregar evento a cada botón de estrella
    botonesEstrella.forEach((boton, index) => {
      boton.addEventListener("click", function () {
        const valorEstrella = index + 1; // Valor de la estrella (1 al 5)
        valorar(valorEstrella, pedido); // Llama a la función valorar() con el valor de la estrella
        modalValoracion.style.display = "none";
      });
    });

    // Agregar evento al botón de cerrar
    const cerrarModal = document.getElementById("cerrarModal");
    cerrarModal.addEventListener("click", function () {
      modalValoracion.style.display = "none";
    });
  } else {
    alert("Pedido No Encontrado");
  }
}

async function valorar(valor, pedido) {
  alert("Nico sos un cra", valor, pedido);

  const request = await fetch(
    `http://localhost:8080/cliente/valorar?id=${pedido.id}&idCliente=${cliente.id}&valor=${valor}`,
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
      console.log("Esto es response.pedidos", response.pedidos);
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

//////////// AGREGAR EL EFECTO A LAS ESTRELLAS  //////////////
const btnsConfirmar = document.querySelectorAll(".btnValorar");
btnsConfirmar.forEach((btn, index) => {
  btn.addEventListener("mouseenter", () => {
    btnsConfirmar.forEach((btn, i) => {
      if (i <= index) {
        btn.classList.add("hovered");
      }
    });
  });

  btn.addEventListener("mouseleave", () => {
    btnsConfirmar.forEach((btn) => {
      btn.classList.remove("hovered");
    });
  });
});
