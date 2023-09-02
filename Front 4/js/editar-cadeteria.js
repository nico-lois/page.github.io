var cadeteriaEditar = JSON.parse(localStorage.getItem("cadeteriaEditar")) ?? {};
console.log("cadeteria", cadeteriaEditar);

actualizarNombreCadeteria();

// Asignar los valores del objeto cadeteriaEditar a los campos del formulario
document.getElementById("nombreComercial").value =
  cadeteriaEditar.nombreCadeteria || "";
document.getElementById("direccion").value =
  cadeteriaEditar.direccionEntrega || "";
document.getElementById("nombreContacto").value =
  cadeteriaEditar.nombreContacto || "";
document.getElementById("mail").value = cadeteriaEditar.mail || "";
document.getElementById("celular").value = cadeteriaEditar.telefono || "";

async function registarCadeteria() {
  var cadeteria = {
    id: cadeteriaEditar.id,
    nombreCadeteria: document.getElementById("nombreComercial").value,
    nombreContacto: document.getElementById("nombreContacto").value,
    direccionEntrega: document.getElementById("direccion").value,
    mail: document.getElementById("mail").value,
    telefono: document.getElementById("celular").value,
  };
  console.log("cadeteria", cadeteria);

  const request = await fetch(
    "http://localhost:8080/cadeteria/agregarCadeteria",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cadeteria),
    }
  );

  const response = await request.json();
  if (request.ok) {
    if (response.cadeterias) {
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      alert(response.mensaje);
      window.location.href = "javascript:window.history.back()";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function actualizarNombreCadeteria() {
  if (cadeteriaEditar) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreCadeteria"
    ).innerText = `Estas editando la cadetería: ${cadeteriaEditar.nombreCadeteria}.`;
  }
}
