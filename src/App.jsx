import { useState } from 'react'
import './App.css'
import { CIUDADES, VUELOS, CLASES, ORDENES } from './data/vuelos.js'
import Header from './components/Header.jsx'
import SelectorRuta from './components/SelectorRuta.jsx'
import SelectorOrden from './components/SelectorOrden.jsx'
import ListaVuelos from './components/ListaVuelos.jsx'
import FormularioReserva from './components/FormularioReserva.jsx'
import MisReservas from './components/MisReservas.jsx'
import Footer from './components/Footer.jsx'

const CLAVE_RESERVAS = 'aerocol-reservas'

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

// F2: leer las reservas guardadas (solo se ejecuta al montar la app)
function cargarReservas() {
  try {
    const guardadas = localStorage.getItem(CLAVE_RESERVAS)
    return guardadas ? JSON.parse(guardadas) : []
  } catch {
    return []
  }
}

// F2: guardar las reservas como texto JSON
function guardarReservas(reservas) {
  try {
    localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas))
  } catch {
    // Si el navegador no deja guardar (modo privado, sin espacio), la app sigue funcionando
  }
}

// F3: ordena una COPIA de la lista; el array original no se toca
function ordenarVuelos(vuelos, orden) {
  return [...vuelos].sort((a, b) => {
    if (orden === 'precio-desc') return b.precio - a.precio
    if (orden === 'hora') return a.hora.localeCompare(b.hora)
    if (orden === 'avion') return a.avion.localeCompare(b.avion)
    return a.precio - b.precio // 'precio-asc'
  })
}

function App() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [orden, setOrden] = useState('precio-asc')
  const [seleccionado, setSeleccionado] = useState(null)
  const [reservas, setReservas] = useState(cargarReservas)

  // Datos derivados (se calculan, no se guardan)
  const ciudadesDestino = CIUDADES.filter((c) => c.codigo !== origen)
  const vuelosEncontrados =
    origen !== '' && destino !== ''
      ? VUELOS.filter((v) => v.origen === origen && v.destino === destino)
      : []
  const vuelosOrdenados = ordenarVuelos(vuelosEncontrados, orden)

  const manejarOrigen = (codigo) => {
    setOrigen(codigo)
    if (codigo === destino) setDestino('')
    setSeleccionado(null)
  }

  const manejarDestino = (codigo) => {
    setDestino(codigo)
    setSeleccionado(null)
  }

  const intercambiar = () => {
    setOrigen(destino)
    setDestino(origen)
    setSeleccionado(null)
  }

  // Un solo lugar que cambia la lista Y la guarda en localStorage
  const actualizarReservas = (nuevas) => {
    setReservas(nuevas)
    guardarReservas(nuevas)
  }

  const reservar = (datos) => {
    const nueva = {
      id: crypto.randomUUID(),
      vuelo: seleccionado.id,
      ...datos,
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
    }
    actualizarReservas([...reservas, nueva])
    setSeleccionado(null)
  }

  const eliminarReserva = (id) => {
    actualizarReservas(reservas.filter((r) => r.id !== id))
  }

  return (
    <main>
      <Header aerolinea="AeroCol" eslogan="Tu vuelo en un clic" />

      <section className="selector">
        <h2>✈️ Busca tu vuelo</h2>

        <SelectorRuta
          origen={origen}
          destino={destino}
          ciudades={CIUDADES}
          ciudadesDestino={ciudadesDestino}
          onOrigen={manejarOrigen}
          onDestino={manejarDestino}
        />

        <SelectorOrden orden={orden} opciones={ORDENES} onCambio={setOrden} />

        <button type="button" onClick={intercambiar} disabled={!origen || !destino}>
          🔄 Intercambiar
        </button>
      </section>

      {!origen || !destino ? (
        <p className="mensaje">Elige origen y destino para buscar vuelos 🛫</p>
      ) : vuelosEncontrados.length === 0 ? (
        <p className="mensaje">No hay vuelos para esa ruta 🙃</p>
      ) : (
        <ListaVuelos
          vuelos={vuelosOrdenados}
          nombreOrigen={nombreCiudad(origen)}
          nombreDestino={nombreCiudad(destino)}
          idSeleccionado={seleccionado?.id}
          onSeleccionar={setSeleccionado}
        />
      )}

      {seleccionado && (
        <FormularioReserva
          key={seleccionado.id}
          vuelo={seleccionado}
          nombreOrigen={nombreCiudad(seleccionado.origen)}
          nombreDestino={nombreCiudad(seleccionado.destino)}
          clases={CLASES}
          onReservar={reservar}
        />
      )}

      <MisReservas reservas={reservas} onEliminar={eliminarReserva} />

      <Footer anio={2026} />
    </main>
  )
}

export default App
