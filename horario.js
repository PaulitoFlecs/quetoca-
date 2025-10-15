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
];

// ====== VARIABLES (sin localStorage) ======
let horariosCurso = {};
let asignaturas = [];
let profesores = window.profesores || [];

// Intentar recuperar datos si existen
try {
  const storedHorarios = localStorage.getItem("horariosCurso");
  const storedAsignaturas = localStorage.getItem("asignaturas");
  if (storedHorarios) horariosCurso = JSON.parse(storedHorarios);
  if (storedAsignaturas) asignaturas = JSON.parse(storedAsignaturas);
} catch (e) {
  console.warn("No se pudo cargar desde localStorage");
}

// ====== INICIALIZAR SELECTS ======
document.addEventListener("DOMContentLoaded", () => {
  const selCurso = document.getElementById("selectCurso");
  const listaProfesores = document.getElementById("listaProfesores");
  const inputProfJefe = document.getElementById("inputProfesorJefe");
  const anioInput = document.getElementById("anioCurso");

  let cursoGuardado = "";
  try {
    cursoGuardado = localStorage.getItem("cursoSeleccionado") || "";
  } catch {
    cursoGuardado = "";
  }

  for (let i = 1; i <= 8; i++) {
    const opt = document.createElement("option");
    opt.value = `${i} Básico`;
    opt.textContent = `${i} Básico`;
    selCurso.appendChild(opt);
  }

  if (cursoGuardado) selCurso.value = cursoGuardado;

  profesores.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.nombre;
    listaProfesores.appendChild(opt);
  });

  renderHorarioCurso();
  actualizarEncabezado();

  selCurso.addEventListener("change", (e) => {
    const nuevoCurso = e.target.value;
    localStorage.setItem("cursoSeleccionadoTemp", nuevoCurso);
    document.body.classList.add("fade-out");
    setTimeout(() => location.reload(), 300);
  });

  inputProfJefe.addEventListener("input", actualizarEncabezado);
  anioInput.addEventListener("input", actualizarEncabezado);
});

// ====== RESTAURAR CURSO DESPUÉS DE RECARGA ======
try {
  const cursoGuardado = localStorage.getItem("cursoSeleccionadoTemp");
  if (cursoGuardado) {
    document.getElementById("selectCurso").value = cursoGuardado;
    actualizarEncabezado();
    renderHorarioCurso();
    localStorage.setItem("cursoSeleccionado", cursoGuardado);
    localStorage.removeItem("cursoSeleccionadoTemp");
  }
} catch (e) {
  console.warn("No se pudo restaurar curso");
}

// ====== ACTUALIZAR ENCABEZADO ======
function actualizarEncabezado() {
  const curso = document.getElementById("selectCurso").value || "—";
  const profJefe = document.getElementById("inputProfesorJefe").value || "—";
  const anio = document.getElementById("anioCurso").value || new Date().getFullYear();

  document.getElementById("cursoBadge").innerText = `Curso: ${curso}`;
  document.getElementById("profesorJefeTxt").innerText = `Profesor Jefe: ${profJefe}`;
  document.getElementById("anioHorario").innerText = `Año: ${anio}`;
}

// ====== RENDERIZAR TABLA (editable) ======
function renderHorarioCurso() {
  const tabla = document.getElementById("tablaHorario");
  tabla.innerHTML = "";

  const curso = document.getElementById("selectCurso").value;
  const dataCurso = horariosCurso[curso] || {};

  horas.forEach((hora) => {
    let fila = `
      <tr class="fila-horario fade-in">
        <td class="align-middle text-center" style="width:140px;">
          <b>Clases</b><br>${hora}
        </td>
    `;

    for (let dia = 0; dia < 5; dia++) {
      const clases = dataCurso[hora]?.[dia] || [];
      let celda = `<td class="celda-horario" data-hora="${hora}" data-dia="${dia}"><div class="bloques-container">`;

      if (clases.length > 0) {
        clases.forEach((clase, i) => {
          const asig = asignaturas.find(a => a.nombre === clase.nombre && a.curso === curso);
          const color = asig ? asig.color : "#667eea";
          const nombreCorto = clase.nombre.length > 18 ? clase.nombre.substring(0, 16) + '...' : clase.nombre;
          const profesorCorto = clase.profesor.length > 22 ? clase.profesor.substring(0, 20) + '...' : clase.profesor;

          celda += `
            <div class="bloque-asignatura rounded text-white text-center"
                 style="background:${color}; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:55px; padding:4px; cursor:pointer;"
                 onclick="editarClase('${curso}','${hora}',${dia},${i})"
                 title="Editar ${clase.nombre}">
              <div class="nombre-asignatura fw-bold" style="font-size:0.9rem;">${nombreCorto}</div>
              <div class="nombre-profesor" style="font-size:0.75rem; opacity:0.9;">${profesorCorto}</div>
            </div>`;
        });

        if (clases.length < 3) {
          celda += `<button class="btn btn-sm btn-outline-secondary btn-agregar-mini mt-1 w-100"
                     onclick="agregarClase('${curso}','${hora}',${dia})">+ Agregar</button>`;
        }
      } else {
        celda += `<button class="btn btn-sm btn-outline-secondary w-100"
                   onclick="agregarClase('${curso}','${hora}',${dia})">+ Agregar</button>`;
      }

      celda += "</div></td>";
      fila += celda;
    }

    fila += "</tr>";
    tabla.innerHTML += fila;
  });
}

// ====== EDITAR CLASE (con colisión global) ======
function editarClase(curso, hora, dia, index) {
  const cursoActual = document.getElementById("selectCurso").value;
  const clase = horariosCurso[curso][hora][dia][index];
  const asignaturasFiltradas = asignaturas.filter((a) => a.curso === cursoActual);

  let opciones = `<option value="">Seleccionar asignatura...</option>`;
  opciones += asignaturasFiltradas.map(
    (a) => `<option value="${a.nombre}" ${a.nombre === clase.nombre ? 'selected' : ''}>${a.nombre}</option>`
  ).join("");

  const modalHTML = `
    <div class="modal fade" id="modalEditar" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">✏️ Editar Clase – ${cursoActual}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formEditarClase">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Asignatura</label>
                  <select id="asignaturaEdit" class="form-select" required>${opciones}</select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Profesor</label>
                  <input type="text" id="profEdit" class="form-control" value="${clase.profesor}" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Hora</label>
                  <input type="text" class="form-control" value="${hora}" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Apoyos</label>
                  <input type="text" id="apoyoEdit" class="form-control" value="${clase.apoyo || ''}">
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold">Observaciones</label>
                  <textarea id="obsEdit" class="form-control" rows="2">${clase.obs || ''}</textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" id="btnEliminarClase">🗑️ Eliminar</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" id="btnActualizarClase">💾 Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>`;
  
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
  modal.show();

  // Cambio de asignatura → actualiza profesor
  document.getElementById("asignaturaEdit").addEventListener("change", (e) => {
    const asig = asignaturas.find((a) => a.nombre === e.target.value && a.curso === cursoActual);
    document.getElementById("profEdit").value = asig ? asig.profesor : "";
  });

  // Eliminar
  document.getElementById("btnEliminarClase").onclick = () => {
    modal.hide();
    eliminarClase(curso, hora, dia, index);
  };
  // ====== ELIMINAR CLASE ======
function eliminarClase(curso, hora, dia, index) {
  Swal.fire({
    title: "¿Eliminar clase?",
    text: "Esta clase será eliminada del horario.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#eb3349",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "🗑️ Sí, eliminar",
    cancelButtonText: "Cancelar",
    background: "#fff",
  }).then((result) => {
    if (result.isConfirmed) {
      // Si no existe el curso o la hora, salimos
      if (!horariosCurso[curso] || !horariosCurso[curso][hora] || !horariosCurso[curso][hora][dia]) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontró la clase a eliminar.",
          confirmButtonColor: "#eb3349",
        });
        return;
      }

      // Eliminar el bloque
      horariosCurso[curso][hora][dia].splice(index, 1);

      // Si quedó vacío, limpiar estructuras
      if (horariosCurso[curso][hora][dia].length === 0) {
        delete horariosCurso[curso][hora][dia];
      }
      if (Object.keys(horariosCurso[curso][hora]).length === 0) {
        delete horariosCurso[curso][hora];
      }

      // Guardar en localStorage
      try {
        localStorage.setItem("horariosCurso", JSON.stringify(horariosCurso));
      } catch (e) {
        console.warn("Error guardando en localStorage:", e);
      }

      Swal.fire({
        icon: "success",
        title: "✅ Clase eliminada",
        text: "La clase ha sido eliminada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Renderizar de nuevo
      renderHorarioCurso();
    }
  });
}


  // Guardar cambios
  document.getElementById("btnActualizarClase").onclick = () => {
    const nombre = document.getElementById("asignaturaEdit").value;
    const profesor = document.getElementById("profEdit").value;
    const obs = document.getElementById("obsEdit").value;
    const apoyo = document.getElementById("apoyoEdit").value;

    if (!nombre || !profesor) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes seleccionar una asignatura válida.",
      });
      return;
    }

    // 🚫 Verificar colisión global del profesor en otro curso
    for (const [cursoExistente, data] of Object.entries(horariosCurso)) {
      if (!data[hora]) continue;
      const clasesEnHora = data[hora][dia] || [];
      const colision = clasesEnHora.some((c, idx) => 
        c.profesor === profesor && !(cursoExistente === curso && idx === index)
      );
      if (colision && cursoExistente !== curso) {
        Swal.fire({
          icon: "error",
          title: "🚫 Conflicto de horario",
          html: `<b>${profesor}</b> ya tiene clases en <b>${cursoExistente}</b> a las <b>${hora}</b>.`,
          confirmButtonColor: "#eb3349",
          background: "#fff",
        });
        return;
      }
    }

    // Guardar cambios
    horariosCurso[curso][hora][dia][index] = { nombre, profesor, obs, apoyo };
    localStorage.setItem("horariosCurso", JSON.stringify(horariosCurso));

    Swal.fire({
      icon: "success",
      title: "✅ Actualizado",
      text: "La clase se actualizó correctamente.",
      timer: 1800,
      showConfirmButton: false,
    });

    modal.hide();
    renderHorarioCurso();
  };

  // Eliminar modal al cerrar
  document.getElementById("modalEditar").addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}


// ====== AGREGAR CLASE ======
function agregarClase(curso, hora, dia) {
  const cursoActual = document.getElementById("selectCurso").value;
  const asignaturasFiltradas = asignaturas.filter((a) => a.curso === cursoActual);

  let opciones = `<option value="">Seleccionar asignatura...</option>`;
  opciones += asignaturasFiltradas.map((a) => `<option value="${a.nombre}">${a.nombre}</option>`).join("");

  const modalHTML = `
    <div class="modal fade" id="modalAgregar" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">➕ Agregar Clase – ${cursoActual}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formAgregarClase">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Asignatura</label>
                  <select id="asignaturaSel" class="form-select" required>${opciones}</select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Profesor</label>
                  <input type="text" id="profSel" class="form-control" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Hora</label>
                  <input type="text" class="form-control" value="${hora}" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Apoyos</label>
                  <input type="text" id="apoyoSel" class="form-control" placeholder="Ej: Psicopedagoga, Fonoaudiólogo...">
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold">Observaciones</label>
                  <textarea id="obsSel" class="form-control" rows="2" placeholder="Notas u observaciones"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" id="btnGuardarClase">💾 Guardar</button>
          </div>
        </div>
      </div>
    </div>`;
  
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = new bootstrap.Modal(document.getElementById("modalAgregar"));
  modal.show();

  document.getElementById("modalAgregar").addEventListener('hidden.bs.modal', function () {
    this.remove();
  });

  document.getElementById("asignaturaSel").addEventListener("change", (e) => {
    const asig = asignaturas.find((a) => a.nombre === e.target.value && a.curso === cursoActual);
    document.getElementById("profSel").value = asig ? asig.profesor : "";
  });

  document.getElementById("btnGuardarClase").onclick = () => {
    const nombre = document.getElementById("asignaturaSel").value;
    const profesor = document.getElementById("profSel").value;
    const obs = document.getElementById("obsSel").value;
    const apoyo = document.getElementById("apoyoSel").value;

    if (!nombre || !profesor) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Campos incompletos",
        text: "Debes seleccionar una asignatura válida antes de continuar.",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    // 🚫 VALIDAR COLISIÓN DE HORARIOS ENTRE CURSOS
    for (const [cursoExistente, data] of Object.entries(horariosCurso)) {
      if (!data[hora]) continue;
      const clasesEnHora = data[hora][dia] || [];
      const colision = clasesEnHora.some(c => c.profesor === profesor);
      if (colision && cursoExistente !== cursoActual) {
        Swal.fire({
          icon: "error",
          title: "🚫 Conflicto de horario",
          html: `<b>${profesor}</b> ya tiene clases asignadas en <b>${cursoExistente}</b> el bloque <b>${hora}</b>.`,
          confirmButtonColor: "#eb3349",
          background: "#fff",
        });
        return;
      }
    }

    // Guardar normalmente
    if (!horariosCurso[cursoActual]) horariosCurso[cursoActual] = {};
    if (!horariosCurso[cursoActual][hora]) horariosCurso[cursoActual][hora] = {};
    if (!horariosCurso[cursoActual][hora][dia]) horariosCurso[cursoActual][hora][dia] = [];

    if (horariosCurso[cursoActual][hora][dia].length >= 3) {
      Swal.fire({
        icon: "info",
        title: "ℹ️ Límite alcanzado",
        text: "Solo puedes agregar hasta 3 asignaturas en el mismo bloque.",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    horariosCurso[cursoActual][hora][dia].push({ nombre, profesor, obs, apoyo });
    localStorage.setItem("horariosCurso", JSON.stringify(horariosCurso));

    Swal.fire({
      icon: "success",
      title: "✅ Clase agregada",
      text: `Se ha asignado ${nombre} con ${profesor}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    modal.hide();
    renderHorarioCurso();
  };


  document.getElementById("modalAgregar").addEventListener("hidden.bs.modal", function () {
    this.remove();
  });
}

// ====== EXPORTAR (ajustado sin footer ni controles) ======
function getExportArea() {
  // Solo toma encabezado + horario
  const header = document.querySelector("#headerHorario").cloneNode(true);
  const tabla = document.querySelector("#tablaHorario").cloneNode(true);

  const exportDiv = document.createElement("div");
  exportDiv.style.background = "#fff";
  exportDiv.style.padding = "20px";
  exportDiv.style.borderRadius = "12px";
  exportDiv.style.width = "fit-content";
  exportDiv.style.margin = "0 auto";

  exportDiv.appendChild(header);
  exportDiv.appendChild(document.createElement("br"));
  exportDiv.appendChild(tabla);
  return exportDiv;
}

// 🖼️ PNG
function exportPNG() {
  const exportNode = getExportArea();
  document.body.appendChild(exportNode);
  html2canvas(exportNode, { scale: 3 }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "horario.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    exportNode.remove();
  });
}

// 📊 Excel
function exportExcel() {
  const headerText = document.querySelector("#headerHorario").innerText
    .replace(/\n+/g, " ")
    .trim();
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.querySelector("#tablaHorario"));
  XLSX.utils.book_append_sheet(wb, ws, "Horario");
  wb.Props = { Title: headerText };
  XLSX.writeFile(wb, "horario.xlsx");
}

// 📄 PDF
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("l", "pt", "a4");
  const exportNode = getExportArea();

  document.body.appendChild(exportNode);
  html2canvas(exportNode, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pdf.internal.pageSize.getWidth() - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 30, imgWidth, imgHeight);
    pdf.save("horario.pdf");
    exportNode.remove();
  });
}

