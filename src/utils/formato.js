// Antes vivía dentro de TarjetaVuelo.jsx. Ahora también lo usan
// FormularioReserva y MisReservas, así que se movió a un archivo compartido.
export function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}
