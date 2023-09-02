const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const customModal = document.getElementById("customModal");

openModalBtn.addEventListener("click", () => {
  customModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  customModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === customModal) {
    customModal.style.display = "none";
  }
});
