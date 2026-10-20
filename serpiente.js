// Canvas: sus atributos HTML definen las coordenadas de dibujo.
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

// Cada objeto representa una celda del cuerpo. El índice 0 es la cabeza.
const serpiente = [];
let colorParte = "#ef4444";
const COLOR_CABEZA = "#facc15";
const COLOR_CUERPO = "#ef4444";

// Se muestra al cargar el ejercicio final con cabeza amarilla y cuerpo rojo.
seleccionarEjercicio("final");

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() {
  ctx.strokeStyle = "#28716f";
  ctx.lineWidth = 1;
  // Cada trazo comienza con beginPath para no repetir líneas anteriores.
  // Verticales: cambia X y se recorre toda la altura real del canvas.
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  // Horizontales: cambia Y y se recorre todo el ancho real del canvas.
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarSerpiente();
}

function pintarParte(lineaX, lineaY) {
  const x = lineaX * TAMANIO_CELDA;
  const y = lineaY * TAMANIO_CELDA;
  ctx.fillStyle = colorParte;
  ctx.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
  ctx.strokeStyle = "#fff1f2";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    colorParte = i === 0 ? COLOR_CABEZA : COLOR_CUERPO;
    pintarParte(serpiente[i].x, serpiente[i].y);
  }
}

function seleccionarEjercicio(ejercicio) {
  const ultimaColumna = Math.floor(canvas.width / TAMANIO_CELDA) - 1;
  const ultimaFila = Math.floor(canvas.height / TAMANIO_CELDA) - 1;
  let partes;
  let mensaje;
  switch (ejercicio) {
    case "pruebas":
      partes = [
        {x: 5, y: 5},
        {x: 10, y: 2},
        {x: 4, y: ultimaFila},
        {x: ultimaColumna, y: 4},
        {x: 0, y: 8},
        {x: ultimaColumna, y: ultimaFila}
      ];
      mensaje = "Seis pruebas: (5,5), (10,2), borde inferior, derecho, izquierdo y esquina inferior derecha.";
      break;
    case "horizontal":
      partes = [{x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}];
      mensaje = "Ejercicio 1: serpiente horizontal de tres cuadros.";
      break;
    case "izquierda":
      partes = [{x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}, {x: 0, y: 8}];
      mensaje = "Ejercicio 3: cinco cuadros subiendo junto al borde izquierdo. Cabeza arriba.";
      break;
    case "ele":
    case "final":
      // Misma forma que el PDF: tres cuadros horizontales y uno abajo a la derecha.
      partes = [{x: 10, y: 10}, {x: 10, y: 9}, {x: 9, y: 9}, {x: 8, y: 9}];
      mensaje = "Ejercicio final: forma de L. Cabeza amarilla y cuerpo rojo.";
      break;
    default:
      return;
  }
  // Conservamos el arreglo const: se modifica su contenido.
  serpiente.length = 0;
  for (let i = 0; i < partes.length; i++) {
    serpiente.push(partes[i]);
  }
  document.getElementById("ejercicio").value = ejercicio;
  document.getElementById("cantidadPartes").textContent = serpiente.length;
  document.getElementById("mensaje").textContent = mensaje;
  dibujarTodo();
}
