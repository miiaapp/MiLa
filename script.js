const VERSION_FILE = "version.json";

// ==========================================
// CONFIGURACIÓN
// ==========================================

const APK_FALLBACK_SIZE = "Tamaño no disponible";

// ==========================================
// FORMATEAR TAMAÑO
// ==========================================

function formatearTamano(bytes) {

if (!bytes || bytes <= 0) {
return APK_FALLBACK_SIZE;
}

const mb = bytes / (1024 * 1024);

return mb.toFixed(2) + " MB";

}

// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

if (!fecha) {
return "Sin fecha";
}

const partes = fecha.split("-");

if (partes.length !== 3) {
return fecha;
}

return partes[2] + "/" + partes[1] + "/" + partes[0];

}

// ==========================================
// MOSTRAR NOVEDADES
// ==========================================

function mostrarNovedades(changelog, version) {

const contenedor = document.getElementById(
"updatesList"
);

if (!contenedor) return;

contenedor.replaceChildren();

const titulo = document.createElement("h3");

titulo.textContent = "Versión " + version;

const novedades = Array.isArray(changelog)
? changelog
: [];

if (novedades.length === 0) {

const mensaje = document.createElement("p");

mensaje.textContent = "Sin novedades disponibles.";

contenedor.appendChild(mensaje);

return;

}

novedades.forEach((novedad) => {

const tarjeta = document.createElement("div");

tarjeta.className = "update-card";

const icono = document.createElement("span");

icono.className = "update-icon";
icono.textContent = "✧";

const contenido = document.createElement("div");

const texto = document.createElement("p");

texto.textContent = novedad;

contenido.appendChild(texto);

tarjeta.appendChild(icono);
tarjeta.appendChild(contenido);

contenedor.appendChild(tarjeta);

});

}

// ==========================================
// OBTENER TAMAÑO REAL DE LA APK
// ==========================================

async function obtenerTamanoAPK(url, tamanoJSON) {

try {

const respuesta = await fetch(url, {
  method: "HEAD",
  cache: "no-store"
});

if (!respuesta.ok) {
  return tamanoJSON || APK_FALLBACK_SIZE;
}

const bytes = respuesta.headers.get(
  "Content-Length"
);

if (bytes) {
  return formatearTamano(
    Number(bytes)
  );
}

} catch (error) {

console.warn(
  "No se pudo obtener el tamaño real:",
  error
);

}

return tamanoJSON || APK_FALLBACK_SIZE;

}

// ==========================================
// CARGAR INFORMACIÓN
// ==========================================

async function cargarInformacion() {

try {

const respuesta = await fetch(
  VERSION_FILE + "?t=" + Date.now(),
  {
    cache: "no-store"
  }
);

if (!respuesta.ok) {

  throw new Error(
    "No se pudo cargar version.json"
  );

}

const datos = await respuesta.json();

// ======================================
// VALIDAR INFORMACIÓN
// ======================================

if (!datos.version || !datos.downloadUrl) {

  throw new Error(
    "Faltan datos obligatorios en version.json"
  );

}

// ======================================
// INFORMACIÓN DE LA APP
// ======================================

const version = document.getElementById(
  "version"
);

const size = document.getElementById(
  "size"
);

const date = document.getElementById(
  "date"
);

if (version) {

  version.textContent = datos.version;

}

if (date) {

  date.textContent = formatearFecha(
    datos.releaseDate
  );

}

// ======================================
// ENLACE DE DESCARGA
// ======================================

const boton = document.getElementById(
  "downloadButton"
);

const urlAPK = new URL(
  datos.downloadUrl,
  window.location.href
);

if (boton) {

  boton.href = urlAPK.href;

  boton.setAttribute(
    "download",
    "MiIA.apk"
  );

}

// ======================================
// TAMAÑO REAL
// ======================================

if (size) {

  size.textContent = await obtenerTamanoAPK(
    urlAPK.href,
    datos.size
  );

}

// ======================================
// NOVEDADES
// ======================================

mostrarNovedades(
  datos.changelog,
  datos.version
);

// ======================================
// INFORMACIÓN EN CONSOLA
// ======================================

console.log(
  "Mi IA: información cargada correctamente"
);

console.log(
  "Versión:",
  datos.version
);

console.log(
  "Descarga:",
  urlAPK.href
);

} catch (error) {

console.error(
  "Error al cargar Mi IA:",
  error
);

const contenedor = document.getElementById(
  "updatesList"
);

if (contenedor) {

  contenedor.textContent =
    "No se pudo cargar la información. Inténtalo nuevamente.";

}

}

}

// ==========================================
// INICIAR
// ==========================================

cargarInformacion();
