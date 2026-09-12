/* =========================================================
   GÉNESIS FC · DATOS DEPORTIVOS

   IMPORTANTE:
   PARA ACTUALIZAR EL SITIO NORMALMENTE SOLO NECESITAS EDITAR:

   1. CONFIGURACIÓN DE TEMPORADA
   2. PARTIDOS
   3. TABLA DE POSICIONES

   Calendario + clasificación + Asistente Génesis
   leen automáticamente este archivo.
========================================================= */

/* =========================================================
   TIPOS
========================================================= */

export type Partido = {
  jornada: number;
  fecha: string;
  hora: string;
  local: string;
  visitante: string;
  logoLocal: string;
  logoVisitante: string;
  estadio: string;
  ciudad: string;
};

export type Equipo = {
  posicion: number;
  nombre: string;
  logo: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
};

/* =========================================================
   1. CONFIGURACIÓN DE TEMPORADA
   EDITAR AQUÍ CUANDO CAMBIE LA TEMPORADA O JORNADA
========================================================= */

export const configuracionFutbol = {
  temporada: "2026/27",

  competicion: "Liga Nacional",

  club: "Génesis FC",

  ciudadClub: "La Paz, Honduras",

  estadioLocal:
    "Estadio Roberto Suazo Córdova",

  jornadasPublicadas: {
    desde: 7,
    hasta: 16,
  },

  ultimaActualizacion:
    "11 SEP 2026",
};

/* =========================================================
   2. PARTIDOS
   EDITAR AQUÍ CUANDO SE CONFIRME:
   - FECHA
   - HORA
   - ESTADIO
   - CIUDAD

   Mantener los partidos en orden cronológico.
========================================================= */

export const partidos: Partido[] = [
  {
    jornada: 7,

    fecha: "12 SEP 2026",

    hora: "7:00 PM",

    local: "Motagua",

    visitante: "Génesis FC",

    logoLocal: "/motagua.png",

    logoVisitante: "/genesis.jpg",

    estadio:
      "Estadio Carlos Miranda",

    ciudad:
      "Comayagua, Honduras",
  },

  {
    jornada: 8,

    fecha: "19 SEP 2026",

    hora: "3:00 PM",

    local: "Génesis FC",

    visitante: "Olancho FC",

    logoLocal: "/genesis.jpg",

    logoVisitante: "/olancho.png",

    estadio:
      "Estadio Roberto Suazo Córdova",

    ciudad:
      "La Paz, Honduras",
  },

  {
    jornada: 9,

    fecha: "10 OCT 2026",

    hora: "3:00 PM",

    local: "Génesis FC",

    visitante: "Olimpia",

    logoLocal: "/genesis.jpg",

    logoVisitante: "/olimpia.png",

    estadio:
      "Estadio Roberto Suazo Córdova",

    ciudad:
      "La Paz, Honduras",
  },

  {
    jornada: 10,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "Génesis FC",

    visitante: "Estrella Roja",

    logoLocal: "/genesis.jpg",

    logoVisitante:
      "/estrella-roja.jpg",

    estadio:
      "Estadio Roberto Suazo Córdova",

    ciudad:
      "La Paz, Honduras",
  },

  {
    jornada: 11,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "UPN",

    visitante: "Génesis FC",

    logoLocal: "/upn.png",

    logoVisitante: "/genesis.jpg",

    estadio: "Por confirmar",

    ciudad: "Honduras",
  },

  {
    jornada: 12,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "CD Choloma",

    visitante: "Génesis FC",

    logoLocal: "/choloma.png",

    logoVisitante: "/genesis.jpg",

    estadio: "Por confirmar",

    ciudad: "Honduras",
  },

  {
    jornada: 13,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "Génesis FC",

    visitante: "Real España",

    logoLocal: "/genesis.jpg",

    logoVisitante:
      "/real-espana.jpg",

    estadio:
      "Estadio Roberto Suazo Córdova",

    ciudad:
      "La Paz, Honduras",
  },

  {
    jornada: 14,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "Platense",

    visitante: "Génesis FC",

    logoLocal: "/platense.jpg",

    logoVisitante: "/genesis.jpg",

    estadio: "Por confirmar",

    ciudad: "Honduras",
  },

  {
    jornada: 15,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "Génesis FC",

    visitante:
      "Atlético Independiente",

    logoLocal: "/genesis.jpg",

    logoVisitante:
      "/independiente.png",

    estadio:
      "Estadio Roberto Suazo Córdova",

    ciudad:
      "La Paz, Honduras",
  },

  {
    jornada: 16,

    fecha: "POR CONFIRMAR",

    hora: "POR CONFIRMAR",

    local: "Marathón",

    visitante: "Génesis FC",

    logoLocal: "/marathon.png",

    logoVisitante: "/genesis.jpg",

    estadio: "Por confirmar",

    ciudad: "Honduras",
  },
];

/* =========================================================
   3. TABLA DE POSICIONES
   EDITAR AQUÍ DESPUÉS DE CADA JORNADA

   Solo actualizar:
   - posicion
   - pj
   - g
   - e
   - p
   - gf
   - gc

   Los puntos y diferencia de goles se calculan
   automáticamente donde sean necesarios.
========================================================= */

export const equipos: Equipo[] = [
  {
    posicion: 1,
    nombre: "Olimpia",
    logo: "/olimpia.png",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 15,
    gc: 6,
  },

  {
    posicion: 2,
    nombre: "Marathón",
    logo: "/marathon.png",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 11,
    gc: 3,
  },

  {
    posicion: 3,
    nombre: "Real España",
    logo: "/real-espana.jpg",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 11,
    gc: 3,
  },

  {
    posicion: 4,
    nombre: "Génesis FC",
    logo: "/genesis.jpg",
    pj: 6,
    g: 3,
    e: 1,
    p: 2,
    gf: 10,
    gc: 5,
  },

  {
    posicion: 5,
    nombre: "Motagua",
    logo: "/motagua.png",
    pj: 6,
    g: 3,
    e: 1,
    p: 2,
    gf: 10,
    gc: 7,
  },

  {
    posicion: 6,
    nombre: "Olancho FC",
    logo: "/olancho.png",
    pj: 6,
    g: 2,
    e: 3,
    p: 1,
    gf: 5,
    gc: 4,
  },

  {
    posicion: 7,
    nombre: "Estrella Roja",
    logo: "/estrella-roja.jpg",
    pj: 6,
    g: 2,
    e: 2,
    p: 2,
    gf: 11,
    gc: 12,
  },

  {
    posicion: 8,
    nombre:
      "Atlético Independiente",
    logo: "/independiente.png",
    pj: 6,
    g: 1,
    e: 3,
    p: 2,
    gf: 5,
    gc: 6,
  },

  {
    posicion: 9,
    nombre: "CD Choloma",
    logo: "/choloma.png",
    pj: 6,
    g: 1,
    e: 1,
    p: 4,
    gf: 4,
    gc: 7,
  },

  {
    posicion: 10,
    nombre: "Platense",
    logo: "/platense.jpg",
    pj: 6,
    g: 1,
    e: 1,
    p: 4,
    gf: 4,
    gc: 14,
  },

  {
    posicion: 11,
    nombre: "Juticalpa",
    logo: "/juti.png",
    pj: 6,
    g: 1,
    e: 0,
    p: 5,
    gf: 4,
    gc: 15,
  },

  {
    posicion: 12,
    nombre: "UPN",
    logo: "/upn.png",
    pj: 6,
    g: 0,
    e: 2,
    p: 4,
    gf: 4,
    gc: 12,
  },
];

/* =========================================================
   FUNCIONES AUTOMÁTICAS
   NORMALMENTE NO NECESITAS EDITAR DESDE AQUÍ
========================================================= */

/* =========================================================
   PUNTOS
========================================================= */

export function calcularPuntos(
  equipo: Equipo
) {
  return equipo.g * 3 + equipo.e;
}

/* =========================================================
   DIFERENCIA DE GOLES
========================================================= */

export function calcularDiferenciaGoles(
  equipo: Equipo
) {
  return equipo.gf - equipo.gc;
}

/* =========================================================
   GÉNESIS FC EN LA TABLA
========================================================= */

export function obtenerGenesis() {
  return equipos.find(
    (equipo) =>
      equipo.nombre ===
      configuracionFutbol.club
  );
}

/* =========================================================
   EQUIPO POR NOMBRE
========================================================= */

export function obtenerEquipoPorNombre(
  nombre: string
) {
  const buscado = nombre
    .trim()
    .toLowerCase();

  return equipos.find((equipo) => {
    const nombreEquipo =
      equipo.nombre.toLowerCase();

    return (
      nombreEquipo.includes(buscado) ||
      buscado.includes(nombreEquipo)
    );
  });
}

/* =========================================================
   PARTIDO POR JORNADA
========================================================= */

export function obtenerPartidoPorJornada(
  jornada: number
) {
  return partidos.find(
    (partido) =>
      partido.jornada === jornada
  );
}

/* =========================================================
   PARTIDOS COMO LOCAL
========================================================= */

export function obtenerPartidosLocal() {
  return partidos.filter(
    (partido) =>
      partido.local ===
      configuracionFutbol.club
  );
}

/* =========================================================
   PARTIDOS COMO VISITANTE
========================================================= */

export function obtenerPartidosVisitante() {
  return partidos.filter(
    (partido) =>
      partido.visitante ===
      configuracionFutbol.club
  );
}

/* =========================================================
   PARTIDOS CONFIRMADOS
========================================================= */

export function obtenerPartidosConfirmados() {
  return partidos.filter(
    (partido) =>
      partido.fecha !==
        "POR CONFIRMAR" &&
      partido.hora !==
        "POR CONFIRMAR"
  );
}

/* =========================================================
   PARTIDOS PENDIENTES DE CONFIRMACIÓN
========================================================= */

export function obtenerPartidosPorConfirmar() {
  return partidos.filter(
    (partido) =>
      partido.fecha ===
        "POR CONFIRMAR" ||
      partido.hora ===
        "POR CONFIRMAR"
  );
}

/* =========================================================
   RESUMEN DEPORTIVO
========================================================= */

const genesis = obtenerGenesis();

export const resumenFutbol = {
  temporada:
    configuracionFutbol.temporada,

  competicion:
    configuracionFutbol.competicion,

  totalPartidosPublicados:
    partidos.length,

  partidosConfirmados:
    obtenerPartidosConfirmados().length,

  partidosPorConfirmar:
    obtenerPartidosPorConfirmar().length,

  posicionGenesis:
    genesis?.posicion ?? null,

  puntosGenesis:
    genesis
      ? calcularPuntos(genesis)
      : null,

  diferenciaGolesGenesis:
    genesis
      ? calcularDiferenciaGoles(
          genesis
        )
      : null,

  ultimaActualizacion:
    configuracionFutbol.ultimaActualizacion,
};