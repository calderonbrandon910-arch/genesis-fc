"use client";

import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type MensajeChat = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type MensajeHistorialApi = {
  role: "user" | "assistant";
  content: string;
};

type RespuestaApi = {
  ok?: boolean;
  respuesta?: string;
  error?: string;
};

const MENSAJE_BIENVENIDA: MensajeChat = {
  id: "bienvenida",
  role: "assistant",
  text:
    "¡Hola! 👋 Soy el Asistente Génesis. Puedo ayudarte con información del club, partidos, plantel, historia, noticias, tienda y seguimiento de pedidos.",
};

const SUGERENCIAS = [
  "¿Dónde compro el jersey?",
  "Ver próximos partidos",
  "Seguir mi pedido",
  "Historia del club",
];

const RUTAS: Record<
  string,
  {
    href: string;
    label: string;
  }
> = {
  "/tienda/seguimiento": {
    href: "/tienda/seguimiento",
    label: "Seguir mi pedido",
  },

  "/tienda": {
    href: "/tienda",
    label: "Tienda Oficial",
  },

  "/plantel": {
    href: "/equipo",
    label: "Ver plantel",
  },

  "/equipo": {
    href: "/equipo",
    label: "Ver plantel",
  },

  "/partidos": {
    href: "/partidos",
    label: "Ver partidos",
  },

  "/calendario": {
    href: "/calendario",
    label: "Ver calendario",
  },

  "/noticias": {
    href: "/noticias",
    label: "Ver noticias",
  },

  "/historia": {
    href: "/historia",
    label: "Nuestra historia",
  },
};

function crearId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function limpiarMarkdown(texto: string) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function detectarRutas(texto: string) {
  const encontradas: string[] = [];

  const rutasOrdenadas = Object.keys(
    RUTAS
  ).sort(
    (a, b) =>
      b.length - a.length
  );

  for (const ruta of rutasOrdenadas) {
    if (
      texto
        .toLowerCase()
        .includes(
          ruta.toLowerCase()
        ) &&
      !encontradas.includes(ruta)
    ) {
      encontradas.push(ruta);
    }
  }

  const textoNormalizado =
    texto.toLowerCase();

  if (
    (
      textoNormalizado.includes(
        "tienda oficial"
      ) ||
      textoNormalizado.includes(
        "comprar el jersey"
      ) ||
      textoNormalizado.includes(
        "comprar el uniforme"
      ) ||
      textoNormalizado.includes(
        "comprar la camiseta"
      ) ||
      textoNormalizado.includes(
        "comprar jersey"
      )
    ) &&
    !encontradas.includes(
      "/tienda"
    )
  ) {
    encontradas.push(
      "/tienda"
    );
  }

  if (
    (
      textoNormalizado.includes(
        "seguir mi pedido"
      ) ||
      textoNormalizado.includes(
        "seguimiento de pedido"
      ) ||
      textoNormalizado.includes(
        "seguimiento del pedido"
      ) ||
      textoNormalizado.includes(
        "rastrear mi pedido"
      ) ||
      textoNormalizado.includes(
        "consultar mi pedido"
      ) ||
      textoNormalizado.includes(
        "estado de mi pedido"
      )
    ) &&
    !encontradas.includes(
      "/tienda/seguimiento"
    )
  ) {
    encontradas.unshift(
      "/tienda/seguimiento"
    );
  }

  if (
    (
      textoNormalizado.includes(
        "historia del club"
      ) ||
      textoNormalizado.includes(
        "nuestra historia"
      )
    ) &&
    !encontradas.includes(
      "/historia"
    )
  ) {
    encontradas.push(
      "/historia"
    );
  }

  if (
    (
      textoNormalizado.includes(
        "plantel"
      ) ||
      textoNormalizado.includes(
        "plantilla"
      ) ||
      textoNormalizado.includes(
        "jugadores"
      )
    ) &&
    !encontradas.includes(
      "/equipo"
    ) &&
    !encontradas.includes(
      "/plantel"
    )
  ) {
    encontradas.push(
      "/equipo"
    );
  }

  if (
    (
      textoNormalizado.includes(
        "próximos partidos"
      ) ||
      textoNormalizado.includes(
        "proximos partidos"
      ) ||
      textoNormalizado.includes(
        "calendario"
      ) ||
      textoNormalizado.includes(
        "cuándo juega"
      ) ||
      textoNormalizado.includes(
        "cuando juega"
      )
    ) &&
    !encontradas.includes(
      "/calendario"
    ) &&
    !encontradas.includes(
      "/partidos"
    )
  ) {
    encontradas.push(
      "/calendario"
    );
  }

  return encontradas.slice(
    0,
    3
  );
}

function renderizarTextoConNegrita(
  texto: string
): ReactNode[] {
  const partes = texto.split(
    /(\*\*.*?\*\*)/g
  );

  return partes.map(
    (parte, index) => {
      if (
        parte.startsWith(
          "**"
        ) &&
        parte.endsWith(
          "**"
        )
      ) {
        return (
          <strong
            key={`${parte}-${index}`}
            className="font-black text-white"
          >
            {parte.slice(
              2,
              -2
            )}
          </strong>
        );
      }

      return (
        <span
          key={`${parte}-${index}`}
        >
          {parte}
        </span>
      );
    }
  );
}

function ContenidoMensaje({
  texto,
}: {
  texto: string;
}) {
  const rutas =
    detectarRutas(texto);

  const lineas = texto
    .replace(
      /https?:\/\/(?:www\.)?genesisfc\.app(\/[^\s]*)?/gi,
      "$1"
    )
    .split("\n")
    .filter(
      (
        linea,
        index,
        array
      ) => {
        if (
          linea.trim()
        ) {
          return true;
        }

        return (
          index > 0 &&
          index <
            array.length -
              1
        );
      }
    );

  return (
    <div>
      <div className="space-y-2">
        {lineas.map(
          (
            linea,
            index
          ) => {
            const esLista =
              linea
                .trim()
                .startsWith(
                  "- "
                ) ||
              linea
                .trim()
                .startsWith(
                  "• "
                );

            const contenido =
              esLista
                ? linea
                    .trim()
                    .slice(2)
                : linea;

            return (
              <div
                key={`${linea}-${index}`}
                className={
                  esLista
                    ? "flex items-start gap-2"
                    : ""
                }
              >
                {esLista && (
                  <span
                    aria-hidden="true"
                    className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300"
                  />
                )}

                <p className="whitespace-pre-wrap">
                  {renderizarTextoConNegrita(
                    contenido
                  )}
                </p>
              </div>
            );
          }
        )}
      </div>

      {rutas.length >
        0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {rutas.map(
            (ruta) => {
              const destino =
                RUTAS[
                  ruta
                ];

              if (
                !destino
              ) {
                return null;
              }

              return (
                <Link
                  key={
                    ruta
                  }
                  href={
                    destino.href
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.09] px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.1em] text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300 hover:text-[#03122b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {
                    destino.label
                  }

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default function AsistenteGenesis() {
  const [
    abierto,
    setAbierto,
  ] = useState(false);

  const [
    mensajes,
    setMensajes,
  ] = useState<
    MensajeChat[]
  >([
    MENSAJE_BIENVENIDA,
  ]);

  const [
    entrada,
    setEntrada,
  ] = useState("");

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const finalMensajesRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  useEffect(() => {
    if (!abierto) {
      return;
    }

    finalMensajesRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
        block: "end",
      }
    );
  }, [
    mensajes,
    enviando,
    abierto,
  ]);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          textareaRef.current?.focus();
        },
        150
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [abierto]);

  async function enviarMensaje(
    mensajeManual?: string
  ) {
    const texto = (
      mensajeManual ??
      entrada
    ).trim();

    if (
      !texto ||
      enviando
    ) {
      return;
    }

    const textoSeguro =
      texto.slice(
        0,
        1000
      );

    /*
    =========================================================
    HISTORIAL PARA NUESTRA API

    IMPORTANTE:
    /api/asistente espera exactamente:

    {
      role: "user" | "assistant",
      content: string
    }

    No usamos "model" ni "text" aquí.
    =========================================================
    */

    const historial: MensajeHistorialApi[] =
      mensajes
        .filter(
          (
            mensaje
          ) =>
            mensaje.id !==
            "bienvenida"
        )
        .slice(-10)
        .map(
          (
            mensaje
          ) => ({
            role:
              mensaje.role,
            content:
              mensaje.text,
          })
        );

    const mensajeUsuario: MensajeChat =
      {
        id: crearId(),
        role: "user",
        text: textoSeguro,
      };

    setMensajes(
      (
        actuales
      ) => [
        ...actuales,
        mensajeUsuario,
      ]
    );

    setEntrada("");
    setEnviando(
      true
    );

    try {
      const respuesta =
        await fetch(
          "/api/asistente",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                mensaje:
                  textoSeguro,

                historial,
              }
            ),
          }
        );

      let datos: RespuestaApi =
        {};

      try {
        datos =
          (await respuesta.json()) as RespuestaApi;
      } catch {
        datos = {};
      }

      if (
        !respuesta.ok ||
        !datos.ok ||
        !datos.respuesta
      ) {
        console.error(
          "Respuesta inválida del asistente:",
          {
            status:
              respuesta.status,
            datos,
          }
        );

        setMensajes(
          (
            actuales
          ) => [
            ...actuales,
            {
              id: crearId(),
              role:
                "assistant",
              text:
                datos.error ||
                "Ahora mismo no pude responder. Inténtalo nuevamente en unos segundos.",
            },
          ]
        );

        return;
      }

      const textoRespuesta =
        datos.respuesta.trim();

      setMensajes(
        (
          actuales
        ) => [
          ...actuales,
          {
            id: crearId(),
            role:
              "assistant",
            text:
              textoRespuesta,
          },
        ]
      );
    } catch (
      error
    ) {
      console.error(
        "Error conectando con el Asistente Génesis:",
        error
      );

      setMensajes(
        (
          actuales
        ) => [
          ...actuales,
          {
            id: crearId(),
            role:
              "assistant",
            text:
              "Ahora mismo no pude responder. Inténtalo nuevamente en unos segundos.",
          },
        ]
      );
    } finally {
      setEnviando(
        false
      );
    }
  }

  function manejarSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void enviarMensaje();
  }

  function manejarTeclado(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key ===
        "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent
        .isComposing
    ) {
      event.preventDefault();

      void enviarMensaje();
    }
  }

  function nuevaConversacion() {
    if (enviando) {
      return;
    }

    setMensajes([
      MENSAJE_BIENVENIDA,
    ]);

    setEntrada("");

    window.setTimeout(
      () => {
        textareaRef.current?.focus();
      },
      100
    );
  }

  return (
    <>
      {/* =====================================================
          VENTANA DEL ASISTENTE
      ===================================================== */}

      {abierto && (
        <section
          aria-label="Chat del Asistente Génesis"
          className="fixed bottom-[96px] right-4 z-[100] flex h-[min(680px,calc(100dvh-120px))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#03122b] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:bottom-[110px] sm:right-6"
        >
          {/* =================================================
              CABECERA
          ================================================= */}

          <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#0757bb] to-[#159cc4] px-5 py-5">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/[0.07]"
            />

            <div
              aria-hidden="true"
              className="absolute left-20 top-0 h-32 w-32 rounded-full bg-white/[0.04]"
            />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/20 bg-white/10">
                  <span className="text-xl font-black text-white">
                    G
                  </span>

                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0b75c9] bg-emerald-400"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[15px] font-black uppercase tracking-[-0.03em] text-white">
                      Asistente
                      Génesis
                    </h2>

                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-cyan-100">
                      IA
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-emerald-400"
                    />

                    <p className="truncate text-[7px] font-black uppercase tracking-[0.18em] text-cyan-100/80">
                      Asistente
                      oficial del
                      sitio
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAbierto(
                    false
                  )
                }
                aria-label="Cerrar Asistente Génesis"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ×
              </button>
            </div>
          </header>

          {/* =================================================
              MENSAJES
          ================================================= */}

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-4">
              {mensajes.map(
                (
                  mensaje
                ) => {
                  const esUsuario =
                    mensaje.role ===
                    "user";

                  return (
                    <div
                      key={
                        mensaje.id
                      }
                      className={`flex ${
                        esUsuario
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-[22px] px-4 py-4 text-[13px] leading-6 ${
                          esUsuario
                            ? "rounded-br-[7px] bg-[#159cc4] text-white"
                            : "rounded-bl-[7px] border border-white/10 bg-white/[0.07] text-white/90"
                        }`}
                      >
                        {!esUsuario && (
                          <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300 text-[9px] font-black text-[#03122b]">
                              G
                            </span>

                            <span className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-300">
                              Génesis
                            </span>
                          </div>
                        )}

                        {esUsuario ? (
                          <p className="whitespace-pre-wrap">
                            {limpiarMarkdown(
                              mensaje.text
                            )}
                          </p>
                        ) : (
                          <ContenidoMensaje
                            texto={
                              mensaje.text
                            }
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              )}

              {enviando && (
                <div className="flex justify-start">
                  <div className="rounded-[22px] rounded-bl-[7px] border border-white/10 bg-white/[0.07] px-4 py-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300 text-[9px] font-black text-[#03122b]">
                        G
                      </span>

                      <span className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-300">
                        Génesis
                      </span>
                    </div>

                    <div
                      aria-label="Asistente escribiendo"
                      className="flex items-center gap-1.5"
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/50" />
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={
                  finalMensajesRef
                }
              />
            </div>

            {/* =================================================
                SUGERENCIAS
            ================================================= */}

            {mensajes.length ===
              1 &&
              !enviando && (
                <div className="mt-5">
                  <p className="mb-3 text-[7px] font-black uppercase tracking-[0.18em] text-white/30">
                    Puedes
                    preguntarme
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {SUGERENCIAS.map(
                      (
                        sugerencia
                      ) => (
                        <button
                          key={
                            sugerencia
                          }
                          type="button"
                          disabled={
                            enviando
                          }
                          onClick={() =>
                            void enviarMensaje(
                              sugerencia
                            )
                          }
                          className="rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-left text-[9px] font-bold text-white/70 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.08] hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {
                            sugerencia
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* =================================================
              CAJA DE MENSAJE
          ================================================= */}

          <div className="border-t border-white/10 bg-[#03122b] p-4">
            <form
              onSubmit={
                manejarSubmit
              }
              className="flex items-end gap-2"
            >
              <div className="flex-1 rounded-[20px] border border-white/10 bg-white/[0.055] px-4 py-3 transition focus-within:border-cyan-300/40">
                <textarea
                  ref={
                    textareaRef
                  }
                  value={
                    entrada
                  }
                  maxLength={
                    1000
                  }
                  rows={1}
                  disabled={
                    enviando
                  }
                  onChange={(
                    event
                  ) =>
                    setEntrada(
                      event
                        .target
                        .value
                    )
                  }
                  onKeyDown={
                    manejarTeclado
                  }
                  placeholder="Pregúntame sobre Génesis FC..."
                  aria-label="Mensaje para el Asistente Génesis"
                  className="max-h-28 min-h-[24px] w-full resize-none bg-transparent text-[12px] leading-5 text-white outline-none placeholder:text-white/25 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={
                  enviando ||
                  !entrada.trim()
                }
                aria-label="Enviar mensaje"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-cyan-300 text-xl font-black text-[#03122b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                →
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-[6px] text-white/25">
                La IA puede
                cometer errores.
              </p>

              <button
                type="button"
                onClick={
                  nuevaConversacion
                }
                disabled={
                  enviando
                }
                className="text-[6px] font-black uppercase tracking-[0.13em] text-white/30 transition hover:text-cyan-300 disabled:opacity-40"
              >
                Nueva
                conversación
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          BOTÓN FLOTANTE
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setAbierto(
            (
              actual
            ) =>
              !actual
          )
        }
        aria-expanded={
          abierto
        }
        aria-label={
          abierto
            ? "Cerrar Asistente Génesis"
            : "Abrir Asistente Génesis"
        }
        className="fixed bottom-5 right-4 z-[101] flex items-center gap-3 rounded-full border border-white/15 bg-[#0757bb] p-2.5 pr-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:bg-[#0968d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:bottom-6 sm:right-6"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-xl font-black text-[#03122b]">
          {abierto
            ? "×"
            : "G"}
        </span>

        <span className="hidden text-left sm:block">
          <span className="block text-[9px] font-black uppercase tracking-[0.1em]">
            Asistente
            Génesis
          </span>

          <span className="mt-0.5 block text-[6px] font-black uppercase tracking-[0.16em] text-cyan-200">
            Pregúntame
          </span>
        </span>
      </button>
    </>
  );
}