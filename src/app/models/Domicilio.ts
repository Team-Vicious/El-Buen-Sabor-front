import { Base } from "./Base";


export class Domicilio implements Base{
    id!: number;
    calle!: string;
    numero!: number;
    localidad!: string;
    fechaBaja!: Date;
}
