const VERSION_FILE = "version.json";

async function cargarInformacion() {

try {

const respuesta = await fetch(
  VERSION_FILE + "?t=" + Date.now()
);

if (!respuesta.ok) {
  throw new Error("Error al cargar la información");
}

const datos = await respuesta.json();

// =========================
// INFORMACIÓN DE LA APP
// =========================

const version = document.getElementById("version");
const size = document.getElementById("size");
const date = document.getElementById("date");

if (version) {
  version.textContent = datos.version || "Desconocida";
}

if (size) {
  size.textContent = datos.size || "Desconocido";
}

if (date) {
  date.textContent = datos.releaseDate || "Sin fecha";
}

// =========================
// ENLACE DE DESCARGA
// =========================

const boton = document.getElementById("downloadButton");

if (boton && datos.downloadUrl) {
  boton.href = datos.downloadUrl;
}

// =========================
// TÍTULO DE NOVEDADES
// =========================

const updateTitle = document.getElementById("updateTitle");

if (updateTitle) {
  updateTitle.textContent =
    "Versión " + (datos.version || "");
}

// =========================
// DESCRIPCIÓN
// =========================

const updateDescription =
  document.getElementById("updateDescription");

if (updateDescription) {

  if (
    datos.changelog &&
    Array.isArray(datos.changelog) &&
    datos.changelog.length > 0
  ) {

    updateDescription.textContent =
      datos.changelog.join(" · ");

  } else {

    updateDescription.textContent =
      "Sin novedades disponibles.";

  }
}

// =========================
// ESTADO DE CARGA
// =========================

console.log("Información cargada correctamente");

} catch (error) {

console.error(
  "No se pudo cargar la información:",
  error
);

}

}

cargarInformacion();
