import { Base } from "./Base";


export class MercadopagoDatos implements Base{
    id!: number;
    fechaCreacion!: string;
    fechaAprobacion!: string;
    formaPago!: string;
    metodoPago!: string;
    nroTarjeta!: string;
    estado!: string;
    fechaBaja!: Date;
}