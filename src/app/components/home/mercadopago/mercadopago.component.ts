import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/usuario';
import { MercadopagoDatosService } from 'src/app/services/mercadopagoDatos.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var abrirCheckout: any;

@Component({
  selector: 'app-mercadopago',
  templateUrl: './mercadopago.component.html',
  styleUrls: ['./mercadopago.component.css']
})
export class MercadopagoComponent implements OnInit {

  usuarioId: any;
  usuario!: Usuario;
  id!: string;
  texto: string = "soy un texto";
  pedido!: Pedido;

  constructor(
    protected mercadopagoService: MercadopagoDatosService,
    protected usuarioService: UsuarioService,
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.usuarioService.ver(this.usuarioId).subscribe( usuario => {
      this.usuario = usuario;

      //obtengo el ultimo pedido del usuario(actual a pagar)
      this.pedido = usuario.cliente.pedido[usuario.cliente.pedido.length -1];
    });


    //this.id = "736455939-7b77546b-fc99-47bf-98cf-b801e91f5d9a";
  }

  hola(texto: string){
    //reducir stock de insumos
    alert(texto);
    console.log(texto);
  }

  mpCheckout(){
    //llamar a la api y que genere el preference id
    this.mercadopagoService.getMPDPreferenceId(this.usuarioId, this.pedido.id, this.pedido).subscribe(mp => {
      //asigno mpDatos al pedido y lo actualizo
      this.pedido.mercadopagoDatos = mp;
      this.pedidoService.editar(this.pedido);

      //ejecuto el check out de mp
      new abrirCheckout(this.pedido.mercadopagoDatos.preferenceId);
    });
  }

}
