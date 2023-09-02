// Variable globales
var clientes = JSON.parse(localStorage.getItem("clientes")); // Lista de clientes
console.log("lista de clientes", clientes);
var cadeterias = JSON.parse(localStorage.getItem("cadeterias")); // Lista de cadeterias
var agregarArticuloButton = document.getElementById("agregarArticulo");
var vendedor = JSON.parse(localStorage.getItem("vendedor"));
const inputBuscarCliente = document.getElementById("inputBuscarCliente");
const modalSeleccionCliente = document.getElementById("modalSeleccionCliente");
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo
var clienteSeleccionado;
var articulos = [];

cargarModoActual();

// Modo oscuro
function cargarModoActual() {
  let body = document.querySelector("body");
  if (modoOscuroGuardado === "true") {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.add("dark");
  } else {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.remove("dark");
  }
}

///////////////////////////// SE CARGA LA FECHA //////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  var fechaActual = new Date();
  var options = { year: "numeric", month: "long", day: "numeric" };
  var fechaFormateada = fechaActual.toLocaleDateString(undefined, options);
  document.getElementById("fechaMostrada").textContent = fechaFormateada;
});

///////////////////////////// SE CARGAN LAS CADETERIAS  //////////////////////////
cargarCadeteria();
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

////////////////////////// LOGICA PARA EL BUSCADOR DE CLIENTE  ///////////////////////////////////////

// Función para buscar clientes y mostrar el modal
function buscarClientes() {
  const textoBusqueda = inputBuscarCliente.value.trim().toLowerCase();
  const clientesCoincidentes = clientes.filter(
    (cliente) =>
      cliente.nombreFantasia.toLowerCase().includes(textoBusqueda) ||
      cliente.razonSocial.toLowerCase().includes(textoBusqueda)
  );

  if (clientesCoincidentes.length === 1) {
    console.log("un solo cliente coincide", clientesCoincidentes);
    inputBuscarCliente.value =
      clientesCoincidentes[0].nombreFantasia +
      " - " +
      clientesCoincidentes[0].razonSocial;

    var cadeteriaIdSelect = document.getElementById("cadeteriaId");
    var cadeteriaPreferenciaCliente =
      clientesCoincidentes[0].cadeteriaDePreferencia;

    console.log("ACA", cadeteriaPreferenciaCliente);
    if (cadeteriaPreferenciaCliente) {
      cadeteriaIdSelect.value = cadeteriaPreferenciaCliente.id;
    }
  } else if (clientesCoincidentes.length > 1) {
    // Mostrar el modal con los clientes coincidentes
    console.log("varios coinciden", clientesCoincidentes);
    mostrarModalSeleccionCliente(clientesCoincidentes);
  }
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
      var cadeteriaIdSelect = document.getElementById("cadeteriaId");
      var cadeteriaPreferenciaCliente = cliente.cadeteriaDePreferencia;

      console.log("ACA", cadeteriaPreferenciaCliente);
      if (cadeteriaPreferenciaCliente) {
        cadeteriaIdSelect.value = cadeteriaPreferenciaCliente.id;
      }
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

function agregarArticuloAlPedido() {
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
  };

  articulos.push(nuevoLineaPedido);
  actualizarTablaArticulos();
}

function actualizarTablaArticulos() {
  let tbody = document.querySelector("#tablaArticulos tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  let contador = 1;

  articulos.forEach(function (articulo) {
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
    tbody.appendChild(row);
    contador++;
    console.log("Clave CONTADOR", contador);
  });
}

function eliminarArticuloDelPedido(pos) {
  // Eliminar el artículo del arreglo
  articulos.splice(pos - 1, 1);
  actualizarTablaArticulos();
}

function editarArticuloPedido(pos, articulo, cantidad) {
  articulos.splice(pos - 1, 1);
  console.log("Articulo", articulo);
  console.log("Cantidad", cantidad);
  document.getElementById("cantidad").value = cantidad;
  document.getElementById("nombre").value = articulo;
  actualizarTablaArticulos();
}
function buscarClienteSeleccionado(nombreFantasiaBuscado) {
  const textoBusqueda = nombreFantasiaBuscado.trim().toLowerCase();
  console.log("textobuscado", textoBusqueda);
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

  if (clienteSeleccionado == -1) {
    return alert("Revisa la seleccion de cliente");
  }

  if (articulos.length === 0) {
    alert("Por favor, agrega al menos un artículo");
    return;
  }

  if (document.getElementById("cadeteriaId").value == null)
    return alert("Revisa la Cadeteria");

  let pedido = {
    clienteId: clienteSeleccionado,
    cadeteriaId: document.getElementById("cadeteriaId").value,
    vendedorId: vendedor.id,
    pedidoId: null,
    articulos: articulos,
    observacion: document.getElementById("observacionesPedido").value,
  };

  console.log("pedido", pedido);
  // Enviar los datos al controlador

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
      alert(response.mensaje);
    }
  } else {
    alert("Bad Request");
  }
}
