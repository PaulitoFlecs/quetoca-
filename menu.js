// ====== LOGIN Y REDIRECCIÓN ======
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    const regex = /^[a-zA-Z0-9._%+-]+@educacionadventista\.cl$/;
    if (!regex.test(usuario)) {
      alert("❌ Solo se permiten correos @educacionadventista.cl");
      return;
    }

    if (usuario === "pablo.quilodran@educacionadventista.cl" && password === "admin123") {
      alert("✅ Bienvenido Administrador");
      window.location.href = "menu_administrador.html";
    } else {
      alert("✅ Bienvenido Profesor");
      window.location.href = "menu_profesor.html";
    }
  });
}

// ====== LISTA DE PROFESORES ======
window.profesores = [
  { nombre: "Belen Paz Parada Neira", correo: "belen.parada@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Berta Olga Ayala Egaña", correo: "berta.ayala@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Camila Torres", correo: "camila.torres@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Catalina Alejandra Cabello Soto", correo: "catalina.cabello@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Cecilia Lorena Arévalo Morales", correo: "cecilia.arevalo@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Claudia Andrea Urrejola Morales", correo: "claudia.urrejola@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Claudia Andrea Vásquez Hernández", correo: "claudia.vasquez@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Constanza Cifuentes Aracena", correo: "constanza.cifuentes@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Daniela Alejandra Torres Venegas", correo: "daniela.torres@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Daniela Alejandra Vidal Flores", correo: "daniela.vidal@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "David Rodrigo Acuña Vega", correo: "david.acuna@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Emmanuel Andrés Farias Hernandez", correo: "emmanuel.farias@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Giarella Milene Failla Cubillos", correo: "giarella.failla@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Ines Sandoval Romero", correo: "ines.sandoval@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Jeimy Casanga Delgado", correo: "jeimy.casanga@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Jennifer Lorena Peña Luján", correo: "jennifer.pena@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Jonel Elusme", correo: "jonel.elusme@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Leslie Vasti Gajardo Atenas", correo: "leslie.gajardo@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Marianne Anaís Almeida del Valle", correo: "marianne.almeida@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Mario Carlos Valdivieso Valenzuela", correo: "mario.valdivieso@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "María Estela Zepeda Rivera", correo: "maria.zepeda@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "María Soledad Cuello Mena", correo: "maria.cuello@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Mónica Sofia Suazo Walther", correo: "monica.suazo@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Nadine Natacha Romero Pinto", correo: "nadine.romero@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Natalia Ignacia Almeida del Valle", correo: "natalia.almeida@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Priscila Eugenia Durán Valdebenito", correo: "priscila.duran@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Santiago Gabriel Abarzúa Letelier", correo: "santiago.abarzua@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Sara Marianela Molina Concha", correo: "sara.molina@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Sergio Humberto Böttner Curiñir", correo: "sergio.bottner@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Sheila Vasti Rojas Ross", correo: "sheila.rojas@educacionadventista.cl", password: "123456", asignaturas: [] },
  { nombre: "Virginia Estrella Arévalo Morales", correo: "virginia.arevalo@educacionadventista.cl", password: "123456", asignaturas: [] }
];

// Render lista de profesores en formato CARD
function renderProfesores() {
  const lista = document.getElementById("listaProfesores");
  if (!lista) return;

  lista.innerHTML = profesores.map((p, index) => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          ${
            p.foto && p.foto.trim() !== "" 
              ? `<img src="${p.foto}" class="rounded-circle mb-2" alt="Foto de ${p.nombre}" style="width:80px; height:80px; object-fit:cover;">`
              : `<div style="font-size:50px;">👩‍🏫</div>`
          }
          <h6 class="fw-bold">${p.nombre}</h6>
          <small class="text-muted d-block">${p.correo}</small>
          <div class="mt-2 small">
            ${p.asignaturas.length > 0 
              ? "📚 " + p.asignaturas.join(", ")
              : "<em>Sin asignaturas</em>"}
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <button class="btn btn-sm btn-primary" onclick="editarProfesor(${index})">✏️</button>
          <button class="btn btn-sm btn-success" onclick="verAsignaturas(${index})">📚</button>
        </div>
      </div>
    </div>
  `).join("");

  lista.className = "row";
}



  // actualizar el select de asignar asignatura
  const select = document.getElementById("Profesor");
  if (select) {
    select.innerHTML = profesores.map(p => `<option>${p.nombre}</option>`).join("");
  }


renderProfesores();

// ====== ASIGNAR ASIGNATURAS ======
const formAsignatura = document.getElementById("formAsignatura");
if (formAsignatura) {
  formAsignatura.addEventListener("submit", (e) => {
    e.preventDefault();
    const profesorNombre = document.getElementById("profesor").value;
    const asignatura = document.getElementById("asignatura").value.trim();

    if (!asignatura) {
      alert("⚠️ Debes ingresar una asignatura");
      return;
    }

    const prof = profesores.find(p => p.nombre === profesorNombre);
    if (prof) {
      prof.asignaturas.push(asignatura);
      alert(`✅ ${asignatura} asignada a ${prof.nombre}`);
      renderProfesores();
      formAsignatura.reset();
    }
  });
}

// ====== EDITAR PROFESOR ======
let profesorEditIndex = null;
function editarProfesor(index) {
  profesorEditIndex = index;
  document.getElementById("nuevoNombre").value = profesores[index].nombre;
  document.getElementById("nuevaPass").value = "";
  document.getElementById("confirmPass").value = "";
  document.getElementById("nuevaFoto").value = "";

  const modal = new bootstrap.Modal(document.getElementById("editarProfesorModal"));
  modal.show();
}

const formEditarProfesor = document.getElementById("formEditarProfesor");
if (formEditarProfesor) {
  formEditarProfesor.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoNombre = document.getElementById("nuevoNombre").value.trim();
    const nuevaPass = document.getElementById("nuevaPass").value;
    const confirmPass = document.getElementById("confirmPass").value;
    const nuevaFoto = document.getElementById("nuevaFoto").files[0];

    if (!nuevoNombre) {
      alert("⚠️ El nombre no puede estar vacío");
      return;
    }
    if (nuevaPass && nuevaPass !== confirmPass) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    // Guardar nombre
    profesores[profesorEditIndex].nombre = nuevoNombre;
    if (nuevaPass) profesores[profesorEditIndex].password = nuevaPass;

    // Guardar foto (si se sube)
    if (nuevaFoto) {
      const reader = new FileReader();
      reader.onload = function(e) {
        profesores[profesorEditIndex].foto = e.target.result; // Base64
        renderProfesores();
      };
      reader.readAsDataURL(nuevaFoto);
    } else {
      renderProfesores();
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("editarProfesorModal"));
    modal.hide();
    alert("✅ Profesor actualizado correctamente");
  });
}


// ====== VER Y BORRAR ASIGNATURAS ======
function verAsignaturas(index) {
  const profesor = profesores[index];
  document.getElementById("nombreProfesorAsignaturas").innerText = profesor.nombre;

  const listaAsignaturas = document.getElementById("listaAsignaturas");
  listaAsignaturas.innerHTML = profesor.asignaturas.length === 0 
    ? "<li class='list-group-item text-muted'>Sin asignaturas</li>"
    : profesor.asignaturas.map((a, j) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${a}
          <button class="btn btn-sm btn-danger" onclick="borrarAsignatura(${index}, ${j})">❌</button>
        </li>
      `).join("");

  let modal = bootstrap.Modal.getInstance(document.getElementById("verAsignaturasModal"));
  if (!modal) {
    modal = new bootstrap.Modal(document.getElementById("verAsignaturasModal"));
  }
  modal.show();
}

function borrarAsignatura(profIndex, asignIndex) {
  profesores[profIndex].asignaturas.splice(asignIndex, 1);
  verAsignaturas(profIndex);
  renderProfesores();
  alert("🗑️ Asignatura eliminada");
}

// ====== BUSCADOR ======
function limpiarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const buscarInput = document.getElementById("buscarProfesor");
if (buscarInput) {
  buscarInput.addEventListener("keyup", function () {
    const filtro = limpiarTexto(buscarInput.value);
    const items = document.querySelectorAll("#listaProfesores .col-md-4");
    const mensaje = document.getElementById("mensajeBusqueda");

    let encontrados = 0;
    items.forEach(item => {
      const nombre = limpiarTexto(item.getAttribute("data-nombre"));
      if (nombre.includes(filtro)) {
        item.style.display = "";
        encontrados++;
      } else {
        item.style.display = "none";
      }
    });

    mensaje.style.display = (filtro && encontrados === 0) ? "block" : "none";
  });
}

// ====== SIDEBAR ======
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
    overlay.style.display = "none";
  } else {
    sidebar.style.width = "250px";
    overlay.style.display = "block";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
