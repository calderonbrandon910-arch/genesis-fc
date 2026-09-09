export default function ArticuloPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <article className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">

        {/* VOLVER */}
        <a
          href="/#noticias"
          className="mb-12 inline-block text-sm font-black uppercase tracking-wider text-cyan-500"
        >
          ← VOLVER A NOTICIAS
        </a>

        {/* CATEGORÍA */}
        <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-cyan-500">
          PRIMER EQUIPO
        </p>

        {/* TÍTULO */}
        <h1 className="max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl">
          Génesis FC busca mantener el impulso ante Olancho FC
        </h1>

        {/* INTRODUCCIÓN */}
        <p className="mt-7 max-w-4xl text-xl font-medium leading-8 text-slate-500 md:text-2xl">
          Los Caninos llegan fortalecidos tras su contundente victoria en
          Juticalpa y ahora tienen la mirada puesta en un nuevo desafío ante
          los Potros.
        </p>

        {/* FOTO PRINCIPAL */}
        <div className="mt-12">
          <img
            src="/perrunos.jpg"
            alt="Génesis FC"
            className="w-full rounded-[32px] object-cover"
          />
        </div>

        {/* PRIMERA PARTE DEL ARTÍCULO */}
        <div className="mt-14 max-w-4xl space-y-7 text-lg leading-8 text-slate-700 md:text-xl md:leading-9">
          <p>
            Génesis FC se prepara para afrontar un nuevo desafío en la Liga
            Nacional frente a Olancho FC, en un compromiso importante para
            continuar sumando y seguir avanzando en el campeonato.
          </p>

          <p>
            Los Caninos llegan con confianza después de conseguir una
            contundente victoria 0-3 en su visita a Juticalpa, un resultado
            que fortalece al plantel de cara al próximo encuentro.
          </p>

          <p>
            Olancho FC, por su parte, viene de igualar 0-0 en su visita a
            Choloma. Los Potros también buscarán volver al triunfo, por lo que
            ambos equipos llegarán con la intención de quedarse con los tres
            puntos.
          </p>

          <div className="my-12 border-l-4 border-cyan-500 pl-6">
            <p className="text-2xl font-black leading-9 text-slate-900 md:text-3xl md:leading-10">
              Una victoria permitiría a Génesis FC alcanzar los 13 puntos y
              continuar dando pasos importantes en el campeonato.
            </p>
          </div>

          <p>
            Para Olancho FC el partido también representa una oportunidad
            importante, ya que una victoria le permitiría alcanzar las 12
            unidades.
          </p>
        </div>

        {/* SEGUNDA FOTO */}
        <div className="my-14">
          <img
            src="/potrolancho.jpg"
            alt="Génesis FC frente a Olancho FC"
            className="w-full rounded-[32px] object-cover"
          />
        </div>

        {/* SEGUNDA PARTE DEL ARTÍCULO */}
        <div className="max-w-4xl space-y-7 text-lg leading-8 text-slate-700 md:text-xl md:leading-9">

          <h2 className="pt-2 text-3xl font-black text-slate-900 md:text-4xl">
            Un antecedente reciente
          </h2>

          <p>
            El encuentro también trae consigo un antecedente reciente entre
            ambos clubes. La última vez que Génesis FC y Olancho FC se
            enfrentaron, el partido terminó empatado 1-1.
          </p>

          <p>
            Génesis llegaba a aquel compromiso después de haber conseguido una
            importante victoria en territorio olanchano. Aquellos resultados
            terminaron siendo determinantes para que los Caninos avanzaran y
            Olancho FC quedara fuera de las triangulares eliminatorias.
          </p>

          <p>
            Ese antecedente forma parte de la historia reciente entre ambos
            equipos, pero ahora comienza un nuevo capítulo. Génesis buscará
            trasladar al próximo compromiso la intensidad y contundencia
            mostradas en Juticalpa.
          </p>

          <p>
            El plantel continúa trabajando con la mirada puesta en los tres
            puntos, consciente de la importancia de mantener el buen momento y
            seguir creciendo jornada tras jornada.
          </p>

          <p className="pt-5 text-2xl font-black text-slate-900">
            Los Caninos van por más.
          </p>

        </div>
      </article>
    </main>
  );
}