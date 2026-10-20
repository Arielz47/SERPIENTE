// Canvas: sus atributos HTML definen las coordenadas de dibujo.
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

// Primera pintura al cargar la página.
dibujarTodo();

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
}
