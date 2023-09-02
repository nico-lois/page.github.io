function limpiarCampos() {
  const campos = [
    "nombreComercial",
    "direccion",
    "nombreContacto",
    "mail",
    "celular",
  ];

  // Recorremos el array de campos y limpiamos sus valores
  campos.forEach((campo) => {
    document.getElementById(campo).value = "";
  });
}

async function registarCadeteria() {
  var cadeteria = {
    id: null,
    nombreCadeteria: document.getElementById("nombreComercial").value,
    nombreContacto: document.getElementById("nombreContacto").value,
    direccionEntrega: document.getElementById("direccion").value,
    mail: document.getElementById("mail").value,
    telefono: document.getElementById("celular").value,
  };

  const request = await fetch(
    "http://localhost:8080/cadeteria/agregarCadeteria?",
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
      limpiarCampos();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}
