import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManofacturado } from "./ArticuloManofacturado";
import { Base } from "./Base";


export class DetalleFactura implements Base{
    id!: number;
    cantidad!: number;
    subtotal!: number;
    articuloManofacturado!: ArticuloManofacturado;
    articuloInsumo!: ArticuloInsumo;
    
}