import { Base } from "./Base";
import { DetalleFactura } from "./DetalleFactura";


export class Factura implements Base{
    id!: number;
    fecha!: Date;
    numero!: number;
    montoDescuento!: number;
    formaPago!: string;
    nroTarjeta!: string;
    totalVenta!: number;
    totalCosto!: number;
    detalleFactura!: DetalleFactura[];
    fechaBaja!: Date;
}