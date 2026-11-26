import { useState } from 'react'
import { formatoPrecio } from '../utils/formato.js'

function FormularioReserva({ vuelo, nombreOrigen, nombreDestino, clases, onReservar }) {
  // Estado local: solo este formulario necesita estos datos mientras se llenan
  const [nombre, setNombre] = useState('')
  const [pasajeros, setPasajeros] = useState(1)
  const [clase, setClase] = useState(clases[0].id)

  // Estado derivado: el total se calcula en cada render, no se guarda
  const factor = clases.find((c) => c.id === clase).factor
  const total = Math.round(vuelo.precio * pasajeros * factor)
  const nombreValido = nombre.trim() !== ''

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (!nombreValido) return
    onReservar({
      nombre: nombre.trim(),
      pasajeros,
      clase: clases.find((c) => c.id === clase).nombre,
      total,
    })
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <h2>
        🎟️ Reservar {vuelo.avion} · {vuelo.hora}
      </h2>

      <ul className="detalle">
        <li>
          🛫 {nombreOrigen} → {nombreDestino} · Vuelo {vuelo.id}
        </li>
        <li>🛩️ Avión: {vuelo.avion}</li>
        <li>🕐 Salida: {vuelo.hora}</li>
        <li>💵 Precio base: {formatoPrecio(vuelo.precio)} por pasajero</li>
      </ul>

      <label className="campo">
        Nombre del pasajero
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Ana García"
        />
      </label>

      <div className="fila">
        <span className="etiqueta">👥 Pasajeros</span>
        <div className="contador">
          <button
            type="button"
            onClick={() => setPasajeros(pasajeros - 1)}
            disabled={pasajeros <= 1}
          >
            −
          </button>
          <strong>{pasajeros}</strong>
          <button type="button" onClick={() => setPasajeros(pasajeros + 1)}>
            +
          </button>
        </div>
      </div>

      <fieldset className="clases">
        <legend>Clase</legend>
        {clases.map((c) => (
          <label key={c.id}>
            <input
              type="radio"
              name="clase"
              value={c.id}
              checked={clase === c.id}
              onChange={() => setClase(c.id)}
            />
            {c.nombre} <small>×{c.factor}</small>
          </label>
        ))}
      </fieldset>

      <div className="fila total">
        <span>
          💰 Total: <strong>{formatoPrecio(total)}</strong>
        </span>
        <button type="submit" className="btn-primario" disabled={!nombreValido}>
          ✅ Reservar
        </button>
      </div>
    </form>
  )
}

export default FormularioReserva
