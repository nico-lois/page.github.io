// Variable globales
var clientes = JSON.parse(localStorage.getItem("clientes")); // Lista de clientes
var cadeterias = JSON.parse(localStorage.getItem("cadeterias")); // Lista de cadeterias
var agregarArticuloButton = document.getElementById("agregarArticulo");
var vendedor = JSON.parse(localStorage.getItem("vendedor"));
const inputBuscarCliente = document.getElementById("inputBuscarCliente");
const modalSeleccionCliente = document.getElementById("modalSeleccionCliente");
var articulos = [];
var idPedido;
var pedidoEditar = JSON.parse(localStorage.getItem("pedidoAEditar"));

cargarCadeteria();
cargarDatosAlFormulario();

function cargarDatosAlFormulario() {
  console.log("pedidoEditar", pedidoEditar);
  if (pedidoEditar != null) {
    idPedido = pedidoEditar.id;
    document.getElementById("inputBuscarCliente").value =
      pedidoEditar.cliente.nombreFantasia +
      " - " +
      pedidoEditar.cliente.razonSocial;

    // Convertir y cargar la fecha en el input
    document.getElementById("fechaMostrada").textContent = pedidoEditar.fecha;

    articulos = pedidoEditar.articulos;
    actualizarTablaArticulos();

    // Obtener el valor del nombre de la cadetería del pedido
    var cadeteriaNombre = pedidoEditar.cadeteria.nombreCadeteria;

    // Seleccionar la opción correspondiente en el combo
    var cadeteriaSelect = document.getElementById("cadeteriaId");
    var options = cadeteriaSelect.options;
    for (var i = 0; i < options.length; i++) {
      if (options[i].textContent === cadeteriaNombre) {
        options[i].selected = true;
        break;
      }
    }
  }

  document.getElementById("observacionesPedido").value =
    pedidoEditar.observaciones;
  localStorage.removeItem("pedidoAEditar");
}

// Función para mostrar el modal con los clientes coincidentes
function mostrarModalSeleccionCliente(clientesCoincidentes) {
  const listaClientesElement = document.getElementById("clientes");
  listaClientesElement.innerHTML = "";

  clientesCoincidentes.forEach((cliente) => {
    const li = document.createElement("li");
    li.textContent = `${cliente.nombreFantasia} - ${cliente.razonSocial}`;
    li.onclick = function () {
      inputBuscarCliente.value =
        cliente.nombreFantasia + " - " + cliente.razonSocial;
      cerrarModalSeleccionCliente();
    };
    listaClientesElement.appendChild(li);
  });

  modalSeleccionCliente.style.display = "block";
}

// Función para cerrar el modal de selección de cliente
function cerrarModalSeleccionCliente() {
  modalSeleccionCliente.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function (event) {
  if (event.target == modalSeleccionCliente) {
    cerrarModalSeleccionCliente();
  }
};

// Función para buscar clientes y mostrar el modal
function buscarClientes() {
  const textoBusqueda = inputBuscarCliente.value.trim().toLowerCase();
  const clientesCoincidentes = clientes.filter(
    (cliente) =>
      cliente.nombreFantasia.toLowerCase().includes(textoBusqueda) ||
      cliente.razonSocial.toLowerCase().includes(textoBusqueda)
  );

  if (clientesCoincidentes.length === 1) {
    inputBuscarCliente.value = clientesCoincidentes.nombreFantasia;
  } else if (clientesCoincidentes.length > 1) {
    // Mostrar el modal con los clientes coincidentes
    mostrarModalSeleccionCliente(clientesCoincidentes);
  }
}

//CARGAR LAS CADETERIAS AL COMBO
function cargarCadeteria() {
  if (cadeterias && cadeterias.length > 0) {
    var cadeteriaSelect = document.getElementById("cadeteriaId");
    cadeterias.forEach(function (cadeteria) {
      var option = document.createElement("option");
      option.value = cadeteria.id;
      option.textContent = cadeteria.nombreCadeteria;
      cadeteriaSelect.appendChild(option);
    });
  }
}

function agregarArticuloAlPedido() {
  console.log("articulos dentro de actualizar tabla", articulos);
  let articuloInput = document.getElementById("nombre").value;
  let cantidadInput = document.getElementById("cantidad").value;
  document.getElementById("cantidad").value = "";
  document.getElementById("nombre").value = "";

  if (articuloInput === "" || cantidadInput === "") {
    alert("Por favor, ingresa la cantidad y el nombre del artículo");
    return;
  } else if (cantidadInput <= 0) {
    alert("La cantidad debe ser de al menos 1");
    return;
  }

  let nuevoLineaPedido = {
    cantidad: cantidadInput,
    nombre: articuloInput,
    stock: true,
  };

  articulos.push(nuevoLineaPedido);
  actualizarTablaArticulos();
}

function actualizarTablaArticulos() {
  console.log("articulos dentro de actualizar tabla", articulos);
  let tbody = document.querySelector("#tablaArticulos tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  let contador = 1;
  articulos.forEach(function (articulo) {
    if (articulo.eliminado != true) {
      console.log("Articulo en el foreach", articulo);
      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${contador}</td> 
        <td>${articulo.nombre}</td> 
        <td>${articulo.cantidad}</td> 
        <td>
        <a href="#" onclick="editarArticuloPedido(${contador}, '${articulo.nombre}', ${articulo.cantidad})">
        <i class='bx bx-edit-alt' ></i>
            </a>
      </td>

        <td>
        <a href="#" onclick="eliminarArticuloDelPedido(${contador})">
        <i class='bx bx-x'></i>
            </a>
        </td>
        `;
      console.log("if", !articulo.stock);
      if (!articulo.stock) {
        row.classList.add("fila-sin-stock");
      }
      tbody.appendChild(row);
      contador++;
    }
  });
}

function eliminarArticuloDelPedido(pos) {
  // Eliminar el artículo del arreglo
  articulos.splice(pos - 1, 1);
  actualizarTablaArticulos();
}

function editarArticuloPedido(pos, articulo, cantidad) {
  articulos.splice(pos - 1, 1);
  document.getElementById("cantidad").value = cantidad;
  document.getElementById("nombre").value = articulo;
  actualizarTablaArticulos();
}

function buscarClienteSeleccionado(nombreFantasiaBuscado) {
  const textoBusqueda = nombreFantasiaBuscado.trim().toLowerCase();
  const clienteEncontrado = clientes.find(
    (cliente) =>
      cliente.nombreFantasia.trim().toLowerCase() +
        " - " +
        cliente.razonSocial.trim().toLowerCase() ===
      textoBusqueda
  );
  console.log("cliente encontrado", clienteEncontrado);
  return clienteEncontrado ? clienteEncontrado.id : -1;
}

async function agregarPedido() {
  let clienteSeleccionado = buscarClienteSeleccionado(
    document.getElementById("inputBuscarCliente").value
  );

  console.log(clienteSeleccionado);
  if (clienteSeleccionado == -1) {
    return alert("Revisa la seleccion de cliente");
  }

  if (articulos.length === 0) {
    alert("Por favor, agrega al menos un artículo");
    return;
  }

  let pedido = {
    clienteId: clienteSeleccionado,
    cadeteriaId: document.getElementById("cadeteriaId").value,
    vendedorId: vendedor.id,
    pedidoId: idPedido,
    articulos: articulos,
    observacion: document.getElementById("observacionesPedido").value,
  };

  console.log("cliselec", pedido.clientesId);
  console.log("cadeteriaid", pedido.cadeteriaId);
  console.log("idpedido", pedido.idPedido);
  console.log("vende", pedido.vendedorId);
  console.log("array", pedido.articulos);

  const request = await fetch("http://localhost:8080/agregarPedido", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  });

  const response = await request.json();

  if (request.ok) {
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      window.location.href = "home-vendedor.html";
    } else {
      alert("mal response.pedidos");
    }
  } else {
    alert("mal request");
  }
}
