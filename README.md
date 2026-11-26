# ✈️ AeroCol — Reserva tu vuelo

Proyecto final del curso de Desarrollo Front-End (semana 15), construido con React + Vite sobre la app AeroCol de la semana 14.

## Proyecto Final

### ¿Qué hace la app?

AeroCol permite **buscar un vuelo** entre ciudades de Colombia, **elegirlo**, **reservarlo** (nombre, pasajeros y clase, con el total calculado al instante) y **ver tus reservas**, que se guardan en el navegador con `localStorage` y siguen ahí al recargar la página. La lista de vuelos se puede **ordenar** por precio, hora de salida o avión.

### Árbol de componentes

```
App  (estado: origen, destino, orden, seleccionado, reservas)
├── <Header>
├── <SelectorRuta>
│   ├── <SelectCiudad> (origen)
│   └── <SelectCiudad> (destino)
├── <SelectorOrden>       🆕 F3
├── <ListaVuelos>
│   └── <TarjetaVuelo> ×N   (ahora seleccionable)
├── <FormularioReserva>   🆕 F1  (solo si hay vuelo seleccionado)
├── <MisReservas>         🆕 F2
└── <Footer>
```

El análisis completo y el árbol con todas las props están en [`docs/fase-1-analisis.md`](docs/fase-1-analisis.md).

### Estructura

```
src/
├── App.jsx                 ← estado + lógica (el "cerebro")
├── App.css / index.css
├── data/vuelos.js          ← CIUDADES, VUELOS, CLASES, ORDENES
├── utils/formato.js        ← formatoPrecio (compartido)
└── components/
    ├── Header.jsx, Footer.jsx
    ├── SelectorRuta.jsx, SelectCiudad.jsx
    ├── SelectorOrden.jsx       🆕
    ├── ListaVuelos.jsx, TarjetaVuelo.jsx
    ├── FormularioReserva.jsx   🆕
    └── MisReservas.jsx         🆕
```

---

### 🟢 F1 — Formulario de reserva

**1. ¿Dónde viven los estados del formulario y por qué?**

`nombre`, `pasajeros` y `clase` viven **dentro de `FormularioReserva`**. Son datos que solo importan mientras el usuario llena el formulario y nadie más los necesita, así que no hay razón para subirlos a `App`. Solo cuando se presiona **Reservar**, el formulario entrega los datos finales a `App` con la función `onReservar`.

Además, en `App` el formulario se renderiza con `key={seleccionado.id}`. Si el usuario cambia de vuelo, React lo trata como un formulario nuevo y sus estados se reinician (no se "arrastra" el nombre o los pasajeros del vuelo anterior).

**2. ¿Por qué el total no es un `useState` más?**

Porque es un **dato derivado**: se puede calcular con lo que ya existe (`precio × pasajeros × factor`). Se calcula en cada render, así que siempre está sincronizado con los pasajeros y la clase. Si fuera un estado habría que acordarse de actualizarlo en cada cambio, y si se olvida en un solo lugar se desincroniza. Menos estado = menos bugs.

El cálculo usa `Math.round(...)` porque factores como `1.6` o `2.4` pueden dar decimales al multiplicar precios en pesos.

**3. ¿Qué prop le agregaste a `TarjetaVuelo` y para qué?**

- `onSeleccionar`: una **función** que viene de `App`. Al hacer clic en la tarjeta, la tarjeta la llama con su vuelo (`onSeleccionar(vuelo)`) para avisar que fue elegida. La tarjeta no guarda la selección; solo avisa. *Los datos suben, las funciones bajan.*
- `seleccionada`: un booleano para saber si debe pintarse resaltada (F3).

---

### 🟡 F2 — Mis reservas

**1. ¿Por qué no mutar el array directamente con `push`?**

React decide si redibuja comparando la **referencia** del estado. `push` modifica el mismo array, así que la referencia no cambia y React no se entera de que hay una reserva nueva. Por eso siempre se crea un array nuevo: `[...reservas, nueva]` para agregar y `reservas.filter((r) => r.id !== id)` para eliminar.

**2. ¿Qué le pasa a tus reservas si recargas la página sin `localStorage`?** 🙃

Se pierden. El estado de React vive en la memoria de la pestaña: al recargar, la app arranca de cero y `reservas` vuelve a ser `[]`. Con `localStorage` las reservas se guardan como texto en el navegador (`JSON.stringify`) y se leen al arrancar (`JSON.parse`), con una **función inicializadora**: `useState(cargarReservas)`, que solo se ejecuta al montar la app. Si el JSON guardado está dañado, el `try/catch` devuelve `[]` en vez de romper la app.

**3. ¿Dónde pones la lógica de guardar y por qué?**

En `App`, en una sola función: `actualizarReservas(nuevas)`, que hace `setReservas(nuevas)` y `guardarReservas(nuevas)` al mismo tiempo. Tanto `reservar` como `eliminarReserva` pasan por ella. Así el estado y `localStorage` nunca quedan distintos, y el guardado ocurre **solo cuando las reservas cambian** (al reservar o eliminar), no en cada render. `MisReservas` no sabe nada de `localStorage`: solo muestra lo que recibe y avisa con `onEliminar(id)`.

---

### 🔴 F3 — Catálogo inteligente

**1. ¿Por qué hay que ordenar una copia del array y no el original?**

Porque `.sort()` **modifica el array sobre el que se llama**. Si se ordenara `VUELOS` directamente, se alteraría el catálogo original (que es un dato compartido) y además se estaría mutando un dato en vez de calcular uno nuevo. Con `[...vuelos].sort(...)` se ordena una copia y el original queda intacto. La lista ordenada es un **dato derivado**: en el estado solo se guarda el criterio (`orden`) y la lista se calcula en cada render con `ordenarVuelos(...)`.

Comparadores usados: `a.precio - b.precio` (y al revés para mayor a menor) para números, y `localeCompare` para la hora y el avión (texto).

**2. ¿Qué pasó con el orden al cambiar de ruta? ¿Se mantiene?**

Sí, se mantiene. El estado `orden` vive en `App`, junto a `origen` y `destino`, y cambiar de ruta no lo toca: la nueva lista se calcula ya ordenada con el criterio elegido. Lo que **sí** se limpia al cambiar de ruta (o al intercambiar) es el vuelo seleccionado, para que el formulario no muestre un vuelo que ya no está en la lista.

**3. ¿Cómo le avisa la tarjeta a `App` que fue seleccionada?**

Llamando a la función `onSeleccionar(vuelo)` que recibió como prop. Esa función es `setSeleccionado` de `App`, y viaja así: `App → ListaVuelos → TarjetaVuelo`. Con el vuelo guardado en `seleccionado`, `App` hace dos cosas: muestra el `FormularioReserva` con ese vuelo y le indica a la lista cuál tarjeta resaltar (`idSeleccionado`), que se pinta con la clase CSS condicional `seleccionada`.

---

### ▶️ Cómo correr la app

```bash
npm install     # solo la primera vez
npm run dev     # abre la URL que muestra la terminal (http://localhost:5173)
```

Verificación:

```bash
npm run lint
npm run build
```

### 🧠 Decisión de diseño

**Agregar vuelos al catálogo para que el ordenamiento se pueda ver.** El catálogo de la semana 14 tiene 6 vuelos y cada uno es de una ruta distinta, así que cualquier búsqueda devuelve 0 o 1 vuelo: el "Ordenar por" funcionaría, pero no se vería ningún cambio. Se agregaron 7 vuelos (`v7`–`v13`) en rutas que ya existían (por ejemplo, Cartagena → Bogotá ahora tiene 3 opciones), **sin modificar `v1`–`v6`** y dejando Medellín → Bogotá con su único vuelo (`v4`), para no romper la búsqueda ni los ejemplos del enunciado.

La alternativa descartada fue ordenar el catálogo completo (los 13 vuelos sin filtrar por ruta). Se descartó porque rompía el flujo original de la app (buscar primero por origen y destino) y mezclaba rutas que el usuario no pidió. Agregar datos no cambia la lógica: si se borran `v7`–`v13`, la app sigue funcionando igual.

Otras decisiones menores:

- `formatoPrecio` se movió a `src/utils/formato.js` porque ahora la usan tres componentes y no tiene sentido copiarla.
- La tarjeta tiene un botón **Ver** además del clic en toda la tarjeta, para que también se pueda elegir con el teclado (Tab + Enter).
- En `index.css` se cambió `color-scheme: light dark` por `light`, porque el fondo es siempre claro y en un sistema en modo oscuro los inputs nuevos se verían oscuros.
