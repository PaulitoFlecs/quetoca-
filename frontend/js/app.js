// ====== Script principal (Login) ======

// Validación del login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  // Expresión regular: solo correos con dominio @educacionadventista.cl
  const regex = /^[a-zA-Z0-9._%+-]+@educacionadventista\.cl$/;

  if (!regex.test(usuario)) {
    alert("❌ Solo se permiten correos @educacionadventista.cl");
    return;
  }

  // ====== Simulación de login ======
  // 👑 Cuenta de administrador fija
  if (usuario === "pablo.quilodran@educacionadventista.cl" && password === "admin123") {
    alert("✅ Bienvenido administrador " + usuario);
    localStorage.setItem("rol", "admin");   // Guardamos rol en localStorage
    window.location.href = "menu_administrador.html"; // Menú admin
    return;
  }

  // 👨‍🏫 Profesor genérico
  if (password === "profesor123") {
    alert("✅ Bienvenido profesor " + usuario);
    localStorage.setItem("rol", "profesor"); // Guardamos rol en localStorage
    window.location.href = "menu_profesor.html"; // Menú profesor
  } else {
    alert("❌ Usuario o contraseña incorrectos");
  }
});


// ====== Funciones de Accesibilidad ======
let fontSize = 100; // porcentaje inicial
let zoomLevel = 1;  // nivel de zoom inicial

function increaseFont() {
  fontSize += 10;
  document.body.style.fontSize = fontSize + "%";
}

function decreaseFont() {
  if (fontSize > 50) {
    fontSize -= 10;
    document.body.style.fontSize = fontSize + "%";
  }
}

function toggleContrast() {
  document.body.classList.toggle("high-contrast");
}

function zoomPage() {
  zoomLevel = zoomLevel === 1 ? 1.2 : 1; // alterna entre 1x y 1.2x
  document.body.style.transform = `scale(${zoomLevel})`;
  document.body.style.transformOrigin = "top center";
}

function readContent() {
  let content = document.body.innerText;
  let speech = new SpeechSynthesisUtterance(content);
  speech.lang = "es-ES";
  window.speechSynthesis.speak(speech);
}

function resetAccessibility() {
  fontSize = 100;
  zoomLevel = 1;
  document.body.style.fontSize = "100%";
  document.body.style.transform = "scale(1)";
  document.body.classList.remove("high-contrast");
  window.speechSynthesis.cancel();
}


// ====== Sidebar de accesibilidad ======
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("overlay");

  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
    overlay.style.display = "none";
  } else {
    sidebar.style.width = "250px"; // ancho del menú
    overlay.style.display = "block";
  }
}
function logout() {
  // Elimina el rol y cualquier otro dato guardado
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");

  alert("👋 Sesión cerrada correctamente");
  window.location.href = "index.html"; // redirige al login
}

