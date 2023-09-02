var clienteEditar = JSON.parse(localStorage.getItem("clienteEditar")) ?? {};
var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));

actualizarNombreCliente();

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
  var cadeteriaSelect = document.getElementById("cadeteriaId");
  for (var i = 0; i < cadeteriaSelect.options.length; i++) {
    var option = cadeteriaSelect.options[i];
    if (option.value === clienteEditar.cadeteriaDePreferencia) {
      option.selected = true;
      break;
    }
  }
}

// Asignar los valores del objeto clienteEditar a los campos del HTML
document.getElementById("nombreFantasia").value =
  clienteEditar.nombreFantasia || "";
document.getElementById("nombreFantasia").value =
  clienteEditar.nombreFantasia || "";
document.getElementById("razonSocial").value = clienteEditar.razonSocial || "";
document.getElementById("nombreCompleto").value =
  clienteEditar.nombreCompleto || "";
document.getElementById("nombreResponsable").value =
  clienteEditar.nombreResponsable || "";
document.getElementById("mail").value = clienteEditar.mail || "";
document.getElementById("celular").value = clienteEditar.celular || "";

async function registarCliente() {
  const cliente = {
    id: clienteEditar.id,
    nombreFantasia: document.getElementById("nombreFantasia").value,
    razonSocial: document.getElementById("razonSocial").value,
    nombreCompleto: document.getElementById("nombreCompleto").value,
    nombreResponsable: document.getElementById("nombreResponsable").value,
    username: clienteEditar.username,
    password: clienteEditar.password,
    cadeteriaDePreferencia: clienteEditar.cadeteriaDePreferencia,
    mail: document.getElementById("mail").value,
    direccionDeEntrega: document.getElementById("dir").value,
    nombreCompleto: document.getElementById("nombreCompleto").value,
    nombreResponsable: document.getElementById("nombreResponsable").value,
    celular: document.getElementById("celular").value,
    pdfData: clienteEditar.pdfData,
  };

  console.log("cliente", cliente);

  const request = await fetch(`http://localhost:8080/cliente/registroCliente`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  const response = await request.json();
  if (request.ok) {
    if (response.cliente) {
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      alert(response.mensaje);
      localStorage.removeItem("clienteEditar");
      window.location.href = "javascript:window.history.back()";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

// Función para convertir un archivo a un arreglo de bytes
async function readFileAsByteArray(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const byteArray = new Uint8Array(arrayBuffer);
      resolve(Array.from(byteArray));
    };
    reader.onerror = (event) => {
      reject(event.error);
    };
    reader.readAsArrayBuffer(file);
  });
}

function actualizarNombreCliente() {
  if (clienteEditar) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreCliente"
    ).innerText = `Estas editando el cliente: ${clienteEditar.nombreCompleto}.`;
  }
}
