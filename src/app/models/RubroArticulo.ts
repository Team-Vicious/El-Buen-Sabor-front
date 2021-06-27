import { Base } from "./Base";


export class RubroArticulo implements Base{
    id!: number;
    denominacion!: string;
    padre!: RubroArticulo;
    hijos: RubroArticulo[] = [];
    fechaBaja!: Date;
}