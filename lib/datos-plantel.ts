export type PosicionJugador =
  | "Portero"
  | "Defensa"
  | "Mediocampista"
  | "Delantero";

export type Jugador = {
  nombre: string;
  posicion: PosicionJugador;
  imagen: string;
  numero: string;
  enlace: string;
};

/* =========================================================
   PLANTEL OFICIAL
========================================================= */

export const jugadores: Jugador[] = [
  {
    nombre: "Balanta",
    posicion: "Portero",
    imagen: "/balanta-2.jpg",
    numero: "31",
    enlace: "/equipo/balanta",
  },
  {
    nombre: "Dayan Rodríguez",
    posicion: "Portero",
    imagen: "/dayan.jpg",
    numero: "01",
    enlace: "/equipo/dayan-rodriguez",
  },
  {
    nombre: "Juan Mosquera",
    posicion: "Defensa",
    imagen: "/mosquera2.jpg",
    numero: "03",
    enlace: "/equipo/juan-mosquera",
  },
  {
    nombre: "Gabriel Araujo",
    posicion: "Defensa",
    imagen: "/araujo.jpg",
    numero: "04",
    enlace: "/equipo/gabriel-araujo",
  },
  {
    nombre: "Manuel Gamboa",
    posicion: "Defensa",
    imagen: "/Gamboa.jpg",
    numero: "05",
    enlace: "/equipo/manuel-gamboa",
  },
  {
    nombre: "Cristopher Fonseca",
    posicion: "Defensa",
    imagen: "/polo.jpg",
    numero: "06",
    enlace: "/equipo/cristopher-fonseca",
  },
  {
    nombre: "Allans Vargas",
    posicion: "Defensa",
    imagen: "/Vargas.jpg",
    numero: "07",
    enlace: "/equipo/allans-vargas",
  },
  {
    nombre: "Kevin Perez",
    posicion: "Defensa",
    imagen: "/Perez.jpg",
    numero: "08",
    enlace: "/equipo/kevin-perez",
  },
  {
    nombre: "Sander",
    posicion: "Mediocampista",
    imagen: "/sander.jpg",
    numero: "09",
    enlace: "/equipo/sander",
  },
  {
    nombre: "Daniel Melendez",
    posicion: "Mediocampista",
    imagen: "/Melendez.jpg",
    numero: "10",
    enlace: "/equipo/daniel-melendez",
  },
  {
    nombre: "Edwin Maldonado",
    posicion: "Mediocampista",
    imagen: "/Maldonado.jpg",
    numero: "11",
    enlace: "/equipo/edwin-maldonado",
  },
  {
    nombre: "Walter Martinez",
    posicion: "Mediocampista",
    imagen: "/Colocho.jpg",
    numero: "12",
    enlace: "/equipo/walter-martinez",
  },
  {
    nombre: "Cesar Guillen",
    posicion: "Mediocampista",
    imagen: "/guillen.jpg",
    numero: "13",
    enlace: "/equipo/cesar-guillen",
  },
  {
    nombre: "Josman Figueroa",
    posicion: "Delantero",
    imagen: "/Figueroa.jpg",
    numero: "14",
    enlace: "/equipo/josman-figueroa",
  },
  {
    nombre: "Denilson Nuñez",
    posicion: "Delantero",
    imagen: "/Camavinga.jpg",
    numero: "15",
    enlace: "/equipo/denilson-nunez",
  },
  {
    nombre: "Bryan Felix",
    posicion: "Delantero",
    imagen: "/Felix.jpg",
    numero: "16",
    enlace: "/equipo/bryan-felix",
  },
  {
    nombre: "Carlos Arzu",
    posicion: "Delantero",
    imagen: "/Arzu.jpg",
    numero: "17",
    enlace: "/equipo/carlos-arzu",
  },
  {
    nombre: "Elias Alderete",
    posicion: "Delantero",
    imagen: "/Alderete.jpg",
    numero: "18",
    enlace: "/equipo/elias-alderete",
  },
  {
    nombre: "Angel Alvarado",
    posicion: "Delantero",
    imagen: "/Alvarado.jpg",
    numero: "19",
    enlace: "/equipo/angel-alvarado",
  },
];

/* =========================================================
   UTILIDADES DEL PLANTEL
========================================================= */

export function obtenerJugadoresPorPosicion(
  posicion: PosicionJugador
) {
  return jugadores.filter(
    (jugador) => jugador.posicion === posicion
  );
}

export function obtenerJugadorPorNombre(
  nombre: string
) {
  const buscado = nombre
    .trim()
    .toLowerCase();

  return jugadores.find(
    (jugador) =>
      jugador.nombre
        .toLowerCase()
        .includes(buscado) ||
      buscado.includes(
        jugador.nombre.toLowerCase()
      )
  );
}

/* =========================================================
   RESUMEN DEL PLANTEL
========================================================= */

export const resumenPlantel = {
  total: jugadores.length,

  porteros:
    obtenerJugadoresPorPosicion(
      "Portero"
    ).length,

  defensas:
    obtenerJugadoresPorPosicion(
      "Defensa"
    ).length,

  mediocampistas:
    obtenerJugadoresPorPosicion(
      "Mediocampista"
    ).length,

  delanteros:
    obtenerJugadoresPorPosicion(
      "Delantero"
    ).length,
};