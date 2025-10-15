let codigoGenerado = null;
let tiempoEspera = 15; // segundos de cooldown
let intervalo = null;

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Ocultamos todos los errores antes de validar
  document.querySelectorAll("small.text-danger").forEach(el => el.classList.add("d-none"));

  let valido = true;

  // Validación nombre
  if (nombre.length < 3) {
    document.getElementById("errorNombre").classList.remove("d-none");
    valido = false;
  }

  // Validación correo institucional
  const regexCorreo = /^[a-zA-Z0-9._%+-]+@educacionadventista\.cl$/;
  if (!regexCorreo.test(correo)) {
    document.getElementById("errorCorreo").classList.remove("d-none");
    valido = false;
  }

  // Validación teléfono (Chile: +569XXXXXXXX)
  const regexTel = /^(\+?56)?9\d{8}$/;
  if (!regexTel.test(telefono)) {
    document.getElementById("errorTelefono").classList.remove("d-none");
    valido = false;
  }

  // Validación contraseñas
  if (password !== confirmPassword) {
    document.getElementById("errorPassword").classList.remove("d-none");
    valido = false;
  }

  if (!valido) return;

  // Si todo está ok → generar código de verificación
  generarCodigo(correo);
  document.getElementById("verifySection").classList.remove("d-none");
});


// ====== Generar código y enviarlo al backend ======
function generarCodigo(correo) {
  codigoGenerado = Math.floor(100000 + Math.random() * 900000); // código 6 dígitos
  console.log("Código generado:", codigoGenerado);

  // 🔗 Llamada al backend
  fetch("http://localhost:3000/send-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, codigo: codigoGenerado })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("✅ Correo enviado correctamente");
    } else {
      console.error("❌ Error al enviar correo:", data.error);
    }
  })
  .catch(err => console.error("⚠️ Error de conexión:", err));

  iniciarCooldown();
}


// ====== Verificar código ingresado ======
function verificarCodigo() {
  const codigoIngresado = document.getElementById("codigoVerificacion").value.trim();
  document.getElementById("errorCodigo").classList.add("d-none");

  if (codigoIngresado == codigoGenerado) {
    alert("✅ Cuenta verificada y registrada correctamente");
    window.location.href = "index.html"; // Redirigir al login
  } else {
    document.getElementById("errorCodigo").classList.remove("d-none");
  }
}


// ====== Cooldown del botón "Reenviar código" ======
function iniciarCooldown() {
  const btnReenviar = document.getElementById("btnReenviar");
  let segundos = tiempoEspera;

  btnReenviar.disabled = true;
  btnReenviar.innerText = `Reenviar código (${segundos}s)`;

  intervalo = setInterval(() => {
    segundos--;
    if (segundos > 0) {
      btnReenviar.innerText = `Reenviar código (${segundos}s)`;
    } else {
      clearInterval(intervalo);
      btnReenviar.disabled = false;
      btnReenviar.innerText = "Reenviar código";
      btnReenviar.onclick = () => generarCodigo(document.getElementById("correo").value.trim());
    }
  }, 1000);
}
