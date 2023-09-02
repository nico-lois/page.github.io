document.getElementById("btnLogout").addEventListener("click", function () {
  logout();
});

function logout() {
  console.log("SALIRRRRR");
  var modoOscuroGuardado = localStorage.getItem("modoOscuro");

  // Eliminar los datos de sesión del local storage
  localStorage.clear();

  // Restaurar el estado del modo oscuro en el localStorage
  localStorage.setItem("modoOscuro", modoOscuroGuardado);

  // Redirigir al usuario a la página de inicio de sesión o a la página principal
  window.location.href = "index.html";
}
