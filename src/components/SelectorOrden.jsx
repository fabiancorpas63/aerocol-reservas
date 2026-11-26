function SelectorOrden({ orden, opciones, onCambio }) {
  return (
    <label className="campo orden">
      Ordenar por
      <select value={orden} onChange={(e) => onCambio(e.target.value)}>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SelectorOrden
