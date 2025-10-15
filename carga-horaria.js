// ====== BLOQUES HORARIOS ======
const horas = [
  "08:00 - 08:45",
  "08:45 - 09:30",
  "09:50 - 10:35",
  "10:35 - 11:20",
  "11:30 - 12:15",
  "12:15 - 13:00",
  "14:00 - 14:45",
  "14:45 - 15:30",
  "15:30 - 16:15",
  "16:15 - 17:00",
  "17:00 - 17:45",
  "17:45 - 18:30"
];

// ====== LOCALSTORAGE ======
let horarios = JSON.parse(localStorage.getItem("horarios")) || {};

// ====== SELECT PROFESORES ======
const selectProfesor = document.getElementById("selectProfesor");
if (selectProfesor && window.profesores) {
  profesores.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.nombre;
    selectProfesor.appendChild(opt);
  });
}

// ====== RENDERIZAR HORARIO ======
function renderHorario(profIndex) {
  const tabla = document.getElementById("tablaHorario");
  if (!tabla) return;
  tabla.innerHTML = "";

  const asignaturasGlobal = JSON.parse(localStorage.getItem("asignaturas")) || [];
  const profesorActual = profesores[profIndex].nombre;

  const asignaturasProfe = asignaturasGlobal.filter(a => a.profesor === profesorActual);

  const opciones = ["-- Libre --", "Hora Administrativa", "Reunión", ...asignaturasProfe.map(a => a.nombre)];
  const horarioProf = horarios[profIndex] || {};

  horas.forEach(hora => {
    let fila = `<tr><td class="align-middle text-center"><b>Clases</b><br>${hora}</td>`;
    for (let dia = 0; dia < 5; dia++) {
      const celda = horarioProf[hora]?.[dia] || { asignatura: "", curso: "", color: "" };
      const asignatura = celda.asignatura || "";
      const curso = celda.curso || "";
      const color = celda.color || "";
      fila += `<td class="celda-horario align-middle text-center" style="min-width:180px; height:90px; padding:0;">`;


      if (asignatura && asignatura !== "-- Libre --") {
        fila += `
          <div class="bloque-asignatura shadow-sm"
               style="background:${color}; cursor:pointer;"
               onclick="editarClase(${profIndex}, '${hora}', ${dia})">
            <strong>${asignatura}</strong><br>
            <small>${curso}</small>
          </div>`;
      } else {
        fila += `<button class="btn btn-sm btn-outline-secondary" onclick="agregarClase(${profIndex}, '${hora}', ${dia})">+</button>`;
      }

      fila += "</td>";
    }
    fila += "</tr>";
    tabla.innerHTML += fila;
  });

  calcularHoras(profIndex);
}

// ====== MODAL: AGREGAR CLASE ======
function agregarClase(profIndex, hora, dia) {
  const asignaturasGlobal = JSON.parse(localStorage.getItem("asignaturas")) || [];
  const profesorActual = profesores[profIndex].nombre;

  const asignaturasProfe = asignaturasGlobal.filter(a => a.profesor === profesorActual);

  let opciones = `
    <option value="">Seleccionar asignatura...</option>
    <option value="Hora Administrativa">Hora Administrativa</option>
    <option value="Reunión">Reunión</option>
    <option value="-- Libre --">Libre</option>
  `;
  opciones += asignaturasProfe.map(a => `<option value="${a.nombre}">${a.nombre} (${a.curso})</option>`).join("");

  mostrarModal("Agregar Clase", profesorActual, hora, opciones, (nombre) => {
    if (!nombre) return;

    let curso = "";
    let color = "#6c757d";
    const asignaturasGlobal = JSON.parse(localStorage.getItem("asignaturas")) || [];

    const asigObj = asignaturasGlobal.find(a => a.nombre === nombre && a.profesor === profesorActual);
    if (asigObj) {
      curso = asigObj.curso;
      color = asigObj.color;
    } else if (nombre === "Hora Administrativa") {
      color = "#95a5a6";
    } else if (nombre === "Reunión") {
      color = "#9b59b6";
    }

    if (!horarios[profIndex]) horarios[profIndex] = {};
    if (!horarios[profIndex][hora]) horarios[profIndex][hora] = {};
    horarios[profIndex][hora][dia] = { asignatura: nombre, curso, color };

    localStorage.setItem("horarios", JSON.stringify(horarios));
    renderHorario(profIndex);
  });
}

// ====== MODAL: EDITAR O ELIMINAR CLASE ======
function editarClase(profIndex, hora, dia) {
  const horarioProf = horarios[profIndex] || {};
  const celda = horarioProf[hora]?.[dia];
  if (!celda) return;

  const asignaturasGlobal = JSON.parse(localStorage.getItem("asignaturas")) || [];
  const profesorActual = profesores[profIndex].nombre;
  const asignaturasProfe = asignaturasGlobal.filter(a => a.profesor === profesorActual);

  let opciones = `
    <option value="Hora Administrativa">Hora Administrativa</option>
    <option value="Reunión">Reunión</option>
    <option value="-- Libre --">Libre</option>
  `;
  opciones += asignaturasProfe.map(a => `<option value="${a.nombre}">${a.nombre} (${a.curso})</option>`).join("");

  mostrarModal("Editar Clase", profesorActual, hora, opciones, (nombre, eliminar) => {
    if (eliminar) {
      delete horarios[profIndex][hora][dia];
    } else {
      let curso = "";
      let color = "#6c757d";
      const asigObj = asignaturasGlobal.find(a => a.nombre === nombre && a.profesor === profesorActual);
      if (asigObj) {
        curso = asigObj.curso;
        color = asigObj.color;
      } else if (nombre === "Hora Administrativa") {
        color = "#95a5a6";
      } else if (nombre === "Reunión") {
        color = "#9b59b6";
      }

      if (!horarios[profIndex]) horarios[profIndex] = {};
      if (!horarios[profIndex][hora]) horarios[profIndex][hora] = {};
      horarios[profIndex][hora][dia] = { asignatura: nombre, curso, color };
    }

    localStorage.setItem("horarios", JSON.stringify(horarios));
    renderHorario(profIndex);
  }, celda.asignatura);
}

// ====== MODAL GENÉRICO ======
function mostrarModal(titulo, profesor, hora, opciones, onSave, valorInicial = "") {
  document.querySelectorAll("#modalAgregar").forEach(m => m.remove());

  const modalHTML = `
    <div class="modal fade" id="modalAgregar" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${titulo} – ${profesor}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formAgregarClase">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Asignatura</label>
                  <select id="asignaturaSel" class="form-select" required>${opciones}</select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Hora</label>
                  <input type="text" class="form-control" value="${hora}" readonly>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger me-auto" id="btnEliminarClase">Eliminar</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" id="btnGuardarClase">Guardar</button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modalEl = document.getElementById("modalAgregar");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const select = document.getElementById("asignaturaSel");
  if (valorInicial) select.value = valorInicial;

  document.getElementById("btnGuardarClase").onclick = () => {
    const nombre = select.value;
    onSave(nombre, false);
    modal.hide();
  };

  document.getElementById("btnEliminarClase").onclick = () => {
    onSave("", true);
    modal.hide();
  };
}

// ====== CALCULAR HORAS ======
function calcularHoras(profIndex) {
  let horasClases = 0;
  let horasAdmin = 0;

  const horarioProf = horarios[profIndex] || {};

  Object.values(horarioProf).forEach(horasDia => {
    Object.values(horasDia).forEach(celda => {
      const nombre = celda.asignatura;
      if (!nombre || nombre === "-- Libre --") return;
      if (nombre === "Hora Administrativa" || nombre === "Reunión") horasAdmin += 0.75;
      else horasClases += 0.75;
    });
  });

  document.getElementById("horasClases").innerText = horasClases.toFixed(1);
  document.getElementById("horasAdmin").innerText = horasAdmin.toFixed(1);
  document.getElementById("horasTotales").innerText = (horasClases + horasAdmin).toFixed(1);
}

// ====== CAMBIO DE PROFESOR ======
if (selectProfesor) {
  selectProfesor.addEventListener("change", function () {
    const index = parseInt(this.value);
    renderHorario(index);
    document.getElementById("profesorHorario").innerText = "Profesor(a): " + profesores[index].nombre;
  });

  if (profesores.length > 0) {
    selectProfesor.value = 0;
    renderHorario(0);
    document.getElementById("profesorHorario").innerText = "Profesor(a): " + profesores[0].nombre;
  }
}

// ====== Mostrar año actual ======
document.getElementById("anioHorario").innerText = "Año: " + new Date().getFullYear();

// ====== CAMBIO DE NIVEL ======
document.getElementById("nivelDocente").addEventListener("change", function() {
  document.getElementById("nivelTabla").innerText = "Educación " + this.value;
  document.getElementById("nivelBadge").innerText = "Nivel: " + this.value;
});




// ====== EXPORTAR ======
function getNombreArchivo(extension) {
  const prof = document.getElementById("profesorHorario").innerText
    .replace("Profesor(a): ", "")
    .replace(/\s+/g, "_");
  const anio = new Date().getFullYear();
  return `Horario_${prof}_${anio}.${extension}`;
}

function exportPNG() {
  const tabla = document.querySelector(".card");
  html2canvas(tabla, { scale: 2, useCORS: true }).then(canvas => {
    const link = document.createElement("a");
    link.download = getNombreArchivo("png");
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const contenedor = document.querySelector("#exportContainer");
  html2canvas(contenedor, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(getNombreArchivo("pdf"));
  });
}

function exportExcel() {
  const header = document.getElementById("headerHorario").cloneNode(true);
  const tabla = document.querySelector(".tabla-horario").cloneNode(true);
  const wrapper = document.createElement("div");
  wrapper.appendChild(header);
  wrapper.appendChild(tabla);
  const wb = XLSX.utils.table_to_book(wrapper.querySelector("table"), { sheet: "Horario" });
  XLSX.writeFile(wb, getNombreArchivo("xlsx"));
}
