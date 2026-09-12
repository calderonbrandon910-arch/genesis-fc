export type CategoriaNoticia =
  | "Primer equipo";

export type Noticia = {
  titulo: string;
  descripcion: string;
  resumen: string;
  fecha: string;
  fechaISO: string;
  categoria: CategoriaNoticia;
  imagen: string;
  enlace: string;
  temas: string[];
};

/* =========================================================
   NOTICIAS OFICIALES
========================================================= */

export const noticias: Noticia[] = [
  {
    titulo:
      "Partido intenso el fin de semana",

    descripcion:
      "Génesis FC se prepara para enfrentar a Motagua este 12 de septiembre de 2026 en el Estadio Carlos Miranda de Comayagua.",

    resumen:
      "Génesis FC visita a Motagua en un duelo que promete intensidad, historia y mucho en juego. Los Caninos llegan después de vencer como visitantes a Juticalpa y se preparan para un nuevo compromiso de Liga Nacional.",

    fecha:
      "09 SEP 2026",

    fechaISO:
      "2026-09-09T00:00:00-06:00",

    categoria:
      "Primer equipo",

    imagen:
      "/motagua-genesis-portada-3.jpg",

    enlace:
      "/noticias/genesis-prepara-proximo-desafio",

    temas: [
      "Motagua",
      "Génesis FC",
      "Liga Nacional",
      "Jornada 7",
      "Comayagua",
      "próximo partido",
    ],
  },

  {
    titulo:
      "El equipo continúa trabajando de cara al próximo compromiso",

    descripcion:
      "Génesis FC continúa su preparación para enfrentar a Motagua por la Jornada 7 de la Liga Nacional en el Estadio Carlos Miranda de Comayagua.",

    resumen:
      "El primer equipo continúa trabajando de cara al partido ante Motagua. Génesis llega después de la victoria 0-3 como visitante frente a Juticalpa y busca mantener su buen momento en la Liga Nacional.",

    fecha:
      "08 SEP 2026",

    fechaISO:
      "2026-09-08T00:00:00-06:00",

    categoria:
      "Primer equipo",

    imagen:
      "/noticia-2.jpg",

    enlace:
      "/noticias/el-equipo-continua-trabajando",

    temas: [
      "entrenamiento",
      "Motagua",
      "Génesis FC",
      "Liga Nacional",
      "Jornada 7",
      "Juticalpa",
      "Comayagua",
    ],
  },
];

/* =========================================================
   NOTICIAS ORDENADAS
========================================================= */

export const noticiasOrdenadas = [
  ...noticias,
].sort(
  (a, b) =>
    new Date(b.fechaISO).getTime() -
    new Date(a.fechaISO).getTime()
);

/* =========================================================
   ÚLTIMA NOTICIA
========================================================= */

export const ultimaNoticia =
  noticiasOrdenadas[0] ?? null;

/* =========================================================
   BUSCAR NOTICIA
========================================================= */

export function obtenerNoticiaPorTitulo(
  titulo: string
) {
  const buscado = titulo
    .trim()
    .toLowerCase();

  return noticias.find(
    (noticia) =>
      noticia.titulo
        .toLowerCase()
        .includes(buscado) ||
      buscado.includes(
        noticia.titulo.toLowerCase()
      )
  );
}

/* =========================================================
   BUSCAR NOTICIAS POR TEMA
========================================================= */

export function obtenerNoticiasPorTema(
  tema: string
) {
  const buscado = tema
    .trim()
    .toLowerCase();

  return noticias.filter((noticia) => {
    const coincideTitulo =
      noticia.titulo
        .toLowerCase()
        .includes(buscado);

    const coincideDescripcion =
      noticia.descripcion
        .toLowerCase()
        .includes(buscado);

    const coincideResumen =
      noticia.resumen
        .toLowerCase()
        .includes(buscado);

    const coincideTema =
      noticia.temas.some((item) =>
        item
          .toLowerCase()
          .includes(buscado)
      );

    return (
      coincideTitulo ||
      coincideDescripcion ||
      coincideResumen ||
      coincideTema
    );
  });
}

/* =========================================================
   RESUMEN DE NOTICIAS
========================================================= */

export const resumenNoticias = {
  total: noticias.length,

  ultimaPublicacion:
    ultimaNoticia?.fecha ?? null,

  ultimaNoticia:
    ultimaNoticia?.titulo ?? null,
};