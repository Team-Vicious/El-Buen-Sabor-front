import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  constructor(
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute
    ) { }

  usuarioId!: number;
  pedidoId!: number;
  resultado!: string;
  pedido!: Pedido;

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.pedidoId = +this.route.snapshot.paramMap.get('idp')!;
    this.resultado = this.route.snapshot.paramMap.get('resultado')!;
    //this.resultado = this.route.snapshot.paramMap.get('pendiente')!;
    //this.resultado = this.route.snapshot.paramMap.get('error')!;
    

    this.pedidoService.ver(this.pedidoId).subscribe(pedido => {
      this.pedido = pedido;
      
      //actualiar el tipo de pago
      this.tipoPago();
    });
  }

  tipoPago(){
    //si tiene mp estonces fue pagado con mp, sino fue pagado de contado retiro en local
    if(this.pedido.mercadopagoDatos){

      //indica el metodo del pago depende el resultado
      //this.pedido.mercadopagoDatos.metodoPago = "1" //1 tarjeta o transferencia - 2 rapipago/pagofacil - 3 sin pagar error 
      //actualizar mp con el tipo de pago
      //this.pedido.mercadopagoDatos.estado = "1";//0 sin pagar, 1 pagado, 2 pendiente
      if(this.resultado == "exitoso"){
        this.pedido.mercadopagoDatos.metodoPago = "1";
        this.pedido.mercadopagoDatos.estado = "1";
      }
      
      if(this.resultado == "pendiente"){
        this.pedido.mercadopagoDatos.metodoPago = "2";
        this.pedido.mercadopagoDatos.estado = "0";
      }

      if(this.resultado == "error"){
        this.pedido.mercadopagoDatos.metodoPago = "3";
        this.pedido.mercadopagoDatos.estado = "0";
      }

      //persistir***********
      this.pedidoService.editar(this.pedido).subscribe( pedido => console.log("pedido actualizado",pedido.id));
      }
  }

}
