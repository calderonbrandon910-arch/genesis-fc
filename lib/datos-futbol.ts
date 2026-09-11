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
   PARTIDOS
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
    estadio: "Estadio Carlos Miranda",
    ciudad: "Comayagua, Honduras",
  },
  {
    jornada: 8,
    fecha: "19 SEP 2026",
    hora: "3:00 PM",
    local: "Génesis FC",
    visitante: "Olancho FC",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/olancho.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 9,
    fecha: "10 OCT 2026",
    hora: "3:00 PM",
    local: "Génesis FC",
    visitante: "Olimpia",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/olimpia.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 10,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Génesis FC",
    visitante: "Estrella Roja",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/estrella-roja.jpg",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
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
    logoVisitante: "/real-espana.jpg",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
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
    visitante: "Atlético Independiente",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/independiente.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
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
   TABLA DE POSICIONES
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
    nombre: "Atlético Independiente",
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