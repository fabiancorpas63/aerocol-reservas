# Fase 1 — Análisis de la app AeroCol

Análisis de la app de la semana 14 antes de agregar las 3 funcionalidades del proyecto final.

## 1. Respuestas

**1. ¿Dónde viven hoy los estados `origen` y `destino`? ¿Por qué ahí y no en `SelectCiudad`?**

Viven en `App`. `App` es quien los necesita para filtrar los vuelos (`vuelosEncontrados`), calcular las ciudades de destino que se pueden elegir (`ciudadesDestino`) y armar el título de la lista. Si cada `SelectCiudad` guardara su propio valor, `App` no podría leerlo y los dos selects no podrían coordinarse (por ejemplo, limpiar el destino cuando coincide con el origen). Por eso el estado se "sube" al ancestro común (*lifting state up*) y `SelectCiudad` solo recibe `value` y una función `onCambio` para avisar.

**2. `ListaVuelos` recibe `vuelos`, `nombreOrigen`, `nombreDestino`… ¿qué más necesitará para que una tarjeta sea seleccionable?**

Dos props nuevas:

- `onSeleccionar`: una **función** que baja desde `App`. Cuando el usuario hace clic en una tarjeta, la tarjeta la llama con su vuelo para avisarle a `App`.
- `idSeleccionado`: el `id` del vuelo elegido, para que cada tarjeta sepa si debe pintarse resaltada.

`ListaVuelos` no las usa directamente: se las pasa a cada `TarjetaVuelo`.

**3. ¿Qué datos necesita guardar una reserva?**

```js
{
  id: 'a1b2c3…',        // único, con crypto.randomUUID() — sirve de key y para eliminar
  nombre: 'Ana García', // nombre del pasajero
  vuelo: 'v4',          // id del vuelo reservado
  pasajeros: 2,
  clase: 'Ejecutiva',
  total: 832000,        // se guarda el total del momento en que se reservó
  fecha: '23/11/26, 4:10 p. m.'
}
```

En el formulario el total es un dato derivado (se calcula), pero en la reserva sí se guarda: es un registro de lo que se reservó y debe mantenerse aunque mañana cambie el precio del vuelo.

**4. ¿Dónde debe vivir el estado de las reservas y por qué?**

En `App`. Lo necesitan dos partes distintas: el formulario (para **agregar** una reserva) y `MisReservas` (para **mostrarlas y eliminarlas**). El único ancestro común de ambos es `App`. Además, desde ahí se centraliza el guardado en `localStorage`.

## 2. Árbol de componentes futuro

```
App  (estado: origen, destino, orden, seleccionado, reservas)
├── <Header>              aerolinea, eslogan
├── <SelectorRuta>        origen, destino, ciudades, ciudadesDestino, onOrigen, onDestino
│   ├── <SelectCiudad>    label="Origen", value, ciudades, onCambio
│   └── <SelectCiudad>    label="Destino", value, ciudades, onCambio
├── <SelectorOrden>  🆕   orden, opciones, onCambio                        (F3)
├── <ListaVuelos>         vuelos (ordenados), nombreOrigen, nombreDestino,
│   │                     idSeleccionado 🆕, onSeleccionar 🆕
│   └── <TarjetaVuelo> ×N vuelo, seleccionada 🆕, onSeleccionar 🆕          (F1/F3)
├── <FormularioReserva> 🆕 vuelo, nombreOrigen, nombreDestino, clases,
│                         onReservar                                       (F1)
│                         (estado local: nombre, pasajeros, clase)
├── <MisReservas>  🆕     reservas, onEliminar                             (F2)
└── <Footer>              anio
```

**Flujo:** los datos bajan como props y los eventos suben con funciones.

```
TarjetaVuelo ──onSeleccionar(vuelo)──▶ App ──vuelo──▶ FormularioReserva
FormularioReserva ──onReservar(datos)──▶ App ──reservas──▶ MisReservas
MisReservas ──onEliminar(id)──▶ App
SelectorOrden ──onCambio(orden)──▶ App ──vuelos ordenados──▶ ListaVuelos
```
