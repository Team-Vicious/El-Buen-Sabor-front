import { Base } from "./Base";
import { Domicilio } from "./Domicilio";
import { Pedido } from "./Pedido";


export class Cliente implements Base{
    id!:number;
    nombre!: string;
    apellido!: string;
    telefono!: string;
    email!: string;
    domicilio!: Domicilio;
    pedido: Pedido[] = [];
    fechaBaja!: Date;

}
