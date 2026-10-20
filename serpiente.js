const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;
const serpiente = [];
const COLOR_CABEZA = "#facc15";
const COLOR_CUERPO = "#ef4444";
const COLOR_COMIDA = "#60a5fa";
let colorParte = COLOR_CUERPO;
let intervaloSerpiente = null;
let direccionActual = "derecha";
let direccionUltimoMovimiento = "derecha";
let cambioPendiente = false;
let comida = null;
let puntaje = 0;
let terminado = false;
const TIEMPO_MOVIMIENTO = 1000;

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
  pintarComida();
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


// unshift agrega una nueva cabeza; pop retira la cola.
// Se devuelve la posición retirada para recuperarla al comer.
function moverDerecha() {
  const cabeza = serpiente[0];
  serpiente.unshift({x: cabeza.x + 1, y: cabeza.y});
  return serpiente.pop();
}

function moverIzquierda() {
  const cabeza = serpiente[0];
  serpiente.unshift({x: cabeza.x - 1, y: cabeza.y});
  return serpiente.pop();
}

function moverArriba() {
  const cabeza = serpiente[0];
  serpiente.unshift({x: cabeza.x, y: cabeza.y - 1});
  return serpiente.pop();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  serpiente.unshift({x: cabeza.x, y: cabeza.y + 1});
  return serpiente.pop();
}

function cambiarDireccion(direccion) {
  const opuestas = {derecha: "izquierda", izquierda: "derecha",
    arriba: "abajo", abajo: "arriba"};
  if (!opuestas[direccion] || terminado || cambioPendiente) return;
  // Impide girar hacia el propio cuello y dos giros entre dos ticks.
  if (serpiente.length > 1 && direccion === opuestas[direccionUltimoMovimiento]) return;
  if (direccion !== direccionActual) {
    direccionActual = direccion;
    cambioPendiente = true;
  }
  // Aquí no se mueve el arreglo: el siguiente intervalo aplica la dirección.
}

function iniciarJuego() {
  if (intervaloSerpiente !== null || terminado) return;
  intervaloSerpiente = setInterval(moverSerpiente, TIEMPO_MOVIMIENTO);
  document.getElementById("estado").textContent = "Jugando";
  document.getElementById("mensaje").textContent = "Come el cuadrado azul. Usa las flechas o los botones.";
}

function pausarJuego() {
  if (intervaloSerpiente !== null) {
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = null;
  }
  if (!terminado) {
    document.getElementById("estado").textContent = "Pausa";
    document.getElementById("mensaje").textContent = "Pulsa Iniciar para continuar.";
  }
}

function terminarJuego(mensaje) {
  pausarJuego();
  terminado = true;
  document.getElementById("estado").textContent = "Finalizado";
  document.getElementById("mensaje").textContent = mensaje + " Pulsa Reiniciar.";
}

function pintarComida() {
  // Se genera solo si no existe: repintar no cambia su ubicación.
  // Los índices válidos van de 0 a columnas-1 y de 0 a filas-1.
  if (comida === null) {
    const columnas = Math.floor(canvas.width / TAMANIO_CELDA);
    const filas = Math.floor(canvas.height / TAMANIO_CELDA);
    const libres = [];
    for (let y = 0; y < filas; y++) {
      for (let x = 0; x < columnas; x++) {
        if (!serpiente.some(parte => parte.x === x && parte.y === y)) {
          libres.push({x, y});
        }
      }
    }
    if (libres.length === 0) {
      terminarJuego("¡Ganaste! Llenaste todo el tablero.");
      return;
    }
    comida = libres[Math.floor(Math.random() * libres.length)];
  }
  colorParte = COLOR_COMIDA;
  pintarParte(comida.x, comida.y);
}

function atrapaComida() {
  return comida !== null && serpiente[0].x === comida.x &&
    serpiente[0].y === comida.y;
}

function moverSerpiente() {
  if (terminado) return;
  const cabeza = serpiente[0];
  const pasos = {derecha: {x: 1, y: 0}, izquierda: {x: -1, y: 0},
    arriba: {x: 0, y: -1}, abajo: {x: 0, y: 1}};
  const paso = pasos[direccionActual];
  const siguiente = {x: cabeza.x + paso.x, y: cabeza.y + paso.y};
  const columnas = Math.floor(canvas.width / TAMANIO_CELDA);
  const filas = Math.floor(canvas.height / TAMANIO_CELDA);
  if (siguiente.x < 0 || siguiente.y < 0 || siguiente.x >= columnas || siguiente.y >= filas) {
    terminarJuego("La serpiente chocó con el borde.");
    return;
  }
  const comera = comida !== null && siguiente.x === comida.x && siguiente.y === comida.y;
  // Si no crece, la celda de la cola se libera en este movimiento.
  const cuerpo = comera ? serpiente : serpiente.slice(0, -1);
  if (cuerpo.some(parte => parte.x === siguiente.x && parte.y === siguiente.y)) {
    terminarJuego("La serpiente chocó con su cuerpo.");
    return;
  }
  let colaAnterior;
  switch (direccionActual) {
    case "derecha": colaAnterior = moverDerecha(); break;
    case "izquierda": colaAnterior = moverIzquierda(); break;
    case "arriba": colaAnterior = moverArriba(); break;
    case "abajo": colaAnterior = moverAbajo(); break;
  }
  direccionUltimoMovimiento = direccionActual;
  cambioPendiente = false;
  if (atrapaComida()) {
    puntaje++;
    // Recuperar la cola anterior mantiene continuidad incluso en una curva.
    serpiente.push(colaAnterior);
    comida = null;
  }
  actualizarMarcador();
  dibujarTodo();
}

function actualizarMarcador() {
  document.getElementById("puntaje").textContent = puntaje;
  document.getElementById("cantidadPartes").textContent = serpiente.length;
}

function reiniciarJuego() {
  pausarJuego();
  terminado = false;
  puntaje = 0;
  direccionActual = "derecha";
  direccionUltimoMovimiento = "derecha";
  cambioPendiente = false;
  comida = null;
  serpiente.length = 0;
  const x = Math.floor(canvas.width / TAMANIO_CELDA / 2);
  const y = Math.floor(canvas.height / TAMANIO_CELDA / 2);
  serpiente.push({x, y}, {x: x - 1, y}, {x: x - 2, y});
  actualizarMarcador();
  document.getElementById("estado").textContent = "Listo";
  document.getElementById("mensaje").textContent = "Cabeza amarilla, cuerpo rojo y comida azul. Pulsa Iniciar.";
  dibujarTodo();
}

document.addEventListener("keydown", function(evento) {
  const direcciones = {ArrowUp: "arriba", ArrowDown: "abajo",
    ArrowLeft: "izquierda", ArrowRight: "derecha"};
  if (direcciones[evento.key]) {
    evento.preventDefault();
    cambiarDireccion(direcciones[evento.key]);
  } else if (evento.code === "Space") {
    evento.preventDefault();
    if (intervaloSerpiente === null) iniciarJuego(); else pausarJuego();
  }
});

reiniciarJuego();
