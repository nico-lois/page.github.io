const pedidoParaArmar = JSON.parse(localStorage.getItem("pedidoParaArmar"));
const Auxiliar = JSON.parse(localStorage.getItem("auxDep"));
console.log(pedidoParaArmar);
var articulos = pedidoParaArmar.articulos;
var idPedido = pedidoParaArmar.id;

if (pedidoParaArmar) {
  // Llenar los campos del formulario con los datos del pedido
  document.getElementById("fechaMostrada").textContent = pedidoParaArmar.fecha;
  document.getElementById("nombreCliente").textContent =
    pedidoParaArmar.cliente.nombreFantasia +
    " - " +
    pedidoParaArmar.cliente.razonSocial; // Esto no se debe poder editar
  // document.getElementById("observacionesPedido").value =
  //   pedidoParaArmar.observacion;

  // Rellenar la tabla de artículos
  const tablaArticulos = document.getElementById("tablaArticulos");
  tablaArticulos.innerHTML = ""; // Limpia el contenido previo

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th>Nro.</th>
    <th>Artículo</th>
    <th>Cantidad</th>
    <th>Agregado</th>
    <th>Sin stock</th>
  `;
  thead.appendChild(headerRow);
  tablaArticulos.appendChild(thead);

  pedidoParaArmar.articulos.forEach((articulo, index) => {
    const fila = document.createElement("tr");
    fila.className = articulo.eliminado
      ? "fila-eliminada"
      : articulo.agregado
      ? "fila-agregada"
      : "";

    const articuloSeleccionadoCheckbox = document.createElement("input");
    articuloSeleccionadoCheckbox.type = "checkbox";
    articuloSeleccionadoCheckbox.id = `articuloSeleccionado${index}`;
    articuloSeleccionadoCheckbox.checked = articulo.seleccionado || false;
    articuloSeleccionadoCheckbox.classList.add("checkboxSeleccionado"); // Agregar la clase

    const articuloSinStockCheckbox = document.createElement("input");
    articuloSinStockCheckbox.type = "checkbox";
    articuloSinStockCheckbox.id = `articuloSinStock${index}`;
    articuloSinStockCheckbox.checked = !articulo.stock;
    articuloSinStockCheckbox.classList.add("checkboxSinStock"); // Agregar la clase
    articuloSeleccionadoCheckbox.disabled = articuloSinStockCheckbox.checked;

    // Agregar evento al checkbox "Sin stock"
    articuloSinStockCheckbox.addEventListener("change", () => {
      articuloSeleccionadoCheckbox.checked = articuloSinStockCheckbox.checked;
      articuloSeleccionadoCheckbox.disabled = articuloSinStockCheckbox.checked;
    });

    const checkboxSeleccionadoCell = document.createElement("td");
    checkboxSeleccionadoCell.appendChild(articuloSeleccionadoCheckbox);

    const checkboxSinStockCell = document.createElement("td");
    checkboxSinStockCell.appendChild(articuloSinStockCheckbox);

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${articulo.nombre}</td>
      <td>${articulo.cantidad}</td>
    `;

    fila.appendChild(checkboxSeleccionadoCell);
    fila.appendChild(checkboxSinStockCell);

    tablaArticulos.appendChild(fila);
  });

  // Rellenar la selección de cadeterías
  const selectCadeteria = document.getElementById("cadeteriaId");
  selectCadeteria.innerHTML = `<option>${pedidoParaArmar.cadeteria.nombreCadeteria}</option>`;
}

function actualizarArticulosSeleccionados() {
  const checkboxes = document.querySelectorAll(".checkboxSeleccionado");
  checkboxes.forEach((checkbox, index) => {
    articulos[index].seleccionado = checkbox.checked;
  });
}

function actualizarArticulosSinStock() {
  const checkboxes = document.querySelectorAll(".checkboxSinStock");
  checkboxes.forEach((checkbox, index) => {
    articulos[index].stock = !checkbox.checked;
  });
}

async function guardarAvance() {
  actualizarArticulosSeleccionados();
  actualizarArticulosSinStock();

  if (articulos.length === 0) {
    alert("Por favor, agrega al menos un artículo");
    return;
  }

  const request = await fetch(
    `http://localhost:8080/auxdepo/guardarAvance?pedidoId=${idPedido}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articulos),
    }
  );

  const response = await request.json();
  if (request.ok) {
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      window.location.href = "home-aux.html";
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

async function pedidoArmado() {
  actualizarArticulosSeleccionados();
  actualizarArticulosSinStock();

  if (articulos.length === 0) {
    alert("Por favor, agrega al menos un artículo");
    return;
  }

  const request = await fetch(
    `http://localhost:8080/auxdepo/pedidoArmado?pedidoId=${idPedido}&auxId=${Auxiliar.id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articulos),
    }
  );

  const response = await request.json();
  if (request.ok) {
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      window.location.href = "home-aux.html";
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}
