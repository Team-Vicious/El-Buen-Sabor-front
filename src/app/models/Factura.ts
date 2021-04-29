import { Base } from "./Base";
import { DetalleFactura } from "./DetalleFactura";


export class Factura implements Base{
    id!: number;
    fecha!: string;
    numero!: number;
    montoDescuento!: number;
    formaPago!: string;
    nroTarjeta!: string;
    TotalVenta!: number;
    TotalCosto!: number;
    detalleFactura!: DetalleFactura[];
}