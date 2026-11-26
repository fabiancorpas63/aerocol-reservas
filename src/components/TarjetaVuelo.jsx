import { formatoPrecio } from '../utils/formato.js'

function TarjetaVuelo({ vuelo, seleccionada, onSeleccionar }) {
  return (
    <li
      className={seleccionada ? 'tarjeta seleccionada' : 'tarjeta'}
      onClick={() => onSeleccionar(vuelo)}
    >
      <strong>🛩️ {vuelo.avion}</strong>
      <span>🕐 {vuelo.hora}</span>
      <b>{formatoPrecio(vuelo.precio)}</b>
      <button type="button" className="btn-ver">
        {seleccionada ? '✓ Elegido' : 'Ver'}
      </button>
    </li>
  )
}

export default TarjetaVuelo
