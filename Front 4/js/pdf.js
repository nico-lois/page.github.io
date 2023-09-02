async function abrirPDF(clienteId) {
  try {
    const response = await fetch(
      `http://localhost:8080/cliente/verPdf?id=${clienteId}`,
      {
        method: "POST", // Agregar el método POST
      }
    );
    const pdfBlob = await response.blob();

    const pdfURL = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfURL, "_blank");

    if (!newWindow) {
      alert(
        "La ventana emergente fue bloqueada. Por favor, permita ventanas emergentes para ver el PDF."
      );
    }
  } catch (error) {
    console.error("Error al abrir el PDF:", error);
    alert(
      "Ocurrió un error al abrir el PDF. Consulta la consola para más detalles."
    );
  }
}

function generarPDF(pedidoId) {
  const pedido = buscarPedidoPorId(pedidoId);
  if (pedido) {
    const respuesta = prompt("¿Se retira en agencia? (si/no)").toLowerCase();
    let retiraEnAgencia = "";

    if (respuesta === "si") {
      retiraEnAgencia = "Sí";
    } else if (respuesta === "no") {
      retiraEnAgencia = "No";
    } else {
      alert("Respuesta inválida. Se asumirá 'No' para retiro en agencia.");
      retiraEnAgencia = "No";
    }

    let cliente = pedido.cliente;

    // Definir la estructura del contenido del PDF
    const content = [
      { text: "Remitente: URURACER" },
      { text: "Teléfono: 24094338" },
      {
        text:
          "Quien recibe: " +
          cliente.nombreCompleto +
          " - " +
          cliente.nombreFantasia,
      },
      { text: "Entrega: " + cliente.direccionDeEntrega },
      { text: "Retira en Agencia: " + retiraEnAgencia },
    ];

    // Configurar el documento PDF
    const docDefinition = {
      content: content,
    };

    // Generar el PDF utilizando pdfmake
    pdfMake.createPdf(docDefinition).download("detalle_pedido.pdf");
  }
}
// Función para buscar un pedido por su ID
function buscarPedidoPorId(id) {
  return pedidos.find((pedido) => pedido.id === id);
}

async function cargarPDF(cliente, pdf) {
  let pdfFile = pdf;
  let pdfByteArray = pdfFile ? await readFileAsByteArray(pdfFile) : null;
  cliente.pdfData = pdfByteArray;

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
      actualizarTablaClientes();
      alert(response.mensaje);
      localStorage.removeItem("clienteEditar");
      //window.location.href = "javascript:window.history.back()";
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

function actualizarTablaClientes() {
  let clientes = JSON.parse(localStorage.getItem("clientes"));
  console.log("Traigo de nuevo los clientees", clientes);

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
