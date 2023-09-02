async function iniciarSesion() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("contraseña").value;

  const request = await fetch(
    "http://4.236.210.144:8080/login?username=" +
      username +
      "&password=" +
      password,
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
    if (response.vendedor) {
      localStorage.setItem("vendedor", JSON.stringify(response.vendedor));
      localStorage.setItem("usuario", JSON.stringify(response.vendedor));
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("tipo", "Vendedor");
      window.location.href = "home-vendedor.html";
    } else if (response.cliente) {
      localStorage.setItem("cliente", JSON.stringify(response.cliente));
      localStorage.setItem("usuario", JSON.stringify(response.cliente));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      localStorage.setItem("tipo", "Cliente");
      window.location.href = "home-cliente.html";
    } else if (response.admin) {
      localStorage.setItem("admin", JSON.stringify(response.admin));
      localStorage.setItem("usuario", JSON.stringify(response.admin));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      localStorage.setItem("tipo", "Admin");
      window.location.href = "home-admin.html";
    } else if (response.auxDep) {
      localStorage.setItem("auxDep", JSON.stringify(response.auxDep));
      localStorage.setItem("usuario", JSON.stringify(response.auxDep));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      localStorage.setItem("tipo", "Aux");
      window.location.href = "home-aux.html";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}
