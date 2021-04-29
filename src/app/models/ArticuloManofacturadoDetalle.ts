import { ArticuloInsumo } from "./ArticuloInsumo";
import { Base } from "./Base";


export class ArticuloManofacturadoDetalle implements Base{
    id!: number;
    cantidad!: number;
    unidadMedida!: string;
    articuloInsumo!: ArticuloInsumo;
}