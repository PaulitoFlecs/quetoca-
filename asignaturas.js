// ====== Colores disponibles ======
const colores = [
  "#e74c3c","#e67e22","#f1c40f","#2ecc71","#1abc9c","#3498db","#9b59b6",
  "#34495e","#16a085","#27ae60","#2980b9","#8e44ad","#2c3e50","#f39c12",
  "#d35400","#c0392b","#7f8c8d","#95a5a6","#bdc3c7","#ff69b4","#ff8c00",
  "#ffa500","#32cd32","#00bfff","#4b0082","#ff6347","#40e0d0","#4169e1"
];

const palette = document.getElementById("colorPalette");
const inputColor = document.getElementById("colorAsignatura");

// Generar los circulitos de colores
colores.forEach(c => {
  const div = document.createElement("div");
  div.classList.add("color-option");
  div.style.backgroundColor = c;
  div.addEventListener("click", () => {
    document.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
    div.classList.add("selected");
    inputColor.value = c;
  });
  palette.appendChild(div);
});

// Dejar seleccionado el primero por defecto
if (palette.firstChild) {
  palette.firstChild.classList.add("selected");
  inputColor.value = colores[0];
}

// ====== Cargar profesores desde menu.js ======
function cargarProfesoresEnSelect() {
  const select = document.getElementById("Profesor");
  if (!select) return;

  select.innerHTML = '<option value="">Seleccionar</option>';
  
  if (window.profesores && Array.isArray(window.profesores)) {
    window.profesores.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.nombre;
      opt.textContent = p.nombre;
      select.appendChild(opt);
    });
  }

  // Activar Select2 (buscador)
  if (window.$ && $(select).select2) {
    $(select).select2({
      placeholder: "Seleccionar profesor",
      width: '100%',
      theme: "bootstrap-5"
    });
  }
}

// Ejecutar cuando la página haya cargado
document.addEventListener("DOMContentLoaded", cargarProfesoresEnSelect);

// ====== Lógica de asignaturas con localStorage ======
let asignaturas = JSON.parse(localStorage.getItem("asignaturas")) || [];

// Guardar en storage
function saveAsignaturas() {
  localStorage.setItem("asignaturas", JSON.stringify(asignaturas));
}

// Renderizar tarjetas con animación
function renderAsignaturas() {
  const contenedor = document.getElementById("listaAsignaturas");
  contenedor.style.opacity = 0;

  setTimeout(() => {
    contenedor.innerHTML = "";

    const cursoSeleccionado = document.getElementById("cursoAsignatura").value;

    const asignaturasFiltradas = cursoSeleccionado
      ? asignaturas.filter(a => a.curso === cursoSeleccionado)
      : asignaturas;

    asignaturasFiltradas.forEach((a, i) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-3", "fade-card");
      card.innerHTML = `
        <div class="card h-100 shadow-sm card-asignatura" style="border-left: 8px solid ${a.color}">
          <div class="card-body">
            <h6 class="card-title" style="color:${a.color};">${a.nombre}</h6>
            <p class="card-text"><b>Profesor/a:</b> ${a.profesor}</p>
            <p class="card-text"><b>Curso:</b> ${a.curso}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge" style="background:${a.color};">ASIGNADO</span>
              <div>
                <button class="btn btn-sm btn-warning me-1" onclick="abrirModalEditar(${i})"><i class="fas fa-pen"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteAsignatura(${i})"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    contenedor.style.opacity = 1;
  }, 200);
}

// Validar colisión
function existeColision(profesor, curso, nombreAsignatura) {
  const nombreNormalizado = nombreAsignatura.trim().toLowerCase();
  return asignaturas.some(a =>
    a.profesor.trim().toLowerCase() === profesor.trim().toLowerCase() &&
    a.curso.trim().toLowerCase() === curso.trim().toLowerCase() &&
    a.nombre.trim().toLowerCase() === nombreNormalizado
  );
}

// Guardar formulario principal
document.getElementById("formAsignatura").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreAsignatura").value.trim();
  const profesor = document.getElementById("Profesor").value;
  const curso = document.getElementById("cursoAsignatura").value;
  const color = document.getElementById("colorAsignatura").value;

  if (existeColision(profesor, curso, nombre)) {
    alert("⚠️ Ya existe esta asignatura con el mismo profesor en este curso.");
    return;
  }

  asignaturas.push({ nombre, profesor, curso, color });

  // Actualizar el array global de profesores
  const prof = window.profesores?.find(p => p.nombre === profesor);
  if (prof) prof.asignaturas.push(nombre);

  saveAsignaturas();
  renderAsignaturas();

  this.reset();
  document.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
  palette.firstChild.classList.add("selected");
  inputColor.value = colores[0];
});

// ====== MODAL DE EDICIÓN ======
let indexEditando = null;

function abrirModalEditar(index) {
  const asignatura = asignaturas[index];
  indexEditando = index;

  // Crear modal si no existe
  if (!document.getElementById("editarModal")) {
    const modalHTML = `
      <div class="modal fade" id="editarModal" tabindex="-1" aria-labelledby="editarModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-pen me-2"></i>Editar Asignatura</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formEditarAsignatura" class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre Asignatura</label>
                  <input type="text" id="editarNombre" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Profesor/a</label>
                  <select id="editarProfesor" class="form-select" required>
                    <option value="">Seleccionar</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Curso</label>
                  <select id="editarCurso" class="form-select" required>
                    <option value="1 Básico">1 Básico</option>
                    <option value="2 Básico">2 Básico</option>
                    <option value="3 Básico">3 Básico</option>
                    <option value="4 Básico">4 Básico</option>
                    <option value="5 Básico">5 Básico</option>
                    <option value="6 Básico">6 Básico</option>
                    <option value="7 Básico">7 Básico</option>
                    <option value="8 Básico">8 Básico</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Color</label>
                  <input type="color" id="editarColor" class="form-control form-control-color">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" onclick="guardarEdicion()">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // Llenar el select con profesores desde menu.js
  const selectEditarProfesor = document.getElementById("editarProfesor");
  selectEditarProfesor.innerHTML = '<option value="">Seleccionar</option>';

  if (window.profesores && Array.isArray(window.profesores)) {
    window.profesores.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.nombre;
      opt.textContent = p.nombre;
      selectEditarProfesor.appendChild(opt);
    });
  }

  // Activar Select2 para el modal
  if (window.$ && $(selectEditarProfesor).select2) {
    $(selectEditarProfesor).select2({
      placeholder: "Seleccionar profesor",
      dropdownParent: $("#editarModal"),
      width: '100%',
      theme: "bootstrap-5"
    });
  }

  // Cargar datos de la asignatura
  document.getElementById("editarNombre").value = asignatura.nombre;
  document.getElementById("editarProfesor").value = asignatura.profesor;
  document.getElementById("editarCurso").value = asignatura.curso;
  document.getElementById("editarColor").value = asignatura.color;

  const modal = new bootstrap.Modal(document.getElementById("editarModal"));
  modal.show();
}

// Guardar cambios
function guardarEdicion() {
  if (indexEditando === null) return;

  const nombre = document.getElementById("editarNombre").value.trim();
  const profesor = document.getElementById("editarProfesor").value;
  const curso = document.getElementById("editarCurso").value;
  const color = document.getElementById("editarColor").value;

  asignaturas[indexEditando] = { nombre, profesor, curso, color };
  saveAsignaturas();
  renderAsignaturas();

  bootstrap.Modal.getInstance(document.getElementById("editarModal")).hide();
  indexEditando = null;a
}

// Eliminar
function deleteAsignatura(index) {
  asignaturas.splice(index, 1);
  saveAsignaturas();
  renderAsignaturas();
}

// Evento para filtrar automáticamente por curso
document.getElementById("cursoAsignatura").addEventListener("change", renderAsignaturas);

// Inicial
renderAsignaturas();
