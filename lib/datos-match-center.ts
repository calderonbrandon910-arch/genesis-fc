/* =========================================================
   MATCH CENTER — GÉNESIS FC

   CONTROL CENTRAL
   MOTAGUA vs GÉNESIS FC

   ESTADO OFICIAL LIMPIO
   SIN DATOS FICTICIOS
========================================================= */

/* =========================================================
   TIPOS
========================================================= */

export type EstadoPartido =
  | "previa"
  | "en-vivo"
  | "descanso"
  | "final";

export type TipoEvento =
  | "gol"
  | "amarilla"
  | "roja"
  | "cambio"
  | "inicio"
  | "descanso"
  | "final";

export type EquipoEvento =
  | "Motagua"
  | "Génesis FC"
  | "partido";

export type PosicionJugador =
  | "Portero"
  | "Defensa"
  | "Mediocampista"
  | "Delantero"
  | "Sin confirmar";

export type JugadorMatchCenter = {
  nombre: string;
  dorsal: number;
  posicion: PosicionJugador;
};

export type EventoPartido = {
  id: string;
  minuto: number;
  agregado?: number;
  tipo: TipoEvento;
  equipo: EquipoEvento;
  jugador?: string;
  jugadorSale?: string;
  jugadorEntra?: string;
  descripcion: string;
};

export type EstadisticasPartido = {
  posesion: {
    motagua: number | null;
    genesis: number | null;
  };

  tiros: {
    motagua: number | null;
    genesis: number | null;
  };

  tirosAlArco: {
    motagua: number | null;
    genesis: number | null;
  };

  corners: {
    motagua: number | null;
    genesis: number | null;
  };

  faltas: {
    motagua: number | null;
    genesis: number | null;
  };

  amarillas: {
    motagua: number | null;
    genesis: number | null;
  };

  rojas: {
    motagua: number | null;
    genesis: number | null;
  };
};

/* =========================================================
   INFORMACIÓN DEL PARTIDO
========================================================= */

export const partidoMatchCenter = {
  id: "motagua-vs-genesis-j7-2026",

  competicion: "Liga Nacional",

  jornada: 7,

  fecha: "12 SEP 2026",

  fechaCorta:
    "Sábado · 12 Sep 2026",

  hora: "7:30 PM",

  fechaISO:
    "2026-09-12T19:30:00-06:00",

  estadio:
    "Estadio Carlos Miranda",

  ciudad: "Comayagua",

  pais: "Honduras",

  local: {
    nombre: "Motagua",
    nombreCorto: "Motagua",
    logo: "/motagua.png",
  },

  visitante: {
    nombre: "Génesis FC",
    nombreCorto: "Génesis",
    logo: "/genesis.jpg",
  },
} as const;

/* =========================================================
   ESTADO DEL PARTIDO

   CAMBIAR ÚNICAMENTE CUANDO HAYA INFORMACIÓN OFICIAL.
========================================================= */

export const estadoMatchCenter: {
  estado: EstadoPartido;
  minuto: number | null;
  agregado: number | null;
  golesLocal: number | null;
  golesVisitante: number | null;
  ultimaActualizacion:
    string | null;
} = {
  estado: "previa",

  minuto: null,

  agregado: null,

  golesLocal: null,

  golesVisitante: null,

  ultimaActualizacion: null,
};

/* =========================================================
   PLANTEL — MOTAGUA
========================================================= */

export const plantelMotagua:
  JugadorMatchCenter[] = [
  {
    nombre: "John Turcios",
    dorsal: 1,
    posicion: "Portero",
  },

  {
    nombre: "Pablo Cacho",
    dorsal: 3,
    posicion: "Defensa",
  },

  {
    nombre: "Luis Vega",
    dorsal: 4,
    posicion: "Mediocampista",
  },

  {
    nombre: "Óscar Padilla",
    dorsal: 5,
    posicion: "Mediocampista",
  },

  {
    nombre: "Riky Zapata",
    dorsal: 6,
    posicion: "Mediocampista",
  },

  {
    nombre: "Jorge Serrano",
    dorsal: 7,
    posicion: "Mediocampista",
  },

  {
    nombre: "Denis Meléndez",
    dorsal: 8,
    posicion: "Mediocampista",
  },

  {
    nombre: "Jonathan Moya",
    dorsal: 9,
    posicion: "Delantero",
  },

  {
    nombre: "Rodrigo Gómez",
    dorsal: 10,
    posicion: "Mediocampista",
  },

  {
    nombre: "Aarón Barrios",
    dorsal: 14,
    posicion: "Delantero",
  },

  {
    nombre: "Andy Hernández",
    dorsal: 15,
    posicion: "Mediocampista",
  },

  {
    nombre: "Carlos Palma",
    dorsal: 16,
    posicion: "Mediocampista",
  },

  {
    nombre: "Clever Portillo",
    dorsal: 17,
    posicion: "Defensa",
  },

  {
    nombre: "Rodrigo De Olivera",
    dorsal: 19,
    posicion: "Delantero",
  },

  {
    nombre: "Jesús Bátiz",
    dorsal: 21,
    posicion: "Delantero",
  },

  {
    nombre: "Luis Ortiz",
    dorsal: 22,
    posicion: "Portero",
  },

  {
    nombre: "Alejandro Reyes",
    dorsal: 23,
    posicion: "Mediocampista",
  },

  {
    nombre: "Jordan García",
    dorsal: 24,
    posicion: "Mediocampista",
  },

  {
    nombre: "Marlon Licona",
    dorsal: 25,
    posicion: "Portero",
  },

  {
    nombre:
      "Luis Santamaría Crisanto",
    dorsal: 26,
    posicion: "Mediocampista",
  },

  {
    nombre: "Jefryn Macías",
    dorsal: 27,
    posicion: "Mediocampista",
  },

  {
    nombre: "Adner Ávila",
    dorsal: 28,
    posicion: "Defensa",
  },

  {
    nombre: "Jeffry Miranda",
    dorsal: 30,
    posicion: "Mediocampista",
  },

  {
    nombre: "Emilio Izaguirre",
    dorsal: 33,
    posicion: "Mediocampista",
  },

  {
    nombre: "Giancarlo Sacaza",
    dorsal: 34,
    posicion: "Defensa",
  },

  {
    nombre:
      "Cristopher Meléndez",
    dorsal: 35,
    posicion: "Defensa",
  },

  {
    nombre:
      "Valerio Marinacci",
    dorsal: 36,
    posicion: "Defensa",
  },

  {
    nombre:
      "Jonathan Argueta",
    dorsal: 42,
    posicion: "Mediocampista",
  },

  {
    nombre: "Darell Oliva",
    dorsal: 80,
    posicion: "Mediocampista",
  },
];

/* =========================================================
   PLANTEL — GÉNESIS FC
========================================================= */

export const plantelGenesis:
  JugadorMatchCenter[] = [
  {
    nombre: "Dayan Rodríguez",
    dorsal: 1,
    posicion: "Portero",
  },

  {
    nombre: "Allans Vargas",
    dorsal: 2,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Albert Galindo",
    dorsal: 3,
    posicion: "Defensa",
  },

  {
    nombre: "Roger Sander",
    dorsal: 6,
    posicion: "Defensa",
  },

  {
    nombre: "Joshua Nieto",
    dorsal: 8,
    posicion: "Mediocampista",
  },

  {
    nombre: "Elías Alderete",
    dorsal: 9,
    posicion: "Delantero",
  },

  {
    nombre: "Walter Martínez",
    dorsal: 10,
    posicion: "Mediocampista",
  },

  {
    nombre: "Bryan Félix",
    dorsal: 11,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Gabriel Araujo",
    dorsal: 12,
    posicion: "Mediocampista",
  },

  {
    nombre: "Juan Mosquera",
    dorsal: 13,
    posicion: "Sin confirmar",
  },

  {
    nombre: "César Guillén",
    dorsal: 14,
    posicion: "Delantero",
  },

  {
    nombre: "Edwin Maldonado",
    dorsal: 15,
    posicion: "Mediocampista",
  },

  {
    nombre: "Fernando Sabillón",
    dorsal: 16,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Denilson Núñez",
    dorsal: 17,
    posicion: "Delantero",
  },

  {
    nombre: "Junior Lacayo",
    dorsal: 18,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Marco Solano",
    dorsal: 20,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Brayan Domínguez",
    dorsal: 21,
    posicion: "Sin confirmar",
  },

  {
    nombre:
      "Cristopher Fonseca",
    dorsal: 24,
    posicion: "Defensa",
  },

  {
    nombre: "Carlos Arzú",
    dorsal: 26,
    posicion: "Delantero",
  },

  {
    nombre: "Josman Figueroa",
    dorsal: 27,
    posicion: "Mediocampista",
  },

  {
    nombre: "Ángel Alvarado",
    dorsal: 29,
    posicion: "Delantero",
  },

  {
    nombre: "Ronaldo Balanta",
    dorsal: 31,
    posicion: "Portero",
  },

  {
    nombre: "Daniel Meléndez",
    dorsal: 33,
    posicion: "Sin confirmar",
  },

  {
    nombre: "Manuel Gamboa",
    dorsal: 44,
    posicion: "Defensa",
  },

  {
    nombre: "Kevin Pérez",
    dorsal: 66,
    posicion: "Sin confirmar",
  },
];

/* =========================================================
   XI OFICIAL

   SE MANTIENE VACÍO HASTA CONFIRMACIÓN OFICIAL.
========================================================= */

export const alineacionMotagua:
  JugadorMatchCenter[] = [];

export const alineacionGenesis:
  JugadorMatchCenter[] = [];

/* =========================================================
   SUPLENTES OFICIALES
========================================================= */

export const suplentesMotagua:
  JugadorMatchCenter[] = [];

export const suplentesGenesis:
  JugadorMatchCenter[] = [];

/* =========================================================
   CUERPO TÉCNICO
========================================================= */

export const cuerpoTecnico = {
  motagua: {
    entrenador:
      null as string | null,
  },

  genesis: {
    entrenador:
      null as string | null,
  },
};

/* =========================================================
   EVENTOS DEL PARTIDO

   SOLO EVENTOS OFICIALES.
========================================================= */

export const eventosPartido:
  EventoPartido[] = [];

/* =========================================================
   ESTADÍSTICAS

   null = todavía no hay dato oficial.
========================================================= */

export const estadisticasPartido:
  EstadisticasPartido = {
  posesion: {
    motagua: null,
    genesis: null,
  },

  tiros: {
    motagua: null,
    genesis: null,
  },

  tirosAlArco: {
    motagua: null,
    genesis: null,
  },

  corners: {
    motagua: null,
    genesis: null,
  },

  faltas: {
    motagua: null,
    genesis: null,
  },

  amarillas: {
    motagua: null,
    genesis: null,
  },

  rojas: {
    motagua: null,
    genesis: null,
  },
};

/* =========================================================
   HELPERS
========================================================= */

export function obtenerMarcador() {
  return {
    local:
      estadoMatchCenter.golesLocal,

    visitante:
      estadoMatchCenter.golesVisitante,
  };
}

export function partidoEstaEnVivo() {
  return (
    estadoMatchCenter.estado ===
      "en-vivo" ||
    estadoMatchCenter.estado ===
      "descanso"
  );
}

export function partidoFinalizo() {
  return (
    estadoMatchCenter.estado ===
    "final"
  );
}

export function hayEventosPartido() {
  return (
    eventosPartido.length > 0
  );
}

export function hayAlineaciones() {
  return (
    alineacionMotagua.length >
      0 ||
    alineacionGenesis.length >
      0
  );
}

export function alineacionesCompletas() {
  return (
    alineacionMotagua.length ===
      11 &&
    alineacionGenesis.length ===
      11
  );
}

export function hayPlanteles() {
  return (
    plantelMotagua.length > 0 &&
    plantelGenesis.length > 0
  );
}

export function hayEstadisticas() {
  return Object.values(
    estadisticasPartido
  ).some(
    (estadistica) =>
      estadistica.motagua !==
        null ||
      estadistica.genesis !==
        null
  );
}

export function obtenerEtiquetaPartido() {
  if (
    estadoMatchCenter.estado ===
    "en-vivo"
  ) {
    return "EN VIVO";
  }

  if (
    estadoMatchCenter.estado ===
    "descanso"
  ) {
    return "DESCANSO";
  }

  if (
    estadoMatchCenter.estado ===
    "final"
  ) {
    return "FINAL";
  }

  return "PREVIA";
}

export function obtenerMinutoPartido() {
  if (
    estadoMatchCenter.minuto ===
    null
  ) {
    return null;
  }

  if (
    estadoMatchCenter.agregado
  ) {
    return `${estadoMatchCenter.minuto}+${estadoMatchCenter.agregado}'`;
  }

  return `${estadoMatchCenter.minuto}'`;
}

export const resumenMatchCenter = {
  partido:
    partidoMatchCenter.id,

  estado:
    estadoMatchCenter.estado,

  jugadoresMotagua:
    plantelMotagua.length,

  jugadoresGenesis:
    plantelGenesis.length,

  alineacionMotagua:
    alineacionMotagua.length,

  alineacionGenesis:
    alineacionGenesis.length,

  eventos:
    eventosPartido.length,

  tieneEstadisticas:
    hayEstadisticas(),
};