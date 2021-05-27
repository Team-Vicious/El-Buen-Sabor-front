import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
    ) { }

  usuarioId!: number;
  pedidoId!: number;
  resultado!: string;

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.pedidoId = +this.route.snapshot.paramMap.get('idp')!;
    this.resultado = this.route.snapshot.paramMap.get('exitoso')!;
    this.resultado = this.route.snapshot.paramMap.get('pendiente')!;
    this.resultado = this.route.snapshot.paramMap.get('error')!;
  }

  tipoPago(){
    //actualizar mp con el tipo de pago
    //this.pedido.mercadopagoDatos.metodoPago = 1 //1 tarjeta o transferencia - 2 rapipago/pagofacil - 3 sin pagar error 
    //this.pedido.mercadopagoDatos.estado = "1";//0 sin pagar, 1 pagado, 2 pendiente
    
    //esto iria en otro componente
    //factura.formaPago
    //factura.monto desc
  }

}
