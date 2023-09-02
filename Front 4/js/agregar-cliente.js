var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));

function limpiarCampos() {
  const campos = [
    "nombreFantasia",
    "razonSocial",
    "username",
    "password",
    "nombreCompleto",
    "nombreResponsable",
    "mail",
    "dir",
    "celular",
  ];

  // Recorremos el array de campos y limpiamos sus valores
  campos.forEach((campo) => {
    document.getElementById(campo).value = "";
  });
}

cargarCadeteria();
//CARGAR LAS CADETERIAS AL COMBO
function cargarCadeteria() {
  if (cadeterias && cadeterias.length > 0) {
    var cadeteriaSelect = document.getElementById("cadeteteriaId");
    cadeterias.forEach(function (cadeteria) {
      var option = document.createElement("option");
      option.value = cadeteria.id;
      option.textContent = cadeteria.nombreCadeteria;
      cadeteriaSelect.appendChild(option);
    });
  }
}

function obtenerCadeteriaPorId(idBuscado) {
  if (cadeterias && cadeterias.length > 0) {
    for (const cadeteria of cadeterias) {
      if (cadeteria.id == idBuscado) {
        return cadeteria; // Devuelve la instancia de Cadeteria correspondiente
      }
    }
  }
  return null; // Si no se encuentra la cadetería con el ID buscado
}

async function registarCliente() {
  let cadeteriaDePreferencia = obtenerCadeteriaPorId(
    document.getElementById("cadeteteriaId").value
  );
  const cliente = {
    id: null,
    nombreFantasia: document.getElementById("nombreFantasia").value,
    razonSocial: document.getElementById("razonSocial").value,
    nombreCompleto: document.getElementById("nombreCompleto").value,
    nombreResponsable: document.getElementById("nombreResponsable").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    mail: document.getElementById("mail").value,
    celular: document.getElementById("celular").value,
    direccionDeEntrega: document.getElementById("dir").value,
    cadeteriaDePreferencia: cadeteriaDePreferencia,
    // cadeteriaDePreferencia: null,
    pdfData: null,
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
