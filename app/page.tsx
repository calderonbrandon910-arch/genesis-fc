export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

     {/* MENU */}
<header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#06152c]/90 backdrop-blur-xl">
  <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">

    {/* LOGO */}
    <div className="flex items-center gap-4">
      <img
        src="/escudo-genesis.png"
        alt="Escudo Génesis FC"
        className="h-16 w-16 object-contain"
      />

      <div className="block">
        <h1 className="text-xl font-black tracking-tight">
          GÉNESIS FC
        </h1>

        <p className="text-[10px] font-bold tracking-[0.35em] text-cyan-300/70">
          SITIO OFICIAL
        </p>
      </div>
    </div>

    {/* NAVEGACIÓN */}
    <nav className="hidden items-center gap-7 text-[13px] font-bold tracking-wide lg:flex">
      <a className="transition hover:text-cyan-300" href="#">
        INICIO
      </a>

      <a className="transition hover:text-cyan-300" href="#partidos">
        PARTIDOS
      </a>

      <a className="transition hover:text-cyan-300" href="#equipo">
        EQUIPO
      </a>

      <a className="transition hover:text-cyan-300" href="#noticias">
        NOTICIAS
      </a>

      <a className="transition hover:text-cyan-300" href="#club">
        CLUB
      </a>

      <a className="transition hover:text-cyan-300" href="#tienda">
        TIENDA
      </a>
    </nav>

    {/* ACCIONES */}
    <div className="flex items-center gap-3">

      <button className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10 md:block">
        🔍
      </button>

      <button className="rounded-full bg-white px-6 py-3 text-sm font-black text-[#06152c] transition hover:scale-105">
        BOLETOS
      </button>

    </div>

  </div>
</header>
     {/* PORTADA */}
<section className="relative flex min-h-screen items-end overflow-hidden bg-[#06152c]">
{/* FOTO PRINCIPAL */}
<img
  src="/equipo-genesis.jpg"
  alt="Jugadores de Génesis FC"
  className="absolute inset-0 h-full w-full object-cover object-center"
/>

{/* CAPA OSCURA SOBRE LA FOTO */}
<div className="absolute inset-0 bg-gradient-to-r from-[#031126]/95 via-[#06152c]/70 to-[#06152c]/20" />

{/* DEGRADADO INFERIOR */}
<div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-black/30" />
 {/*
<img
  src="/equipo-genesis.jpg"
  alt="Jugadores de Génesis FC"
  className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
/>

{/* CAPA OSCURA */}
<div className="absolute inset-0 bg-gradient-to-r from-[#031126]/98 via-[#06152c]/72 to-[#06152c]/10" />

{/* DEGRADADO INFERIOR */}
<div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-black/30" />

{/* EFECTOS DE LUZ */}
<div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

<div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-blue-900/30 blur-3xl" />
  src="/equipo-genesis.jpg¨
  

  {/* CONTENIDO PRINCIPAL */}
  <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40">

    <div className="max-w-4xl">

      <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">

        <span className="h-2 w-2 rounded-full bg-cyan-400" />

        <p className="text-xs whitespace-nowrap font-bold tracking-[0.25em] text-gray-300">
          SITIO OFICIAL · GÉNESIS FC
        </p>

      </div>

      <h2 className="text-5xl sm:text-6xl font-black leading-[0.88] tracking-[-0.05em] md:text-8xl lg:text-[110px]">

        SOMOS

        <span className="block bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          GÉNESIS.
        </span>

      </h2>

      <p className="mt-8 max-w-2xl text-base sm:text-lg leading-8 text-gray-300 md:text-xl">
        Orgullo de La Paz. Pasión, identidad y fútbol hondureño.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">

        <a href="#club" className="rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105">
          CONOCE AL CLUB →
        </a>

        <a href="#noticias" className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold backdrop-blur-md transition hover:bg-white/10">
          ÚLTIMAS NOTICIAS
        </a>

      </div>

    </div>

    {/* INFORMACIÓN INFERIOR */}
    <div className="mt-20 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-1 grid-cols-1 md:grid-cols-3">

      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-gray-500">
          SEDE
        </p>

        <p className="mt-2 font-bold">
          La Paz, Honduras
        </p>
      </div>

      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-gray-500">
          COMPETICIÓN
        </p>

        <p className="mt-2 font-bold">
          Liga Nacional
        </p>
      </div>

      <div className="hidden md:block">
        <p className="text-xs font-bold tracking-[0.2em] text-gray-500">
          CLUB
        </p>

        <p className="mt-2 font-bold">
          Génesis FC
        </p>
      </div>

    </div>

  </div>

</section>
  {/* PROXIMO PARTIDO */}
<section id="partidos" className="bg-[#f4f7fb] px-6 py-24 text-[#06152c]">
  <div className="mx-auto max-w-7xl">

    {/* ENCABEZADO */}
    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

      <div>
        <p className="text-sm font-black tracking-[0.3em] text-cyan-600">
          PRIMER EQUIPO
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          PRÓXIMO PARTIDO
        </h2>
      </div>

      <a
        href="#"
        className="text-sm font-black tracking-wide transition hover:text-cyan-600"
      >
        VER CALENDARIO →
      </a>

    </div>

    {/* TARJETA DEL PARTIDO */}
    <div className="overflow-hidden rounded-[32px] bg-[#06152c] text-white shadow-2xl">

      {/* COMPETICIÓN */}
      <div className="border-b border-white/10 px-8 py-5 text-center">
        <p className="text-xs font-black tracking-[0.25em] text-cyan-300">
          LIGA NACIONAL DE HONDURAS
        </p>
      </div>

      <div className="relative px-6 py-14 md:px-16">

        {/* EFECTOS */}
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10">

          {/* FECHA */}
          <div className="mb-12 text-center">
            <p className="text-sm font-bold text-white/50">
              SÁBADO 12 DE SEPTIEMBRE · 2026
            </p>

            <p className="mt-2 text-lg font-black">
             ESTADIO NACIONAL CHELATO UCLÉS
            </p>

            <p className="mt-1 text-sm text-white/50">
              Tegucigalpa, Honduras
            </p>
          </div>

          {/* EQUIPOS */}
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">

           {/* MOTAGUA */}
<div className="text-center">

  <img
    src="/escudo-motagua.png"
    alt="Motagua"
    className="mx-auto h-32 w-32 object-contain md:h-40 md:w-40"
  />

  <h3 className="mt-5 text-2xl font-black md:text-3xl">
    MOTAGUA
  </h3>

  <p className="mt-2 text-xs font-bold tracking-[0.2em] text-cyan-300">
    LOCAL
  </p>

</div>

{/* VS */}
<div className="text-center">

  <p className="text-xs font-black tracking-[0.3em] text-white/40">
    JORNADA 7
  </p>

  <p className="my-3 text-5xl font-black">
    VS
  </p>

  <p className="text-sm font-bold text-white/50">
    7:30 PM
  </p>

</div>

{/* GENESIS */}
<div className="text-center">

  <img
    src="/escudo-genesis.png"
    alt="Génesis FC"
    className="mx-auto h-32 w-32 object-contain md:h-40 md:w-40"
  />

  <h3 className="mt-5 text-2xl font-black md:text-3xl">
    GÉNESIS FC
  </h3>

  <p className="mt-2 text-xs font-bold tracking-[0.2em] text-cyan-300">
    VISITANTE
  </p>

</div>

          </div>

          {/* BOTONES */}
          <div className="mt-14 flex flex-wrap justify-center gap-4">

            <button className="rounded-full bg-white px-8 py-4 font-black text-[#06152c] transition hover:scale-105">
              COMPRAR BOLETOS →
            </button>

            <button className="rounded-full border border-white/20 px-8 py-4 font-black transition hover:bg-white/10">
              PREVIA DEL PARTIDO
            </button>

          </div>

        </div>
      </div>
    </div>

  </div>
</section>
    {/* NOTICIAS */}
<section id="noticias" className="bg-white px-6 py-24 text-[#06152c]">

  <div className="mx-auto max-w-7xl">

    {/* ENCABEZADO */}
    <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">

      <div>
        <p className="text-sm font-black tracking-[0.3em] text-cyan-600">
          ACTUALIDAD
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          ÚLTIMAS NOTICIAS
        </h2>
      </div>

      <a
        href="#"
        className="text-sm font-black tracking-wide transition hover:text-cyan-600"
      >
        VER TODAS LAS NOTICIAS →
      </a>

    </div>

    {/* NOTICIA PRINCIPAL */}
    <article className="group relative mb-6 min-h-[520px] overflow-hidden rounded-[32px]">

      <img
       src="/noticia-2.jpg"

        alt="Últimas noticias de Génesis FC"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/35 to-transparent" />

      <div className="absolute bottom-0 left-0 z-10 max-w-3xl p-8 text-white md:p-12">

        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-black tracking-wider text-[#06152c]">
            PRIMER EQUIPO
          </span>

          <span className="text-sm font-bold text-white/60">
            08 SEP 2026
          </span>
        </div>

        <h3 className="text-3xl font-black leading-tight md:text-5xl">
          Génesis FC prepara su próximo desafío en la Liga Nacional
        </h3>

        <p className="mt-5 font-bold">
          LEER NOTICIA →
        </p>

      </div>

    </article>

    {/* NOTICIAS SECUNDARIAS */}
    <div className="grid gap-6 md:grid-cols-2">

      <article className="group overflow-hidden rounded-[28px] bg-[#f4f7fb]">

        <div className="h-72 overflow-hidden">
          <img
 src="/chito.jpg"
  alt="Noticias del primer equipo"
  className="h-full w-full object-cover object-[center_25%] transition duration-700 group-hover:scale-105"
/>
</div>
        <div className="p-8">

          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.2em] text-cyan-600">
              PRIMER EQUIPO
            </span>

            <span className="text-xs font-bold text-gray-400">
              08 SEP 2026
            </span>
          </div>

          <h3 className="text-2xl font-black leading-tight md:text-3xl">
            El equipo continúa trabajando de cara a su próximo compromiso
          </h3>

          <p className="mt-6 text-sm font-black">
            LEER MÁS →
          </p>

        </div>

      </article>


      <article className="group overflow-hidden rounded-[28px] bg-[#f4f7fb]">

        <div className="h-72 overflow-hidden">
          <img
           src="/kirikocho.jpg"
            alt="Actualidad de Génesis FC"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="p-8">

          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.2em] text-cyan-600">
              CLUB
            </span>

            <span className="text-xs font-bold text-gray-400">
              08 SEP 2026
            </span>
          </div>

          <h3 className="text-2xl font-black leading-tight md:text-3xl">
            Toda la actualidad y novedades de Génesis FC
          </h3>

          <p className="mt-6 text-sm font-black">
            LEER MÁS →
          </p>

        </div>

      </article>

    </div>

  </div>

</section>
{/* EQUIPO */}
<section id="equipo" className="bg-[#06152c] px-6 py-24 text-white">
  <div className="mx-auto max-w-7xl">

    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-black tracking-[0.3em] text-cyan-300">
          PRIMER EQUIPO
        </p>

        <h2 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">
          NUESTRA PLANTILLA
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-white/60">
          Conoce a los jugadores que defienden los colores de Génesis FC.
        </p>
      </div>

      <a
        href="#"
        className="text-sm font-black tracking-wide text-cyan-300 transition hover:text-white"
      >
        VER PLANTILLA COMPLETA →
      </a>
    </div>

    {/* JUGADORES */}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

     
   
     <div className="group relative h-[480px] overflow-hidden rounded-[28px] bg-[#0b2344]">
    <img
 src="/labestia.jpg"
  alt="Balanta"
  className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

<div className="absolute bottom-0 left-0 z-10 p-7">
  <p className="text-sm font-black tracking-[0.25em] text-cyan-300">
    PORTERO
  </p>
  <h3 className="mt-2 text-3xl font-black">
    BALANTA
  </h3>
</div>

</div>

      <div className="group relative h-[480px] overflow-hidden rounded-[28px] bg-[#0b2344]">
  <img
    src="/vargas.jpg"
    alt="Vargas"
    className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

  <div className="absolute bottom-0 left-0 z-10 p-7">
    <p className="text-sm font-black tracking-[0.25em] text-cyan-300">
      DEFENSA
    </p>

    <h3 className="mt-2 text-3xl font-black">
      VARGAS
    </h3>
  </div>
</div>

      <div className="group relative h-[480px] overflow-hidden rounded-[28px] bg-[#0b2344]">
        <div className="absolute bottom-0 left-0 z-10 p-7">
          <p className="text-sm font-black tracking-[0.25em] text-cyan-300">
            MEDIOCAMPISTA
          </p>
          <h3 className="mt-2 text-3xl font-black">
            JUGADOR 03
          </h3>
        </div>
      </div>

      <div className="group relative h-[480px] overflow-hidden rounded-[28px] bg-[#0b2344]">
        <div className="absolute bottom-0 left-0 z-10 p-7">
          <p className="text-sm font-black tracking-[0.25em] text-cyan-300">
            DELANTERO
          </p>
          <h3 className="mt-2 text-3xl font-black">
            JUGADOR 04
          </h3>
        </div>
      </div>

    </div>
  </div>
</section>
{/* EL CLUB */}
<section id="club" className="bg-[#f4f7fb] px-6 py-24 text-[#06152c]">
  <div className="mx-auto max-w-7xl">

    <div className="grid items-center gap-14 lg:grid-cols-2">

      {/* TEXTO */}
      <div>
        <p className="text-sm font-black tracking-[0.3em] text-cyan-600">
          NUESTRA IDENTIDAD
        </p>

        <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          MÁS QUE
          <br />
          FÚTBOL.
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
          Génesis FC representa pasión, identidad y orgullo. Un club que
          compite llevando consigo el nombre de La Paz y el sentimiento de
          toda una afición.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="rounded-full bg-[#06152c] px-7 py-4 text-sm font-black text-white transition hover:scale-105"
          >
            CONOCE NUESTRA HISTORIA →
          </a>

          <a
            href="#"
            className="rounded-full border border-[#06152c]/20 px-7 py-4 text-sm font-black transition hover:bg-[#06152c] hover:text-white"
          >
            SOBRE EL CLUB
          </a>
        </div>
      </div>

      {/* TARJETA DEL CLUB */}
      <div className="relative min-h-[520px] overflow-hidden rounded-[32px] bg-[#06152c] p-10 text-white">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-between">

          <img
            src="/escudo-genesis.png"
            alt="Escudo Génesis FC"
            className="h-36 w-36 object-contain"
          />

          <div>
            <p className="text-sm font-black tracking-[0.3em] text-cyan-300">
              GÉNESIS FC
            </p>

            <h3 className="mt-3 text-4xl font-black md:text-5xl">
              ORGULLO DE LA PAZ
            </h3>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-white/40">
                  SEDE
                </p>
                <p className="mt-2 font-black">
                  La Paz, Honduras
                </p>
              </div>

              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-white/40">
                  COMPETICIÓN
                </p>
                <p className="mt-2 font-black">
                  Liga Nacional
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>
{/* TIENDA */}
<section id="tienda" className="bg-white px-6 py-24 text-[#06152c]">
  <div className="mx-auto max-w-7xl">

    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-black tracking-[0.3em] text-cyan-600">
          TIENDA OFICIAL
        </p>

        <h2 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">
          VISTE LOS COLORES
        </h2>

        <p className="mt-5 max-w-xl text-lg text-gray-500">
          Productos oficiales de Génesis FC.
        </p>
      </div>

      <a
        href="#"
        className="text-sm font-black tracking-wide transition hover:text-cyan-600"
      >
        VER TODA LA TIENDA →
      </a>
    </div>

    {/* PRODUCTOS */}
    <div className="grid gap-6 md:grid-cols-1 grid-cols-1 md:grid-cols-3">

      {/* PRODUCTO 1 */}
      <article className="group">
        <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-[#f4f7fb]">
          <img
            src="/escudo-genesis.png"
            alt="Producto Génesis FC"
            className="h-48 w-48 object-contain transition duration-500 group-hover:scale-110"
          />
        </div>

        <div className="mt-5">
          <p className="text-xs font-black tracking-[0.2em] text-cyan-600">
            OFICIAL
          </p>
          <h3 className="mt-2 text-2xl font-black">
            CAMISETA GÉNESIS FC
          </h3>
          <p className="mt-2 font-bold text-gray-500">
            PRÓXIMAMENTE
          </p>
        </div>
      </article>

      {/* PRODUCTO 2 */}
      <article className="group">
        <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-[#06152c]">
          <img
            src="/escudo-genesis.png"
            alt="Producto oficial Génesis FC"
            className="h-48 w-48 object-contain transition duration-500 group-hover:scale-110"
          />
        </div>

        <div className="mt-5">
          <p className="text-xs font-black tracking-[0.2em] text-cyan-600">
            GÉNESIS FC
          </p>
          <h3 className="mt-2 text-2xl font-black">
            COLECCIÓN OFICIAL
          </h3>
          <p className="mt-2 font-bold text-gray-500">
            PRÓXIMAMENTE
          </p>
        </div>
      </article>

      {/* PRODUCTO 3 */}
      <article className="group">
        <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-[#f4f7fb]">
          <img
            src="/escudo-genesis.png"
            alt="Accesorios Génesis FC"
            className="h-48 w-48 object-contain transition duration-500 group-hover:scale-110"
          />
        </div>

        <div className="mt-5">
          <p className="text-xs font-black tracking-[0.2em] text-cyan-600">
            ACCESORIOS
          </p>
          <h3 className="mt-2 text-2xl font-black">
            ACCESORIOS GÉNESIS
          </h3>
          <p className="mt-2 font-bold text-gray-500">
            PRÓXIMAMENTE
          </p>
        </div>
      </article>

    </div>
  </div>
</section>
      {/* FOOTER */}
      {/* FOOTER PROFESIONAL */}
<footer className="bg-[#020817] px-6 pb-10 pt-20 text-white">
  <div className="mx-auto max-w-7xl">

    {/* PARTE PRINCIPAL */}
    <div className="grid gap-14 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-4">

      {/* CLUB */}
      <div>
        <img
          src="/escudo-genesis.png"
          alt="Génesis FC"
          className="h-24 w-24 object-contain"
        />

        <h2 className="mt-6 text-2xl font-black">
          GÉNESIS FC
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">
          Sitio oficial de Génesis FC. Orgullo, identidad y fútbol desde La Paz,
          Honduras.
        </p>
      </div>

      {/* NAVEGACIÓN */}
      <div>
        <p className="text-xs font-black tracking-[0.25em] text-cyan-300">
          NAVEGACIÓN
        </p>

        <div className="mt-6 flex flex-col gap-4 text-sm font-bold text-white/70">
          <a href="#" className="transition hover:text-white">INICIO</a>
          <a href="#partidos" className="transition hover:text-white">PARTIDOS</a>
          <a href="#equipo" className="transition hover:text-white">EQUIPO</a>
          <a href="#noticias" className="transition hover:text-white">NOTICIAS</a>
          <a href="#club" className="transition hover:text-white">CLUB</a>
          <a href="#tienda" className="transition hover:text-white">TIENDA</a>
        </div>
      </div>

      {/* CLUB */}
      <div>
        <p className="text-xs font-black tracking-[0.25em] text-cyan-300">
          EL CLUB
        </p>

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="text-white/40">SEDE</p>
            <p className="mt-1 font-bold">La Paz, Honduras</p>
          </div>

          <div>
            <p className="text-white/40">COMPETICIÓN</p>
            <p className="mt-1 font-bold">Liga Nacional de Honduras</p>
          </div>

          <div>
            <p className="text-white/40">CLUB</p>
            <p className="mt-1 font-bold">Génesis FC</p>
          </div>
        </div>
      </div>

      {/* REDES */}
      <div>
        <p className="text-xs font-black tracking-[0.25em] text-cyan-300">
          SÍGUENOS
        </p>

        <p className="mt-6 text-sm leading-6 text-white/50">
          Sigue toda la actualidad de Génesis FC en nuestras redes sociales.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#"
            className="rounded-full border border-white/15 px-5 py-3 text-xs font-black transition hover:bg-white hover:text-[#06152c]"
          >
            FACEBOOK
          </a>

          <a
            href="#"
            className="rounded-full border border-white/15 px-5 py-3 text-xs font-black transition hover:bg-white hover:text-[#06152c]"
          >
            INSTAGRAM
          </a>

          <a
            href="#"
            className="rounded-full border border-white/15 px-5 py-3 text-xs font-black transition hover:bg-white hover:text-[#06152c]"
          >
            TIKTOK
          </a>
        </div>
      </div>

    </div>

    {/* PARTE INFERIOR */}
    <div className="flex flex-col gap-4 pt-8 text-xs font-bold text-white/35 md:flex-row md:items-center md:justify-between">
      <p>
        © 2026 GÉNESIS FC. TODOS LOS DERECHOS RESERVADOS.
      </p>

      <p>
        LA PAZ · HONDURAS
      </p>
    </div>

  </div>
</footer>

    </main>
  );
}