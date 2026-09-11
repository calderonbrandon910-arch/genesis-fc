export type TarifaEnvio = {
    ciudad: string;
    costo: number | null;
    disponible: boolean;
};

export const TARIFAS_ENVIO: TarifaEnvio[] = [
    {
        ciudad: "La Paz",
        costo: null,
        disponible: false,
    },
    {
        ciudad: "Tegucigalpa",
        costo: null,
        disponible: false,
    },
    {
        ciudad: "Comayagua",
        costo: null,
        disponible: false,
    },
    {
        ciudad: "San Pedro Sula",
        costo: null,
        disponible: false,
    },
    {
        ciudad: "Otra ciudad",
        costo: null,
        disponible: false,
    },
];

export function obtenerTarifaEnvio(
    ciudad: string
) {
    return (
        TARIFAS_ENVIO.find(
            (tarifa) =>
                tarifa.ciudad === ciudad
        ) ?? null
    );
}