var body = document.querySelector("body");
var sidebar = body.querySelector("nav");
var toggle = body.querySelector(".toggle");
var searchBtn = body.querySelector(".search-box");
var modeSwitch = body.querySelector(".toggle-switch");
var modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

function guardarModo() {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
    localStorage.setItem("modoOscuro", "true");
  } else {
    localStorage.setItem("modoOscuro", "false");
    modeText.innerText = "Dark mode";
  }
}
