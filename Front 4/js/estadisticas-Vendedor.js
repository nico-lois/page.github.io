var vendedor = JSON.parse(localStorage.getItem("vendedor"));
var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var clientes = JSON.parse(localStorage.getItem("clientes"));
var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo

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

actualizarPedidos();
async function actualizarPedidos() {
  const request = await fetch(
    `http://localhost:8080/actualizar?idVendedor=${vendedor.id}`,
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
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      clientes = JSON.parse(localStorage.getItem("clientes"));
      cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

// Función genérica para crear una gráfica
function createChart(elementId, labels, data, chartTitle) {
  var ctx = document.getElementById(elementId).getContext("2d");

  var chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        precision: 0,
      },
    },
  };

  var chartConfig = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: chartTitle,
          data: data,
          backgroundColor: "#9c27b0",
        },
      ],
    },
    options: chartOptions,
  };
  new Chart(ctx, chartConfig);
}

graficaPedidosPorCliente(pedidos);
function graficaPedidosPorCliente(pedidos) {
  const cantidadesPorCliente = {};
  pedidos.forEach((pedido) => {
    const clienteId = pedido.cliente.id;
    if (!cantidadesPorCliente[clienteId]) {
      cantidadesPorCliente[clienteId] = 1;
    } else {
      cantidadesPorCliente[clienteId]++;
    }
  });
  const resultado = Object.keys(cantidadesPorCliente).map((clienteId) => {
    return { cliente: clienteId, cantidad: cantidadesPorCliente[clienteId] };
  });

  // Aquí deberías mapear los nombres de los clientes en base a los IDs si es necesario
  const nombresClientes = resultado.map((item) => {
    const cliente = clientes.find((c) => c.id == item.cliente);
    return cliente ? cliente.nombreFantasia : "Cliente Desconocido";
  });

  const cantidadesPedidos = resultado.map((item) => item.cantidad);

  createChart(
    "Clientes",
    nombresClientes,
    cantidadesPedidos,
    "Cantidad de Pedidos"
  );
}
graficaTotalDePedidosDeLosUltimos12Meses();
function graficaTotalDePedidosDeLosUltimos12Meses() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 para ignorar la hora

  const last12Months = [];
  const totalPedidosPorMes = [];

  // Generar los últimos 12 meses, incluyendo el mes actual
  for (let i = 11; i >= 0; i--) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() - i;
    last12Months.push(new Date(year, month, 1));
  }

  // Inicializar el total de pedidos por mes a 0
  for (let i = 0; i < 12; i++) {
    totalPedidosPorMes[i] = 0;
  }

  // Contar los pedidos por mes
  pedidos.forEach((pedido) => {
    console.log("pedido.fecha", pedido.fecha);
    const pedidoDate = new Date(pedido.fecha);
    pedidoDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 para ignorar la hora
    console.log("pedidoDate", pedidoDate);
    console.log(pedidoDate >= last12Months[0] && pedidoDate <= currentDate);
    if (pedidoDate >= last12Months[0] && pedidoDate <= currentDate) {
      const monthIndex =
        (12 + pedidoDate.getMonth() - last12Months[0].getMonth()) % 12;
      totalPedidosPorMes[monthIndex]++;
    }
  });

  const meses = last12Months.map((date) => {
    return date.toLocaleDateString("es-ES", { month: "long" });
  });

  createChart(
    "TotalPedidos",
    meses,
    totalPedidosPorMes,
    "Total de Pedidos Del Mes"
  );
}
graficaDePedidosPendientesSemanal();
function graficaDePedidosPendientesSemanal() {
  const currentDate = new Date();
  const lastWeeks = [];

  // Generar las semanas anteriores, incluyendo la semana actual
  for (let i = 0; i <= 4; i++) {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - (7 * i + weekStart.getDay()));
    lastWeeks.push(weekStart);
  }

  const daysOfWeek = [
    "Semanas Anteriores",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
  ];

  const pedidosPendientesPorSemana = lastWeeks.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Asumiendo una semana laboral de lunes a viernes

    const pedidosPendientes = pedidos.filter((pedido) => {
      const pedidoDate = new Date(pedido.fecha);
      return (
        pedido.estadoPedido !== "ENTREGADO" &&
        pedidoDate >= weekStart &&
        pedidoDate <= weekEnd
      );
    });

    return pedidosPendientes.length;
  });

  // Crear la gráfica
  createChart(
    "PedidosPendientesSemanal",
    daysOfWeek,
    pedidosPendientesPorSemana,
    "Pedidos Pendientes"
  );
}

promedioValoracionPorCliente();
function promedioValoracionPorCliente() {
  const clienteValoraciones = {}; // Objeto para almacenar valoraciones por cliente
  const clienteContador = {}; // Objeto para contar cuántas veces se ha valorado un cliente

  // Calcular el promedio de las valoraciones por cliente
  pedidos.forEach((pedido) => {
    const clienteId = pedido.cliente.id;
    const valoracion = pedido.valoracion;

    if (valoracion !== null && valoracion !== undefined) {
      if (!clienteValoraciones[clienteId]) {
        clienteValoraciones[clienteId] = valoracion;
        clienteContador[clienteId] = 1;
      } else {
        clienteValoraciones[clienteId] += valoracion;
        clienteContador[clienteId]++;
      }
    }
  });

  // Calcular el promedio y preparar los datos para la gráfica
  const nombresClientes = [];
  const promediosValoraciones = [];

  for (const clienteId in clienteValoraciones) {
    const promedio =
      clienteValoraciones[clienteId] / clienteContador[clienteId];
    const cliente = clientes.find((c) => c.id === parseInt(clienteId));

    if (cliente) {
      nombresClientes.push(cliente.nombreFantasia);
      promediosValoraciones.push(promedio);
    }
  }

  // Crear la gráfica
  var ctx = document.getElementById("PromedioValoraciones").getContext("2d");

  var chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0, // Establecer valor mínimo en 0
        max: 5, // Establecer valor máximo en 5
        stepSize: 1,
        precision: 0,
      },
    },
  };

  var chartConfig = {
    type: "bar",
    data: {
      labels: nombresClientes,
      datasets: [
        {
          label: "Promedio de Valoraciones por Cliente",
          data: promediosValoraciones,
          backgroundColor: "#9c27b0",
        },
      ],
    },
    options: chartOptions,
  };

  new Chart(ctx, chartConfig);
}

//
