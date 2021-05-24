import { Base } from "./Base";
import { RubroArticulo } from "./RubroArticulo";

export class ArticuloInsumo implements Base{
    id!: number;
    denominacion!: string;
    precioCompra!: number;
    precioVenta!: number;
    stockActual!: number;
    stockMinimo!: number;
    unidadMedida!: string;
    esInsumo!: boolean;
    rubroArticulo!: RubroArticulo;
    fechaBaja!: Date;
}