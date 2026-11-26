import { formatoPrecio } from '../utils/formato.js'

function MisReservas({ reservas, onEliminar }) {
  return (
    <section className="reservas">
      <h2>🎫 Mis reservas ({reservas.length})</h2>

      {reservas.length === 0 ? (
        <p className="vacio">Aún no tienes reservas 👀</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id} className="reserva">
              <div>
                <strong>{r.nombre}</strong> · {r.pasajeros} pasajero
                {r.pasajeros !== 1 ? 's' : ''} · {r.clase} · Vuelo {r.vuelo}
                <small>📅 {r.fecha}</small>
              </div>
              <b>{formatoPrecio(r.total)}</b>
              <button
                type="button"
                className="btn-eliminar"
                onClick={() => onEliminar(r.id)}
                aria-label={`Eliminar reserva de ${r.nombre}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MisReservas
