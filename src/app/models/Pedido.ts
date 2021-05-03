import { Base } from "./Base";
import { DetallePedido } from "./DetallePedido";
import { Domicilio } from "./Domicilio";
import { Factura } from "./Factura";
import { MercadopagoDatos } from "./MercadopagoDatos";


export class Pedido implements Base{
    id!: number;
    fecha!: string;
    numero!: number;
    estado!: number;
    horaEstimadaFin!: string;
    tipoEnvio!: number;
    total!: number;
    detallePedido!: DetallePedido[];
    domicilio!: Domicilio;
    mercadopagoDatos!: MercadopagoDatos;
    factura!: Factura;

}