import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManofacturado } from "./ArticuloManofacturado";
import { Base } from "./Base";


export class DetallePedido implements Base{
    id!: number;
    cantidad!: number;
    subtoral!: number;
    articuloManofacturado!: ArticuloManofacturado;
    articuloInsumo!: ArticuloInsumo;
    
}