import { Base } from "./Base";


export class MercadopagoDatos implements Base{
    id!: number;
    fechaCreacion!: Date;
    fechaAprobacion!: Date;
    formaPago!: string;
    metodoPago!: string;
    nroTarjeta!: string;
    estado!: string;
    preferenceId!: string;
    fechaBaja!: Date;

}