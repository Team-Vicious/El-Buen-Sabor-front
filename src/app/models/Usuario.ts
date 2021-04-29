import { Base } from "./Base";
import { Cliente } from "./Cliente";


export class Usuario implements Base{
    id!: number;
    usuario!: string;
    clave!: string;
    rol!: string;
    cliente!: Cliente;

}


