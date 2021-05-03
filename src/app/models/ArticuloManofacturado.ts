import { ArticuloManofacturadoDetalle } from "./ArticuloManofacturadoDetalle";
import { Base } from "./Base";
import { RubroGeneral } from "./RubroGeneral";



export class ArticuloManofacturado implements Base{
    id!: number;
    tiempoEstimadoCocina!: number;
    denominacion!: string;
    precioVenta!: number;
    imagen!: string;
    articuloManofactudaroDetalle!:ArticuloManofacturadoDetalle;
    rubroGeneral!: RubroGeneral;
}
