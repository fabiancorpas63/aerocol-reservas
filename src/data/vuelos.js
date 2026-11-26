export const CIUDADES = [
  { codigo: 'CTG', nombre: 'Cartagena' },
  { codigo: 'BOG', nombre: 'Bogotá' },
  { codigo: 'MDE', nombre: 'Medellín' },
  { codigo: 'BAQ', nombre: 'Barranquilla' },
  { codigo: 'SMR', nombre: 'Santa Marta' },
  { codigo: 'CLO', nombre: 'Cali' },
]

export const VUELOS = [
  // Catálogo original de la semana 14 (no se modifica)
  { id: 'v1', origen: 'CTG', destino: 'BOG', avion: 'Airbus A320', hora: '08:30', precio: 380000 },
  { id: 'v2', origen: 'BOG', destino: 'CTG', avion: 'Boeing 737-800', hora: '10:40', precio: 380000 },
  { id: 'v3', origen: 'CTG', destino: 'MDE', avion: 'Airbus A320', hora: '07:15', precio: 320000 },
  { id: 'v4', origen: 'MDE', destino: 'BOG', avion: 'ATR 72', hora: '09:05', precio: 260000 },
  { id: 'v5', origen: 'BOG', destino: 'MDE', avion: 'Boeing 737-800', hora: '13:10', precio: 340000 },
  { id: 'v6', origen: 'MDE', destino: 'CTG', avion: 'Airbus A320', hora: '12:30', precio: 320000 },

  // F3: vuelos extra para que el ordenamiento se note (varias opciones en la misma ruta)
  { id: 'v7', origen: 'CTG', destino: 'BOG', avion: 'ATR 72', hora: '13:15', precio: 295000 },
  { id: 'v8', origen: 'CTG', destino: 'BOG', avion: 'Boeing 737-800', hora: '06:45', precio: 420000 },
  { id: 'v9', origen: 'BOG', destino: 'CTG', avion: 'Airbus A320', hora: '06:10', precio: 350000 },
  { id: 'v10', origen: 'CTG', destino: 'MDE', avion: 'ATR 72', hora: '16:40', precio: 280000 },
  { id: 'v11', origen: 'MDE', destino: 'CTG', avion: 'Boeing 737-800', hora: '06:55', precio: 365000 },
  { id: 'v12', origen: 'MDE', destino: 'CTG', avion: 'ATR 72', hora: '18:20', precio: 295000 },
  { id: 'v13', origen: 'BOG', destino: 'MDE', avion: 'Airbus A320', hora: '07:30', precio: 275000 },
]

// F1: clases de vuelo con su factor de precio
export const CLASES = [
  { id: 'economica', nombre: 'Económica', factor: 1 },
  { id: 'ejecutiva', nombre: 'Ejecutiva', factor: 1.6 },
  { id: 'primera', nombre: 'Primera', factor: 2.4 },
]

// F3: opciones del control "Ordenar por"
export const ORDENES = [
  { id: 'precio-asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio-desc', nombre: 'Precio: mayor a menor' },
  { id: 'hora', nombre: 'Hora de salida' },
  { id: 'avion', nombre: 'Avión (A–Z)' },
]
