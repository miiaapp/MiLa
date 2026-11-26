const VERSION_FILE = "version.json";

async function cargarInformacion() {
  try {
    const respuesta = await fetch(
      VERSION_FILE + "?t=" + Date.now()
    );

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar la información");
    }

    const datos = await respuesta.json();

    // Versión
    document.getElementById("version").textContent =
      datos.version || "Desconocida";

    // Tamaño
    document.getElementById("size").textContent =
      datos.size || "Desconocido";

    // Fecha
    document.getElementById("date").textContent =
      datos.releaseDate || "Sin fecha";

    // Enlace de descarga
    const boton = document.getElementById("downloadButton");

    if (datos.downloadUrl) {
      boton.href = datos.downloadUrl;
    }

    // Novedades
    if (datos.changelog && datos.changelog.length > 0) {
      document.getElementById("updateTitle").textContent =
        "Versión " + datos.version;

      document.getElementById("updateDescription").textContent =
        datos.changelog.join(" · ");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

cargarInformacion();
